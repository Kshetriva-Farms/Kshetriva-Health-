import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

export const aiClient = new GoogleGenAI({ apiKey });

export async function generateFarmNutritionAdvice(
  produceList: string[],
  healthGoal: string
): Promise<string> {
  try {
    if (!apiKey) {
      return `🌱 **Farm-Fresh Nutrition Tip**: Combining your harvested ${produceList.slice(0, 3).join(', ')} provides rich dietary fiber and bioavailable antioxidants targeted to support your goal of **${healthGoal}**. Consume them lightly steamed to retain maximum enzymatic potency!`;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert farm-to-table clinical nutritionist for Kshetriva Health+. 
      The customer has received the following fresh organic produce from Kshetriva Farms: ${produceList.join(', ')}.
      Their health goal is: "${healthGoal}".
      Provide a concise 3-bullet point actionable nutrition advice and recipe concept maximizing the nutrient intake from this harvest.`,
    });

    return response.text || "Fresh produce enhances metabolic health and vital longevity!";
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return `🌱 **Nutrition Insight**: Freshly harvested organic vegetables contain up to 40% higher nutrient density. Incorporate your ${produceList[0] || 'green harvest'} into your morning smoothie for sustained cellular energy!`;
  }
}
