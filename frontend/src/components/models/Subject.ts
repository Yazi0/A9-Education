export interface TeacherVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  description: string;
}

export interface StudyMaterial {
  id: number;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
}

export interface LastVideoWatched {
  id: number;
  title: string;
  url: string;
  duration: string;
  progress: number;
  timestamp: string;
}

export interface TeacherUploads {
  videoLinks: TeacherVideo[];
  notes: StudyMaterial[];
}

export interface Assignments {
  pending: number;
  completed: number;
}

export interface Subject {
  id: number;
  name: string;
  stream: string;
  level: string;
  teacher: string;
  progress: number;
  nextClass?: string;
  assignments: Assignments;
  materials: number;
  latestGrade?: string;
  lastAccessed: string;
  clsDate?: string;
  studentCount: number;
  lastVideoWatched?: LastVideoWatched;
  teacherUploads: TeacherUploads;
  examDate?: string;
  price?: number;
  status?: string;
  paymentDue?: string;
}