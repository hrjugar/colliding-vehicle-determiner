export function getFileNameFromPath(path: string, removeExtension = false) {
  let fileName = path.split('\\').pop()?.split('/').pop();
  if (removeExtension) {
    fileName = fileName?.slice(0, -4)
  }

  return fileName;
}