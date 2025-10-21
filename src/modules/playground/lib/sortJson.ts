interface FileNode {
  filename: string;
  fileExtension: string;
  content: string;
}

interface FolderNode {
  folderName: string;
  items: (FileNode | FolderNode)[];
}

type TreeNode = FileNode | FolderNode;


export const sortFileExplorer = (node: TreeNode): TreeNode => {

  if (!('items' in node) || !Array.isArray(node.items)) {
    return node;
  }

  console.log("Sort Renderd")

  const folders = node.items
    .filter((item): item is FolderNode => (
      "folderName" in item
    ))
    .map(folder => sortFileExplorer(folder) as FolderNode)

  const files: FileNode[] = node.items.filter((item): item is FileNode => (
    "filename" in item
  ))

  folders.sort((a,b)=>( a.folderName.localeCompare(b.folderName)))
  files.sort((a,b)=>( a.filename.localeCompare(b.filename)))

  node.items = [...folders,...files]
  return node

}
