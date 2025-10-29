import { TemplateFile, TemplateFolder } from "./pathToJson-util";


export function findFilePath(
  file: TemplateFile,
  folder: TemplateFolder,
  pathSoFar: string[] = []
): string | null {
  
  for (const item of folder.items) {

    // If it has a folderName property, it’s a subfolder, not a file.
    if ("folderName" in item) {
      //  We recursively search inside this subfolder, and:
      //  pathSoFar adds the current folder name (to build a full path later)
      //  If recursion finds the file (res is not null), we immediately return it.
      //  This ensures we stop searching once we’ve found our target file.
      const res = findFilePath(file, item, [...pathSoFar, item.folderName]);
      if (res) return res;
      
    } else {
      
      // If the item is a file, check for a match
      if (
        item.filename === file.filename &&
        item.fileExtension === file.fileExtension
      ) {
        // Build and return the full path
        return [
          ...pathSoFar,
          item.filename + (item.fileExtension ? "." + item.fileExtension : ""),
        ].join("/");
      }
    }
  }
  return null;
}


/**
 * Generates a unique file ID based on file location in folder structure
 * @param file The template file
 * @param rootFolder The root template folder containing all files
 * @returns A unique file identifier including full path
 */
export const generateFileId = (file: TemplateFile, rootFolder: TemplateFolder): string => {
  // Find the file's path in the folder structure
  // Removes any leading slashes from the path (like "/src/components" → "src/components").
  const path = findFilePath(file, rootFolder)?.replace(/^\/+/, '') || '';
  
  // Handle empty/undefined file extension
  const extension = file.fileExtension?.trim();
  const extensionSuffix = extension ? `.${extension}` : '';

  // Combine path and filename
  return path
    ? `${path}/${file.filename}${extensionSuffix}`
    : `${file.filename}${extensionSuffix}`;
}