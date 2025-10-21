import { GoogleGenAI, Type } from "@google/genai";
import type { Script, AspectRatio } from '../types';

function getAiClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    return new GoogleGenAI({ apiKey });
}

export async function generateScript(prompt: string, style: string): Promise<Script> {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';

    const fullPrompt = `You are a professional screenwriter. Based on the following idea: '${prompt}', create a video script with a '${style}' style. The output must be a valid JSON object. The JSON should have a 'title' (string), a 'description' (string), and an array of 'scenes'. Each scene object in the array must have 'sceneNumber' (number), 'setting' (string, e.g., 'INT. COFFEE SHOP - DAY'), 'description' (string, a short summary of the scene), and 'veoPrompt' (string, a detailed, vivid, and cinematic prompt for a text-to-video AI like Veo, describing the visual elements, characters, actions, camera angles, and mood of the scene in a single paragraph). Generate at least 3 scenes.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    scenes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sceneNumber: { type: Type.NUMBER },
                                setting: { type: Type.STRING },
                                description: { type: Type.STRING },
                                veoPrompt: { type: Type.STRING }
                            },
                            required: ["sceneNumber", "setting", "description", "veoPrompt"]
                        }
                    }
                },
                required: ["title", "description", "scenes"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const parsedScript = JSON.parse(jsonText);
        return parsedScript as Script;
    } catch (error) {
        console.error("Failed to parse script JSON:", response.text, error);
        throw new Error("Failed to generate a valid script. The AI's response was not in the correct format.");
    }
}

export async function generateVideoForScene(
    prompt: string, 
    aspectRatio: AspectRatio,
    onProgress: (progress: number) => void
): Promise<string> {
    const ai = getAiClient();
    const apiKey = process.env.API_KEY;
     if (!apiKey) {
        throw new Error("API key not found for downloading video.");
    }
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    // FIX: Cast operation.metadata to 'any' to safely access the 'progressPercent' property, which is of type 'unknown'.
    onProgress((operation.metadata as any)?.progressPercent ?? 0);

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
        // FIX: Cast operation.metadata to 'any' to safely access the 'progressPercent' property, which is of type 'unknown'.
        if ((operation.metadata as any)?.progressPercent) {
            onProgress((operation.metadata as any).progressPercent);
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}