/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ExamIdentity, QuestionType, GenerationResponse } from "../types";

export async function generateQuestions(
  identity: ExamIdentity,
  type: QuestionType,
  userApiKey?: string
): Promise<GenerationResponse> {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is required. Please provide it in the settings or environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Anda adalah pakar pembuat soal Kurikulum Merdeka. 
  Buatlah soal ujian yang SANGAT SPESIFIK untuk mata pelajaran berikut:
  
  MATA PELAJARAN: ${identity.subject}
  KELAS: ${identity.grade}
  FASE: ${identity.phase}
  TAHUN PELAJARAN: ${identity.academicYear}
  TOPIK/MATERI: ${identity.topics.join(", ")}
  LEVEL KOGNITIF: ${identity.levels.join(", ")}
  TIPE SOAL: ${type}
  JUMLAH SOAL: ${identity.questionCount}
  GURU: ${identity.teacherName}

  INSTRUKSI KHUSUS:
  1. Konten soal HARUS sesuai dengan Mata Pelajaran ${identity.subject}. JANGAN membuat soal di luar konteks subjek ini.
  2. Gunakan peristilahan yang tepat sesuai standar Kurikulum Merdeka.
  3. Berikan 'Kisi-Kisi' yang mendetail untuk setiap butir soal.
  4. Semua teks harus dalam Bahasa Indonesia yang formal dan benar.
  5. Jika Tipe Soal adalah 'Pilihan Ganda', sertakan minimal 4 atau 5 opsi jawaban (A, B, C, D, E) sesuai jenjang kelas.
  6. KHUSUS UNTUK MATERI PAI/AGAMA ISLAM: Jika topik berkaitan dengan Ilmu Tajwid, Ayat Al-Quran, atau Hadits, WAJIB sertakan teks Arab (dengan harakat) yang relevan di dalam teks soal atau stimulus soal.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Required for Multiple Choice"
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  cognitiveLevel: { type: Type.STRING },
                  topic: { type: Type.STRING }
                },
                required: ["id", "text", "correctAnswer", "explanation", "cognitiveLevel", "topic"]
              }
            },
            kisiKisi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  indicator: { type: Type.STRING },
                  cognitiveLevel: { type: Type.STRING },
                  questionNumber: { type: Type.NUMBER }
                },
                required: ["topic", "indicator", "cognitiveLevel", "questionNumber"]
              }
            }
          },
          required: ["questions", "kisiKisi"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as GenerationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate questions. Please check your API key and connection.");
  }
}
