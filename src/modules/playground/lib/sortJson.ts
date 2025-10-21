import { TemplateFile,TemplateFolder } from "./pathToJson-util";

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
