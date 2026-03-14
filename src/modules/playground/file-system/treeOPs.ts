import { TemplateFile, TemplateFolder } from "../lib/pathToJson-util";
import { sortFileExplorer } from "../lib/sortJson";
import { traveseFolder } from "./utilities";


// TODO: Duplicate name handle still not done

export const renameFile = (
    templateData: TemplateFolder,
    fileName: string,
    fileExtension: string,
    newFilename: string,
    newExtension: string,
    parentPath: string
): TemplateFolder | undefined => {

    // Tree traversal to find required folder
    let currentFolder = traveseFolder(parentPath, templateData)
    if (!currentFolder) return

    const fileIndex = currentFolder.items.findIndex(
        (item) => "filename" in item &&
            item.filename === fileName &&
            item.fileExtension === fileExtension
    );

    if (fileIndex === -1) return

    // Clone tree only when mutation is confirmed
    // TODO: structured clone caan be expensive if too much data
    const updateTemplateData = structuredClone(templateData)

    // traverse again
    let folderToModify = traveseFolder(parentPath, updateTemplateData)
    if (!folderToModify) return

    const targetFile = folderToModify.items[fileIndex] as TemplateFile;

    folderToModify.items[fileIndex] = {
        ...targetFile,
        filename: newFilename,
        fileExtension: newExtension
    }

    sortFileExplorer(folderToModify);
    return updateTemplateData

}

export const renameFolder = (
    templateData: TemplateFolder,
    parentPath: string,
    oldFolderName: string,
    newFolderName: string
): TemplateFolder | undefined => {


    const currentFolder = traveseFolder(parentPath, templateData)
    if (!currentFolder) return

    const folderIndex = currentFolder.items.findIndex(
        (item) =>
            "folderName" in item &&
            item.folderName === oldFolderName
    )

    if (folderIndex === -1) return

    const updateTemplateData = structuredClone(templateData)

    let folderToModify = traveseFolder(parentPath, updateTemplateData)
    if (!folderToModify) return

    const targetFolder = folderToModify.items[folderIndex] as TemplateFolder

    folderToModify.items[folderIndex] = {
        ...targetFolder,
        folderName: newFolderName
    }

    sortFileExplorer(folderToModify);
    return updateTemplateData
}

export const deleteFile = (
    templateData: TemplateFolder,
    parentPath: string,
    filename: string,
    fileExtension: string
): TemplateFolder | undefined => {

    let currentFolder = traveseFolder(parentPath, templateData)
    if (!currentFolder) return
    
    const updatedTemplateData = structuredClone(templateData)
    let folderToModify = traveseFolder(parentPath, updatedTemplateData)
    if (!folderToModify) return

    folderToModify.items = folderToModify.items.filter(
        (item) =>
            !("filename" in item) ||
            item.filename !== filename ||
            item.fileExtension !== fileExtension
    );

    sortFileExplorer(folderToModify)
    return updatedTemplateData
    
}