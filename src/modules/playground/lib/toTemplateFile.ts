import { TemplateFile } from "./pathToJson-util";
import { fileManager } from "../file-system/FileManager";


interface OpenFile {
    id: string,
    filename: string;
    fileExtension: string;
}

export function toTemplateFile(
  openFile: OpenFile
): TemplateFile {

  return {
    filename: openFile.filename,
    fileExtension: openFile.fileExtension,
    content: fileManager.readFile(openFile.id)
  }
}