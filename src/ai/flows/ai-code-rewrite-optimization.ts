'use server';
/**
 * @fileOverview A Genkit flow for rewriting and optimizing source code using AI.
 *
 * - aiCodeRewriteOptimization - A function that handles the code rewriting process.
 * - AICodeRewriteOptimizationInput - The input type for the aiCodeRewriteOptimization function.
 * - AICodeRewriteOptimizationOutput - The return type for the aiCodeRewriteOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SUPPORTED_LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++'] as const;
const FOCUS_AREAS = [
  'Bug detection',
  'Performance optimization',
  'Security analysis',
  'Best coding practices',
] as const;

// Define input schema
const AICodeRewriteOptimizationInputSchema = z.object({
  code: z.string().describe('The original source code to be rewritten.'),
  language: z
    .enum(SUPPORTED_LANGUAGES)
    .describe('The programming language of the provided code.'),
  focusAreas: z
    .array(z.enum(FOCUS_AREAS))
    .describe('Specific areas the AI should focus on during rewrite.')
    .optional(),
  reviewFeedback: z
    .string()
    .describe('Optional: AI review feedback to guide the rewrite process.')
    .optional(),
});
export type AICodeRewriteOptimizationInput = z.infer<
  typeof AICodeRewriteOptimizationInputSchema
>;

// Define output schema
const AICodeRewriteOptimizationOutputSchema = z.object({
  rewrittenCode: z
    .string()
    .describe('The optimized, production-ready, and readable rewritten code.'),
  commentsSummary: z
    .string()
    .describe(
      'A summary of the improvements made and explanations for added comments.'
    ),
});
export type AICodeRewriteOptimizationOutput = z.infer<
  typeof AICodeRewriteOptimizationOutputSchema
>;

// Export wrapper function
export async function aiCodeRewriteOptimization(
  input: AICodeRewriteOptimizationInput
):
  Promise<AICodeRewriteOptimizationOutput> {
  return aiCodeRewriteOptimizationFlow(input);
}

// Define the prompt
const rewritePrompt = ai.definePrompt({
  name: 'codeRewriteOptimizationPrompt',
  input: {schema: AICodeRewriteOptimizationInputSchema},
  output: {schema: AICodeRewriteOptimizationOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an expert software engineer and code optimizer. Your task is to rewrite and optimize the provided {{{language}}} code.

Goal:
1. Refactor the code for improved readability and maintainability.
2. Optimize the code for better performance.
3. Ensure the rewritten code is production-ready.
4. Add comprehensive comments to explain the improvements and complex logic.

{{#if focusAreas}}
Focus your optimization efforts on these specific areas:
{{#each focusAreas}}- {{{this}}}
{{/each}}
{{/if}}

{{#if reviewFeedback}}
Consider the following AI review feedback during the rewrite:
{{{reviewFeedback}}}
{{/if}}

Original {{{language}}} Code:
    \`\`\`{{{language}}}
{{{code}}}
    \`\`\`

Based on the goals and any provided feedback/focus areas, rewrite the code and provide a summary of the changes and new comments. The output must be a JSON object with two fields: 'rewrittenCode' containing the full rewritten code, and 'commentsSummary' containing the explanation.
`,
});

// Define the flow
const aiCodeRewriteOptimizationFlow = ai.defineFlow(
  {
    name: 'aiCodeRewriteOptimizationFlow',
    inputSchema: AICodeRewriteOptimizationInputSchema,
    outputSchema: AICodeRewriteOptimizationOutputSchema,
  },
  async input => {
    const {output} = await rewritePrompt(input);
    if (!output) {
      throw new Error('AI did not return any output for code rewrite.');
    }
    return output;
  }
);
