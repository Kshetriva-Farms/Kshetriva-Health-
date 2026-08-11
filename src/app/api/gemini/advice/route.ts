import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AIAdviceRequest, AIAdviceResponse } from '../../../../domain/entities/AIAdvisor';

function buildLocalAdvice(request: AIAdviceRequest): AIAdviceResponse {
  const q = (request.userQuery || '').toLowerCase();
  const vitals = request.vitalsSummary || {};
  const age = vitals.age || 28;
  const weight = vitals.weightKg || 70;
  const targetWeight = vitals.targetWeightKg || weight - 3;
  const goal = vitals.primaryGoal || 'Weight Loss';

  let content = '';
  let recommendations: string[] = [];

  if (q.includes('calorie') || q.includes('how many calories')) {
    const bmr = Math.round(10 * weight + 6.25 * (vitals.heightCm || 172) - 5 * age + 5);
    const maintenance = Math.round(bmr * 1.45);
    const targetCal = Math.round(maintenance - 400);

    content = `### 📊 Your Personalized Daily Calorie Target

Based on your current metrics (${weight} kg weight, ${goal} goal):

- **Basal Metabolic Rate (BMR)**: ~\`${bmr} kcal/day\`
- **Maintenance Energy Requirement**: ~\`${maintenance} kcal/day\`
- **Recommended Target for ${goal}**: **\`${targetCal} kcal/day\`**

> **Macro Distribution Recommendation:**
> - **Protein (30%)**: \`${Math.round((targetCal * 0.3) / 4)}g\` (Supports muscle preservation)
> - **Carbohydrates (45%)**: \`${Math.round((targetCal * 0.45) / 4)}g\` (Complex carbs & farm grains)
> - **Healthy Fats (25%)**: \`${Math.round((targetCal * 0.25) / 9)}g\` (Cold-pressed oils, seeds, nuts)

### 💡 Execution Tips
1. Split calories across **3 main meals + 1 light snack**.
2. Avoid drinking liquid calories like refined juices or sodas.
3. Eat nutrient-dense organic farm greens to maximize satiety.`;

    recommendations = [
      `Target ${targetCal} kcal daily`,
      `Consume ${Math.round((targetCal * 0.3) / 4)}g protein`,
      'Log all meals in Kshetriva Calorie Tracker',
    ];
  } else if (q.includes('dinner') || q.includes('suggest dinner')) {
    content = `### 🥗 Recommended Farm-Fresh Dinner Options

Here are 3 nutrient-dense, gut-friendly dinner options optimal for your ${goal.toLowerCase()} goal:

1. **Desi Paneer & Farm Broccoli Kadai Bowl** (\`~420 kcal | 28g Protein\`)
   - Sautéed organic paneer cubes, broccoli florets, bell peppers, cooked in fresh tomato-ginger gravy with 1 multigrain roti.
2. **Moong Dal & Spinach Khichdi with Mint Raita** (\`~380 kcal | 18g Protein\`)
   - Lightly spiced yellow dal and spinach khichdi drizzled with 1 tsp ghee, served with probiotic cucumber raita.
3. **Grilled Tofu / Chicken Tikka with Garden Salad** (\`~410 kcal | 35g Protein\`)
   - Herb-marinated paneer or lean protein grilled with roasted zucchini, bell peppers, and lemon mustard dressing.

> 🌿 **Bioavailability Tip:** Finish dinner at least **2.5 hours before sleeping** to optimize nocturnal cellular repair and digestion.`;

    recommendations = [
      'Eat dinner before 8:00 PM',
      'Include 25g+ clean protein in dinner',
      'Keep carbs complex and easy to digest',
    ];
  } else if (q.includes('breakfast') || q.includes('healthy breakfast')) {
    content = `### 🌅 High-Energy Healthy Breakfast Ideas

Start your morning with stable blood sugar and sustained focus:

1. **Palak Besan Chilla with Mint Chutney** (\`~310 kcal | 16g Protein\`)
   - Savory chickpea flour pancakes folded with finely chopped farm spinach and roasted cumin.
2. **Sprouted Moong & Pomegranate Salad Bowl** (\`~260 kcal | 14g Protein\`)
   - Raw steamed sprouts topped with fresh pomegranate, lemon juice, pink Himalayan salt, and crushed walnuts.
3. **Rolled Oats & Chia Seed Pudding** (\`~330 kcal | 15g Protein\`)
   - Soaked oats in almond milk with 1 tbsp chia seeds, topped with fresh berries and roasted pumpkin seeds.

> ⚡ **Nutritional Wisdom:** Starting breakfast with **protein & fiber** prevents mid-morning energy crashes and sugar cravings.`;

    recommendations = [
      'Aim for 15g+ protein at breakfast',
      'Include fresh farm greens or seeds',
      'Hydrate with warm lemon water upon waking',
    ];
  } else if (q.includes('protein') || q.includes('high protein')) {
    content = `### 🥩 Top High-Protein Farm & Plant Meals

To hit your daily target of **\`${Math.round(weight * 1.6)}g protein\`**:

- **Organic Cottage Cheese (Paneer)**: \`18g Protein / 100g\`
- **Yellow & Black Moong Dal / Sprouts**: \`24g Protein / 100g dry\`
- **Chickpeas (Kabuli Chana)**: \`19g Protein / 100g cooked\`
- **Greek Yogurt / Hung Curd**: \`10g Protein / 100g\`
- **Organic Tofu & Soybeans**: \`15g Protein / 100g\`

### 🍲 High-Protein Quick Recipe:
**Masala Soya Sauté with Farm Veggies**
- 50g soya chunks boiled & squeezed.
- Sauté with onion, garlic, tomatoes, bell peppers, and garamasala.
- **Yields**: \`~26g Protein | 220 kcal\`!`;

    recommendations = [
      `Distribute ${Math.round(weight * 1.6)}g protein evenly across 4 meals`,
      'Combine legumes + whole grains for complete amino acid profile',
    ];
  } else if (q.includes('weight loss') || q.includes('loss tips')) {
    content = `### 🔥 5 Evidence-Based Weight Loss Principles

1. **Create a Moderate Deficit (\`300-500 kcal/day\`)**
   - Slow, steady fat loss (0.5 kg/week) preserves muscle mass and metabolic rate.
2. **Prioritize Protein (\`1.6g per kg body weight\`)**
   - High thermic effect of food (TEF) and superior satiety.
3. **Eat High Volume, Low Density Foods**
   - Fill half your plate with non-starchy farm vegetables (spinach, cucumber, cabbage, bell peppers).
4. **Hydrate Strategically**:
   - Drink 500ml water **20 minutes before every meal** to naturally curb excess appetite.
5. **Optimize Sleep & Stress**:
   - Elevated cortisol from poor sleep (< 7 hrs) promotes visceral fat storage.

> 🎯 **Goal Target:** Aim for \`${targetWeight} kg\` by maintaining consistency over 8-12 weeks.`;

    recommendations = [
      'Maintain a 400 kcal daily deficit',
      'Walk 8,000+ steps daily',
      'Drink 3 liters of water per day',
    ];
  } else {
    content = `### 🌿 Personalized Health & Nutrition Guidance

Thank you for asking! For your query: **"${request.userQuery}"**

Here is tailored advice based on your profile (${weight} kg, goal: ${goal}):

- **Diet Quality**: Focus on whole, unprocessed organic foods and farm vegetables.
- **Hydration**: Maintain an intake of \`3.0 L/day\` to support kidney function and nutrient absorption.
- **Balance**: Pair complex carbohydrates with clean protein and healthy omega-3 fats.

*Log your progress in your Kshetriva Health+ dashboard daily to track improvements!*`;

    recommendations = [
      'Track daily food intake',
      'Maintain consistent sleep schedule',
      'Consult Kshetriva AI Advisor anytime for meal adjustments',
    ];
  }

  return {
    summary: 'Personalized Nutrition Guidance',
    content,
    recommendations,
    confidenceScore: 0.95,
    createdAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const request = (await req.json()) as AIAdviceRequest;

    if (!request.userQuery) {
      return NextResponse.json({ success: false, error: 'userQuery is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const aiClient = new GoogleGenAI({ apiKey });
        const vitals = request.vitalsSummary || {};
        const prompt = `You are an expert AI Clinical & Farm-to-Table Nutritionist for Kshetriva Health+.
User Query: "${request.userQuery}"
User Context:
- Age: ${vitals.age || 28}
- Current Weight: ${vitals.weightKg || 70} kg
- Target Weight: ${vitals.targetWeightKg || (vitals.weightKg || 70) - 3} kg
- Goal: ${vitals.primaryGoal || 'Weight Loss'}
- Daily Calorie Target: ${vitals.dailyCaloriesGoal || 2000} kcal

Provide a structured, engaging, and scientifically sound answer formatted in Markdown.
Use clear headings (###), bold text for key terms, bullet points for food items, and practical action items.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        if (text) {
          return NextResponse.json({
            success: true,
            summary: 'Gemini AI Nutrition Advice',
            content: text,
            recommendations: [
              'Log your meals in Calorie Tracker to stay on target.',
              'Hydrate with at least 2.5L-3L organic water daily.',
            ],
            confidenceScore: 0.96,
            createdAt: new Date().toISOString(),
            source: 'gemini',
          });
        }
      } catch (aiError) {
        console.warn('Gemini advice generation failed, using local nutrition engine:', aiError);
      }
    }

    const localAdvice = buildLocalAdvice(request);
    return NextResponse.json({ success: true, ...localAdvice, source: 'local' });
  } catch (error: any) {
    console.error('Advice API route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate AI advice.' },
      { status: 500 }
    );
  }
}
