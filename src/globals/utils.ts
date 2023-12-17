export function getFileNameFromPath(path: string, removeExtension = false) {
  let fileName = path.split('\\').pop()?.split('/').pop();
  if (removeExtension) {
    fileName = fileName?.slice(0, -4)
  }

  return fileName;
}

export function convertSecondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}