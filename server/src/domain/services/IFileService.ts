export interface IFileService {
  upload(filePath: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
}
