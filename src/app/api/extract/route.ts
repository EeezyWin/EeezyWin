import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildExtractionPrompt } from "@/lib/extraction-prompt";
import { ExtractionResponse } from "@/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageDataUrl, apiKey, provider } = body as {
      imageDataUrl: string;
      apiKey: string;
      provider: "gemini" | "openai";
    };

    if (!imageDataUrl) {
      return NextResponse.json(
        { success: false, error: "No image provided" } satisfies ExtractionResponse,
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is required. Configure it in Settings." } satisfies ExtractionResponse,
        { status: 400 }
      );
    }

    // Extract base64 and mime type from data URL
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Invalid image format" } satisfies ExtractionResponse,
        { status: 400 }
      );
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const extractionPrompt = buildExtractionPrompt();

    let result: ExtractionResponse;

    if (provider === "gemini") {
      result = await callGemini(apiKey, base64Data, mimeType, extractionPrompt);
    } else {
      result = await callOpenAI(apiKey, base64Data, mimeType, extractionPrompt);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      } satisfies ExtractionResponse,
      { status: 500 }
    );
  }
}

async function callGemini(
  apiKey: string,
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<ExtractionResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error("No response from Gemini API");
  }

  const parsed = JSON.parse(textContent);
  return { success: true, data: parsed };
}

async function callOpenAI(
  apiKey: string,
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<ExtractionResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from OpenAI API");
  }

  const parsed = JSON.parse(content);
  return { success: true, data: parsed };
}
