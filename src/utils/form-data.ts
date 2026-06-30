export interface ReactNativeFile {
  uri: string;
  type: string;
  name: string;
}

export function toFormDataFile(file: ReactNativeFile): Blob {
  return file as unknown as Blob;
}
