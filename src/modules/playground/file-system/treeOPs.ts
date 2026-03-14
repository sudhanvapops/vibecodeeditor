import { TemplateFile, TemplateFolder } from "../lib/pathToJson-util";
import { sortFileExplorer } from "../lib/sortJson";


// TODO: Duplicate name handle still not done


export const renameFile = (
    templateData: TemplateFolder,
    fileName: string,
    fileExtension: string,
    newFilename: string,
    newExtension: string,
    parentPath: string
): TemplateFolder | undefined => {

    const pathParts = parentPath.split("/")
    let currentFolder: TemplateFolder = templateData

    // Tree traversal to find required folder
    for (const part of pathParts) {
        if (part) {
            const nextFolder = currentFolder.items.find(
                (item) => "folderName" in item && item.folderName === part
            )
            if (!nextFolder) return 
            currentFolder = nextFolder as TemplateFolder
        }
    }

    const fileIndex = currentFolder.items.findIndex(
        (item) => "filename" in item &&
            item.filename === fileName &&
            item.fileExtension === fileExtension
    );

    if (fileIndex === -1) return 

    // Clone tree only when mutation is confirmed
    // TODO: structured clone caan be expensive if too much data
    const updateTemplateData = structuredClone(templateData)

    let folderToModify: TemplateFolder = updateTemplateData

    // traverse again
    for (const part of pathParts) {
        const nextFolder = folderToModify.items.find(
            (item) => "folderName" in item && item.folderName === part
        );
        folderToModify = nextFolder as TemplateFolder;
    }

    const targetFile = folderToModify.items[fileIndex] as TemplateFile;

    folderToModify.items[fileIndex] = {
        ...targetFile,
        filename: newFilename,
        fileExtension: newExtension
    }

    sortFileExplorer(currentFolder);
    return updateTemplateData

}

