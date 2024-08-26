import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { text, numFlashcards } = await req.json();

  const systemPrompt = `
    You are a flashcard creator. Take in text and create exactly ${numFlashcards} flashcards.
    Each flashcard should have a front and back, with one sentence each.
    Format your response as JSON:
    {
      "flashcards": [
        {
          "front": "Front of the card",
          "back": "Back of the card"
        }
      ]
    }
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    model: "openai/gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcards);
}