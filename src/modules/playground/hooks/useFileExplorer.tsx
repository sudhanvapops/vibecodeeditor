import { toast } from "sonner"
import { create } from "zustand"

import { TemplateFile, TemplateFolder } from "../lib/pathToJson-util"
import { generateFileId } from "../lib"
import { sortFileExplorer } from "../lib/sortJson"
import type { RuntimeAdapter } from "@/modules/runtime/types"
import { fileManager } from "../file-system/FileManager"



interface OpenFile {
    id: string,
    filename: string;
    fileExtension: string;
}

interface FileExplorerState {

    playgroundId: string,
    templateData: TemplateFolder | null,
    openFiles: OpenFile[],
    activeFileId: string | null,

    //   Setter Functions
    setPlaygroundId: (id: string) => void;
    setTemplateData: (data: TemplateFolder | null) => void;
    setOpenFiles: (files: OpenFile[]) => void;
    setActiveFileId: (fileId: string | null) => void;

    //   Functions
    openFile: (file: TemplateFile) => void;
    closeFile: (fileId: string) => void;
    closeAllFiles: () => void;


    // File Explorer Methods
    handleAddFile: (
        newFile: TemplateFile,
        parentPath: string,
        writeFileSync: (filePath: string, content: string) => Promise<void>,
        instance: RuntimeAdapter,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>
    ) => Promise<void>;

    handleAddFolder: (
        newFolder: TemplateFolder,
        parentPath: string,
        instance: RuntimeAdapter,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>
    ) => Promise<void>;

    handleDeleteFile: (
        file: TemplateFile,
        parentPath: string,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>,
        instance: RuntimeAdapter
    ) => Promise<void>;

    handleDeleteFolder: (
        folder: TemplateFolder,
        parentPath: string,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>,
        instance: RuntimeAdapter
    ) => Promise<void>;

    handleRenameFile: (
        file: TemplateFile,
        newFilename: string,
        newExtension: string,
        parentPath: string,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>,
        instance: RuntimeAdapter
    ) => Promise<void>;

    handleRenameFolder: (
        folder: TemplateFolder,
        newFolderName: string,
        parentPath: string,
        saveTemplateData: (data: TemplateFolder) => Promise<TemplateFolder>,
        instance: RuntimeAdapter
    ) => Promise<void>;

    updateFileContent: (fileId: string, content: string) => void;

}


// @ts-ignore
export const useFileExplorer = create<FileExplorerState>((set, get) => ({

    // ! Data
    templateData: null,
    playgroundId: "",
    openFiles: [] satisfies OpenFile[],
    activeFileId: null,

    // ! setters
    setTemplateData: (data) => set({ templateData: data }), // folder structure data
    setPlaygroundId(id) {
        set({ playgroundId: id })
    },
    setOpenFiles: (files) => set({ openFiles: files }),
    setActiveFileId(fileId) {
        set({ activeFileId: fileId })
    },


    // ! No Changes For Now

    async handleAddFile(newFile, parentPath, writeFileSync, instance, saveTemplateData) {

        // If the folder structure isn’t loaded yet → abort.
        const { templateData } = get()
        if (!templateData) return

        try {

            const updatedTemplateData = structuredClone(templateData);
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData; // refrence of deep copy of new object

            const exists = currentFolder.items.some(
                item => "filename" in item &&
                    item.filename === newFile.filename &&
                    item.fileExtension === newFile.fileExtension
            )

            if (exists) {
                toast.error("File already Exists");
                return
            }

            // Traverse Folder Path EG: src/components -> split it and traverse the array to reach target folder
            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    ) as TemplateFolder;
                    if (nextFolder) currentFolder = nextFolder;
                }
            }

            // Add the new file to items[].
            currentFolder.items.push(newFile);
            // Update state so sidebar/file tree shows the new file.
            sortFileExplorer(currentFolder)

            const previous = templateData
            set({ templateData: updatedTemplateData });

            try {
                // Use the passed saveTemplateData function
                // its a client func -> calls a server action to store new file in db
                await saveTemplateData(updatedTemplateData);
                toast.success(`Created file: ${newFile.filename}.${newFile.fileExtension}`);
            } catch (error) {
                toast.error(`Error creating the file ${newFile.filename}.${newFile.fileExtension}`)
                set({ templateData: previous });
                throw error
            }


            // Sync with web container
            if (instance) {
                const filePath = parentPath
                    ? `${parentPath}/${newFile.filename}.${newFile.fileExtension}`
                    : `${newFile.filename}.${newFile.fileExtension}`;
                await writeFileSync(filePath, newFile.content || "");
            }

            // Automatically opens the new file in the editor, so the user can start editing immediately.
            get().openFile(newFile);
        } catch (error) {
            console.error("Error adding file:", error);
            toast.error("Failed to create file");
        }

    },


    handleAddFolder: async (newFolder, parentPath, instance, saveTemplateData) => {

        // If No Folder Structure return
        const { templateData } = get();
        if (!templateData) return;

        try {

            const updatedTemplateData = structuredClone(templateData)
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData;


            // To check if Folder exists are not
            const exists = currentFolder.items.some(
                item => "foldername" in item &&
                    item.foldername === newFolder.folderName
            )

            if (exists) {
                toast.error("Folder already exists")
                return
            }


            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    ) as TemplateFolder;
                    if (!nextFolder) {
                        throw new Error(`Folder not found: ${part}`)
                    }
                    currentFolder = nextFolder;
                }
            }

            currentFolder.items.push(newFolder);
            sortFileExplorer(currentFolder)

            const previous = templateData
            set({ templateData: updatedTemplateData });

            // This try catch is for if db fails rollBack
            try {
                // Use the passed saveTemplateData function
                await saveTemplateData(updatedTemplateData);
                toast.success(`Created folder: ${newFolder.folderName}`);
            } catch (error) {
                set({ templateData: previous })
                throw error
            }



            // Sync with web container
            if (instance) {
                const folderPath = parentPath
                    ? `${parentPath}/${newFolder.folderName}`
                    : newFolder.folderName;
                await instance.makeFolder(folderPath);
            }
        } catch (error) {
            console.error("Error adding folder:", error);
            toast.error("Failed to create folder");
        }
    },


    handleDeleteFile: async (file, parentPath, saveTemplateData, instance) => {
        const { templateData, openFiles } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = structuredClone(templateData)
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData;

            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    ) as TemplateFolder;
                    if (nextFolder) currentFolder = nextFolder;
                }
            }

            currentFolder.items = currentFolder.items.filter(
                (item) =>
                    !("filename" in item) ||
                    item.filename !== file.filename ||
                    item.fileExtension !== file.fileExtension
            );

            // Find and close the file if it's open
            // Use the same ID generation logic as in openFile
            const fileId = generateFileId(file, templateData);
            const openFile = openFiles.find((f) => f.id === fileId);

            if (openFile) {
                // Close the file using the closeFile method
                get().closeFile(fileId);
            }

            sortFileExplorer(currentFolder)
            set({ templateData: updatedTemplateData });

            // Use the passed saveTemplateData function
            await saveTemplateData(updatedTemplateData);
            toast.success(`Deleted file: ${file.filename}.${file.fileExtension}`);


            // Sync with Adapters
            if (instance) {
                const filePath = parentPath
                    ? `${parentPath}/${file.filename}.${file.fileExtension}`
                    : `${file.filename}.${file.fileExtension}`;
                await instance.removeFile(filePath)
            }

        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Failed to delete file");
        }
    },


    handleDeleteFolder: async (folder, parentPath, saveTemplateData, instance) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = structuredClone(templateData)
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData;

            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    ) as TemplateFolder;
                    if (nextFolder) currentFolder = nextFolder;
                }
            }

            currentFolder.items = currentFolder.items.filter(
                (item) =>
                    !("folderName" in item) || item.folderName !== folder.folderName
            );

            // Close all files in the deleted folder recursively
            const closeFilesInFolder = (folder: TemplateFolder, currentPath: string = "") => {
                folder.items.forEach((item) => {
                    if ("filename" in item) {
                        // Generate the correct file ID using the same logic as openFile
                        const fileId = generateFileId(item, templateData);
                        get().closeFile(fileId);
                    } else if ("folderName" in item) {
                        const newPath = currentPath ? `${currentPath}/${item.folderName}` : item.folderName;
                        closeFilesInFolder(item, newPath);
                    }
                });
            };

            closeFilesInFolder(folder, parentPath ? `${parentPath}/${folder.folderName}` : folder.folderName);


            sortFileExplorer(currentFolder)
            set({ templateData: updatedTemplateData });

            // Use the passed saveTemplateData function
            await saveTemplateData(updatedTemplateData);
            toast.success(`Deleted folder: ${folder.folderName}`);

            if (instance) {
                const folderPath = parentPath
                    ? `${parentPath}/${folder.folderName}`
                    : folder.folderName;

                await instance.removeFolder(folderPath);
            }

        } catch (error) {
            console.error("Error deleting folder:", error);
            toast.error("Failed to delete folder");
        }
    },


    handleRenameFile: async (
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData,
        instance
    ) => {
        const { templateData, openFiles, activeFileId } = get();
        if (!templateData) return;

        const oldFileId = generateFileId(file, templateData);
        const newFile = { ...file, filename: newFilename, fileExtension: newExtension };
        const newFileId = generateFileId(newFile, templateData);

        try {
            const updatedTemplateData = structuredClone(templateData);
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData;

            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    );
                    if (nextFolder) currentFolder = nextFolder as TemplateFolder;
                }
            }

            const fileIndex = currentFolder.items.findIndex(
                (item) =>
                    "filename" in item &&
                    item.filename === file.filename &&
                    item.fileExtension === file.fileExtension
            );

            if (fileIndex !== -1) {
                currentFolder.items[fileIndex] = {
                    ...currentFolder.items[fileIndex],
                    filename: newFilename,
                    fileExtension: newExtension,
                };

                const updatedOpenFiles = openFiles.map((f) =>
                    f.id === oldFileId
                        ? {
                            ...f,
                            id: newFileId,
                            filename: newFilename,
                            fileExtension: newExtension,
                        }
                        : f
                );

                sortFileExplorer(currentFolder);

                set({
                    templateData: updatedTemplateData,
                    openFiles: updatedOpenFiles,
                    activeFileId:
                        activeFileId === oldFileId ? newFileId : activeFileId,
                });

                await saveTemplateData(updatedTemplateData);

                // WASM sync
                if (instance) {
                    const oldPath = parentPath
                        ? `${parentPath}/${file.filename}.${file.fileExtension}`
                        : `${file.filename}.${file.fileExtension}`;

                    const newPath = parentPath
                        ? `${parentPath}/${newFilename}.${newExtension}`
                        : `${newFilename}.${newExtension}`;

                    await instance.rename(oldPath, newPath);
                }

                toast.success(`Renamed file to: ${newFilename}.${newExtension}`);
            }
        } catch (error) {
            console.error("Error renaming file:", error);
            toast.error("Failed to rename file");
        }
    },

    handleRenameFolder: async (
        folder,
        newFolderName,
        parentPath,
        saveTemplateData,
        instance
    ) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = structuredClone(templateData);
            const pathParts = parentPath.split("/");
            let currentFolder = updatedTemplateData;

            for (const part of pathParts) {
                if (part) {
                    const nextFolder = currentFolder.items.find(
                        (item) => "folderName" in item && item.folderName === part
                    );
                    if (nextFolder) currentFolder = nextFolder as TemplateFolder;
                }
            }

            const folderIndex = currentFolder.items.findIndex(
                (item) =>
                    "folderName" in item &&
                    item.folderName === folder.folderName
            );

            if (folderIndex !== -1) {
                currentFolder.items[folderIndex] = {
                    ...currentFolder.items[folderIndex],
                    folderName: newFolderName,
                };

                sortFileExplorer(currentFolder);

                set({ templateData: updatedTemplateData });

                await saveTemplateData(updatedTemplateData);

                // 🔥 WASM sync
                if (instance) {
                    const oldPath = parentPath
                        ? `${parentPath}/${folder.folderName}`
                        : folder.folderName;

                    const newPath = parentPath
                        ? `${parentPath}/${newFolderName}`
                        : newFolderName;

                    await instance.rename(oldPath, newPath);
                }

                toast.success(`Renamed folder to: ${newFolderName}`);
            }
        } catch (error) {
            console.error("Error renaming folder:", error);
            toast.error("Failed to rename folder");
        }
    },

    // ! Changed Functions

    // Can be better
    openFile(file) {
        // Zustand no longer owns editor content.

        // Generates File ID
        const fileId = generateFileId(file, get().templateData!)
        const { openFiles } = get()

        const existingFile = openFiles.find((f) => f.id === fileId)


        // If there mark as activeFile, Update the editor window 
        if (existingFile) {
            set({ activeFileId: fileId })
            // set({ activeFileId: fileId, editorContent: existingFile.content })
            return
        }


        // register inside FileManager
        fileManager.registerFile(fileId, file.content || "")


        // new file
        const newOpenFile: OpenFile = {
            id: fileId,
            filename: file.filename,
            fileExtension: file.fileExtension
        }

        set((state) => ({
            openFiles: [...state.openFiles, newOpenFile],
            activeFileId: fileId,
        }))


    },


    closeFile(fileId) {

        const { openFiles, activeFileId } = get()
        const newFiles = openFiles.filter((f) => f.id !== fileId)

        // If we are closing the active file switch to another file or clear active
        // Prepare temporary variables to decide the next active file and editor content.
        // Start with current active file and content.
        let newActiveFileId = activeFileId


        if (activeFileId === fileId) {

            newActiveFileId =
                newFiles.length > 0
                    ? newFiles[newFiles.length - 1].id
                    : null

        }
        fileManager.unregisterFile(fileId)

        set({
            openFiles: newFiles,
            activeFileId: newActiveFileId,
        })


    },


    closeAllFiles() {
        const { openFiles } = get();

        if (openFiles.length === 0) {
            toast.info("No Open Files");
            return;
        }

        fileManager.clear()

        set({
            openFiles: [],
            activeFileId: null
        })
        toast.success(`Closed ${openFiles.length} file(s)`);

    },


    updateFileContent: (fileId, content) => {
        fileManager.updateFile(fileId, content)
    },

})) 