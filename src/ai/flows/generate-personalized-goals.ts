'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized weekly goals for a user
 * based on their career path and XP level.
 *
 * - generatePersonalizedGoals - A function that generates personalized weekly goals.
 * - GeneratePersonalizedGoalsInput - The input type for the generatePersonalizedGoals function.
 * - GeneratePersonalizedGoalsOutput - The return type for the generatePersonalizedGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedGoalsInputSchema = z.object({
  careerPath: z.string().describe('The user\'s selected career path.'),
  xpLevel: z.number().describe('The user\'s current XP level.'),
  userSkills: z.array(z.string()).optional().describe('The user\'s skills.'),
  userGoals: z.string().optional().describe('The user\'s goals.'),
});
export type GeneratePersonalizedGoalsInput = z.infer<
  typeof GeneratePersonalizedGoalsInputSchema
>;

const GeneratePersonalizedGoalsOutputSchema = z.object({
  weeklyGoals: z
    .array(z.string())
    .describe('A list of personalized weekly goals for the user.'),
});
export type GeneratePersonalizedGoalsOutput = z.infer<
  typeof GeneratePersonalizedGoalsOutputSchema
>;

export async function generatePersonalizedGoals(
  input: GeneratePersonalizedGoalsInput
): Promise<GeneratePersonalizedGoalsOutput> {
  return generatePersonalizedGoalsFlow(input);
}

const generatePersonalizedGoalsPrompt = ai.definePrompt({
  name: 'generatePersonalizedGoalsPrompt',
  input: {
    schema: GeneratePersonalizedGoalsInputSchema,
  },
  output: {
    schema: GeneratePersonalizedGoalsOutputSchema,
  },
  prompt: `You are a career coach that specializes in creating personalized weekly goals for users.  Take into account career trends, the user\'s experience and goals.

  Generate a list of weekly goals for the user to help them advance in their career.

  Career Path: {{{careerPath}}}
  XP Level: {{{xpLevel}}}
  {{#if userSkills}} User Skills:
  {{#each userSkills}} - {{{this}}}
  {{/each}}
  {{else}} No skills listed.{{/if}}
  User Goals: {{{userGoals}}}
  `,}
);

const generatePersonalizedGoalsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedGoalsFlow',
    inputSchema: GeneratePersonalizedGoalsInputSchema,
    outputSchema: GeneratePersonalizedGoalsOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedGoalsPrompt(input);
    return output!;
  }
);
