import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateFitnessPlan = async (userData: {
  age: string;
  weight: string;
  height: string;
  level: string;
  goal: string;
  injuries: string;
}) => {
  const prompt = `
    You are a highly knowledgeable and friendly AI Fitness Coach.
    Based on the following user data, provide a personalized workout plan and diet suggestions.

    User Data:
    - Age: ${userData.age}
    - Weight: ${userData.weight}
    - Height: ${userData.height}
    - Fitness Level: ${userData.level}
    - Goal: ${userData.goal}
    - Injuries: ${userData.injuries || "None"}

    Follow these rules strictly:
    1. Provide structured workout routines (sets, reps, rest time).
    2. Adjust plans based on user level.
    3. Include warm-up and cool-down suggestions.
    4. Suggest balanced diet plans (protein, carbs, fats).
    5. Warn users to consult a professional for medical conditions or injuries.
    6. Use a motivational and supportive tone.

    OUTPUT FORMAT:
    Goal: <user goal>

    Workout Plan:
    - Day 1: ...
    - Day 2: ...

    Diet Tips:
    - ...

    Extra Advice:
    - ...
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    throw new Error("Failed to generate fitness plan. Please check your API key and try again.");
  }
};
