
interface Video {
  id: number | bigint;
  path: string;
  isAnalyzed: boolean;
}

interface Progress {
  percent: number;
  displayText: string;
}