import { TemplateFile,TemplateFolder } from "./pathToJson-util";


/** This Function Is to Sort the Folders in the File Explorer
  * Seprate Folder and Files
  * Sorts Folders First
  * Files later
  * Recursivly
  * and then put folders first to array and files latter
*/ 
export const sortFileExplorer = (node: TemplateFolder): TemplateFolder => {

  if (!('items' in node) || !Array.isArray(node.items)) {
    return node;
  }

  console.log("Sort Renderd")

  const folders = node.items
    .filter((item): item is TemplateFolder => (
      "folderName" in item
    ))
    .map(folder => sortFileExplorer(folder) as TemplateFolder)

  const files: TemplateFile[] = node.items.filter((item): item is TemplateFile => (
    "filename" in item
  ))

  folders.sort((a,b)=>( a.folderName.localeCompare(b.folderName)))
  files.sort((a,b)=>( a.filename.localeCompare(b.filename)))

  node.items = [...folders,...files]
  return node

}
