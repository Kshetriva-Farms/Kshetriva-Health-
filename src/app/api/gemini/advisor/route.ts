import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produceHarvest = [], healthGoals = [], dietaryRestrictions = [], userPrompt = '' } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Gemini API key is not configured on the server.',
          fallback: true,
        },
        { status: 200 }
      );
    }

    const aiClient = new GoogleGenAI({ apiKey });
    const produceList = produceHarvest.join(', ') || 'Fresh Organic Produce';
    const goalsList = healthGoals.join(', ') || 'Cellular Vitality & Wellness';
    const restrictions = dietaryRestrictions.join(', ') || 'None';

    const prompt = `You are a clinical farm-to-table nutritionist for Kshetriva Health+.
Subscriber's organic produce harvest: ${produceList}.
Health & Wellness goals: ${goalsList}.
Dietary restrictions: ${restrictions}.
User inquiry: "${userPrompt || 'How can I maximize nutrient absorption from this harvest?'}"

Provide a structured, encouraging nutrition plan in Markdown with:
1. 🌟 **Nutrient Spotlight**: Key vitamins/minerals in today's harvest.
2. 🥗 **Farm-Fresh Recipe Concept**: Simple preparation instructions preserving enzymes.
3. 💡 **Bioavailability Tip**: How to combine ingredients for maximum absorption.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const adviceText = response.text || 'Enjoying farm-fresh organic produce supports daily metabolic vitality!';

    return NextResponse.json({
      success: true,
      adviceText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Secure Gemini API Route Error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate AI advice.',
        success: false,
      },
      { status: 500 }
    );
  }
}
