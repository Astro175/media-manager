import * as FileSystem from "expo-file-system/legacy";

export const uploadService = {
  upload: (
    url: string,
    fileUri: string,
    onUpload: (progress: number) => void,
  ) => {
    const task = FileSystem.createUploadTask(
      url,
      fileUri,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      },
      ({ totalBytesSent, totalBytesExpectedToSend }) => {
        const progress = totalBytesSent / totalBytesExpectedToSend;
        onUpload(progress);
      },
    );
    const result = task.uploadAsync();
    return { promise: result, cancel: () => task.cancelAsync() };
  },
};
