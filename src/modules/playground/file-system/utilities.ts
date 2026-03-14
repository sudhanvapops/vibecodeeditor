import { TemplateFolder } from "../lib/pathToJson-util"

export const traveseFolder = (parentPath: string, templateData: TemplateFolder): TemplateFolder | undefined => {

    const pathParts = parentPath.split("/")
    let currentFolder: TemplateFolder = templateData

    for (const part of pathParts) {
        if (part) {
            const nextFolder = currentFolder.items.find(
                (item) => "folderName" in item && item.folderName === part
            )
            if (!nextFolder) return
            currentFolder = nextFolder as TemplateFolder
        }
    }

    return currentFolder
}

