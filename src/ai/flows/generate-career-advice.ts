import { ai } from '../genkit';
import { z } from 'zod';

export interface CareerAdviceInput {
  question: string;
  userCareer?: string;
  userSkills?: string[];
  userExperience?: string;
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
}

const CareerAdviceInputSchema = z.object({
  question: z.string(),
  userCareer: z.string().optional(),
  userSkills: z.array(z.string()).optional(),
  userExperience: z.string().optional(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
});

const CareerAdviceOutputSchema = z.object({
  advice: z.string(),
  suggestedSkills: z.array(z.string()).optional(),
  actionItems: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.string()
  })).optional()
});

export const generateCareerAdvice = ai.defineFlow(
  {
    name: 'generateCareerAdvice',
    inputSchema: CareerAdviceInputSchema,
    outputSchema: CareerAdviceOutputSchema
  },
  async (input) => {
    const { question, userCareer, userSkills, userExperience, chatHistory } = input;
    
    // Build context about the user
    let userContext = '';
    if (userCareer) userContext += `Career: ${userCareer}\n`;
    if (userSkills && userSkills.length > 0) userContext += `Skills: ${userSkills.join(', ')}\n`;
    if (userExperience) userContext += `Experience Level: ${userExperience}\n`;
    
    // Build chat history context
    let historyContext = '';
    if (chatHistory && chatHistory.length > 0) {
      historyContext = '\n\nPrevious conversation:\n' + 
        chatHistory.slice(-6).map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`).join('\n');
    }
    
    const prompt = `You are Lucas AI, an expert career advisor helping users advance their careers in technology. 
    
User Information:
${userContext}

${historyContext}

Current Question: ${question}

Provide comprehensive career advice that includes:
1. Direct answer to their question
2. Specific skills they should learn or improve
3. Actionable steps they can take immediately
4. Relevant resources (courses, documentation, tools)

Be specific, practical, and encouraging. Focus on actionable advice that can help them progress in their career.

Respond in a conversational, helpful tone as if you're a knowledgeable mentor.`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });
    
    const advice = response.text;
    
    // Extract suggested skills and action items from the response
    const suggestedSkills: string[] = [];
    const actionItems: string[] = [];
    const resources: Array<{title: string, url: string, type: string}> = [];
    
    // Simple parsing for skills and actions (could be enhanced with more sophisticated NLP)
    const lines = advice.split('\n');
    let currentSection = '';
    
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('skill') && trimmed.includes(':')) {
        currentSection = 'skills';
      } else if (trimmed.toLowerCase().includes('action') || trimmed.toLowerCase().includes('step')) {
        currentSection = 'actions';
      } else if (trimmed.startsWith('- ') || trimmed.match(/^\d+\./)) {
        const item = trimmed.replace(/^[-\d.]\s*/, '');
        if (currentSection === 'skills' && item.length > 0) {
          suggestedSkills.push(item);
        } else if (currentSection === 'actions' && item.length > 0) {
          actionItems.push(item);
        }
      }
    });
    
    return {
      advice,
      suggestedSkills: suggestedSkills.slice(0, 5), // Limit to 5 skills
      actionItems: actionItems.slice(0, 5), // Limit to 5 actions
      resources
    };
  }
);