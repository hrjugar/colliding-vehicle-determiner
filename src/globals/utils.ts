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

  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function convertSecondsAndMillisecondsToString(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor(parseFloat((time % 1).toFixed(2)) * 100);

  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
}

export function convertTimeToObject(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor(parseFloat((time % 1).toFixed(2)) * 100);

  return { minutes, seconds, milliseconds };
}

export function addLeadingZero(number: number) {
  return number < 10 ? `0${number}` : number;
}

export function getBoundingBoxColor(number: number): string {
  const hue = (number * 137.5) % 360;
  const saturation = 100;
  const lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}