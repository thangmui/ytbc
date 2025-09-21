import { GoogleGenAI } from "@google/genai";
import { WritingStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MASTER_SYSTEM_INSTRUCTION = `You are a world-class YouTube content strategist AI. Your expertise is threefold:
1.  **YouTube Algorithm Guru:** You have a deep, up-to-the-minute understanding of the YouTube algorithm, ranking factors, and community guidelines. All your output MUST be 100% compliant with YouTube's policies to avoid demonetization or strikes.
2.  **SEO Master:** You excel at keyword research and on-page optimization for YouTube. You craft titles, descriptions, and tags designed to maximize click-through rate (CTR) and search visibility.
3.  **Master Storyteller & Content Writer:** You write incredibly engaging, well-structured, and coherent content. Your target audience is primarily from the USA and Europe, so you must use Western names (e.g., John, Emily, Alexander), cultural references, and settings.

Your responses must be direct and complete. Do not ask clarifying questions, do not summarize, do not break down long texts into parts. Provide the full, continuous content as requested.

All of your output must be in Vietnamese.`;

export const generateScript = async (idea: string, length: number, style: WritingStyle, temperature: number): Promise<string> => {
  const prompt = `Based on the user's idea: "${idea}"

Write a complete, continuous YouTube video script with a target word count of approximately ${length} words.

The script must be in the "${style.label}" style. Here is a description of that style for your reference: "${style.description}".

The script must be captivating from start to finish. Use storytelling techniques to create suspense and intrigue. Include credible-sounding citations or references (e.g., "Theo một nghiên cứu của...", "Các chuyên gia tại [Tổ chức] tin rằng..."). Conclude the script with open-ended or thought-provoking questions to encourage viewer comments and engagement. The characters must have American or European names and the context should reflect Western culture.

Generate the script now in Vietnamese.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        temperature: temperature,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating script:", error);
    return "Lỗi: Không thể tạo kịch bản.";
  }
};

export const generateTitle = async (idea: string, script: string, isRegenerate = false): Promise<string> => {
    const prompt = `Analyze the following user idea and video script.
Idea: "${idea}"
Script: "${script.substring(0, 4000)}"

${isRegenerate ? 'Generate a new, different, and even more creative title that is highly clickable in Vietnamese.' : 'Generate ONE compelling, highly clickable, and SEO-optimized YouTube title in Vietnamese. The title should be intriguing and accurately reflect the content.'}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        }
    });
    return response.text.replace(/\"/g, '');
  } catch (error) {
    console.error("Error generating title:", error);
    return "Lỗi: Không thể tạo tiêu đề.";
  }
};

export const generateDescription = async (idea: string, script: string, isRegenerate = false): Promise<string> => {
    const prompt = `Analyze the following user idea and video script.
Idea: "${idea}"
Script: "${script.substring(0, 4000)}"

${isRegenerate ? 'Generate a new, different, and more engaging YouTube video description in Vietnamese.' : 'Write a compelling, SEO-optimized YouTube video description in Vietnamese.'} The description should hook the viewer in the first few lines, summarize the video's content, and provide value. Conclude the description with 3-5 relevant, high-traffic hashtags.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Lỗi: Không thể tạo mô tả.";
  }
};

export const generateTags = async (idea: string, title: string, description: string, isRegenerate = false): Promise<string> => {
    const prompt = `Analyze the following video content:
Title: "${title}"
Description: "${description.substring(0, 2000)}"
Core Idea: "${idea}"

${isRegenerate ? 'Generate a new, different set of tags that targets a slightly different keyword cluster.' : 'Generate a comma-separated list of highly relevant, SEO-optimized YouTube tags.'} The tags should be in Vietnamese or universally understandable. The total length of the tags string must be between 480 and 490 characters. The tags should cover broad and specific keywords related to the video's topic. Do not include '#' in the tags. Just provide the comma-separated keywords.`;
    
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating tags:", error);
    return "Lỗi: Không thể tạo thẻ tags.";
  }
};

export const translateText = async (text: string, language: { name: string }): Promise<string> => {
  const prompt = `You are an expert translator. Translate the following Vietnamese text accurately and naturally into ${language.name}.
Return ONLY the translated text, without any additional titles, headings, or commentary.

**Text to Translate:**
"""
${text}
"""`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2, // Lower temperature for more accurate, less creative translation
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error translating text:", error);
    return "Lỗi: Không thể dịch văn bản.";
  }
};