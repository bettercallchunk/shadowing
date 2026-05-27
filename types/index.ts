export interface Material {
  id: string;
  title: string;
  part: 'Part1' | 'Part2' | 'Part3';
  audioPath: string;
  text?: string;
  duration?: number;
}

export interface Recording {
  id: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
}

export interface PracticeRecord {
  id: string;
  materialId: string;
  materialTitle: string;
  date: string;
  recordingCount: number;
  duration: number;
}
