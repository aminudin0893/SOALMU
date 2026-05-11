/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum QuestionType {
  MULTIPLE_CHOICE = 'Pilihan Ganda',
  ESSAY = 'Uraian',
  TRUE_FALSE = 'Benar/Salah',
  MATCHING = 'Menjodohkan'
}

export enum CognitiveLevel {
  C1 = 'C1 - Mengingat',
  C2 = 'C2 - Memahami',
  C3 = 'C3 - Mengaplikasikan',
  C4 = 'C4 - Menganalisis',
  C5 = 'C5 - Mengevaluasi',
  C6 = 'C6 - Menciptakan'
}

export enum ExamMode {
  BIASA = 'Biasa',
  AKM = 'Literasi/AKM',
  HOTS = 'HOTS (High Order Thinking Skills)'
}

export interface ExamIdentity {
  subject: string;
  grade: string;
  phase: string;
  academicYear: string;
  topics: string[];
  levels: CognitiveLevel[];
  questionCount: number;
  teacherName: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
  cognitiveLevel: CognitiveLevel;
  topic: string;
}

export interface KisiKisi {
  topic: string;
  indicator: string;
  cognitiveLevel: CognitiveLevel;
  questionNumber: number;
}

export interface ExamData {
  identity: ExamIdentity;
  questions: Question[];
  kisiKisi: KisiKisi[];
}

export interface GenerationResponse {
  questions: Question[];
  kisiKisi: KisiKisi[];
}
