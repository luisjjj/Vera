import { GoogleGenerativeAI } from '@google/generative-ai';
import { Platform, ContentType, DayOfWeek, PlanItem } from '@/types/models';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface GeneratePlanInput {
  platforms: Platform[];
  niche: string;
  tone: string;
  goals: string[];
  weekStart: string;
}

interface GeminiPlanItem {
  day: string;
  platform: string;
  content_type: string;
  title: string;
  description: string;
}

export async function generateWeeklyPlan(input: GeneratePlanInput): Promise<Omit<PlanItem, 'id' | 'plan_id' | 'status' | 'created_at'>[]> {
  const prompt = `You are Vera, a content planning AI assistant. Generate a 7-day content plan.

Creator details:
- Platforms: ${input.platforms.join(', ')}
- Niche: ${input.niche}
- Tone of voice: ${input.tone}
- Goals: ${input.goals.join(', ')}
- Week starting: ${input.weekStart}

Return a JSON array with exactly 7 items (one per day). Each item must have:
- day: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"
- platform: one of [${input.platforms.map(p => `"${p}"`).join(', ')}]
- content_type: one of ["reel", "story", "post", "video", "carousel", "thread", "article"]
- title: short catchy title for the content
- description: 1-2 sentence description of what to create

Rules:
- Spread content across different days and platforms
- Mix content types for variety
- Keep titles concise and actionable
- Return ONLY the JSON array, no markdown, no explanation`;

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let cleaned = text.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();

      const parsed: GeminiPlanItem[] = JSON.parse(cleaned);

      return parsed.map((item) => ({
        day: item.day.toLowerCase() as DayOfWeek,
        platform: item.platform.toLowerCase() as Platform,
        content_type: item.content_type.toLowerCase() as ContentType,
        title: item.title,
        description: item.description,
      }));
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        continue;
      }
      throw error;
    }
  }

  // Fallback: generate a basic plan locally
  return generateFallbackPlan(input);
}

function generateFallbackPlan(input: GeneratePlanInput): Omit<PlanItem, 'id' | 'plan_id' | 'status' | 'created_at'>[] {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const platforms = input.platforms;
  const templates: { title: string; description: string; contentType: ContentType }[] = [
    { title: `${input.niche} Tips & Tricks`, description: 'Share actionable tips your audience can use today.', contentType: 'post' },
    { title: `Behind the Scenes`, description: 'Show your process or daily routine related to your niche.', contentType: 'story' },
    { title: `Quick Tutorial`, description: 'A short how-to video breaking down a key concept.', contentType: 'reel' },
    { title: `Industry Insights`, description: 'Share your thoughts on trending topics in your space.', contentType: 'thread' },
    { title: `Deep Dive Guide`, description: 'A comprehensive breakdown of an important topic.', contentType: 'article' },
    { title: `Community Q&A`, description: 'Answer common questions from your audience.', contentType: 'video' },
    { title: `Weekly Recap`, description: 'Summarize the best moments and lessons from the week.', contentType: 'carousel' },
  ];

  return days.map((day, i) => {
    const template = templates[i % templates.length];
    const platform = platforms[i % platforms.length];
    return {
      day,
      platform,
      content_type: template.contentType,
      title: template.title,
      description: template.description,
    };
  });
}
