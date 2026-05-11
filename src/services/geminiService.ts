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

  const prompt = `Generate exam questions for the following context:
  Subject: ${identity.subject}
  Grade: ${identity.grade}
  Phase: ${identity.phase}
  Academic Year: ${identity.academicYear}
  Topics: ${identity.topics.join(", ")}
  Cognitive Levels: ${identity.levels.join(", ")}
  Question Type: ${type}
  Number of Questions: ${identity.questionCount}
  Teacher: ${identity.teacherName}

  Ensure the questions follow the 'Kurikulum Merdeka' guidelines. 
  Provide the questions and a 'Kisi-Kisi' (table of specifications) for the teacher. 
  All content must be in Bahasa Indonesia.`;

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
