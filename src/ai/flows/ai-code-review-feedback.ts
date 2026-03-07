'use server';
/**
 * @fileOverview This file implements a Genkit flow for AI-powered code review.
 *
 * - aiCodeReviewFeedback - A function that handles the AI code review process.
 * - AICodeReviewFeedbackInput - The input type for the aiCodeReviewFeedback function.
 * - AICodeReviewFeedbackOutput - The return type for the aiCodeReviewFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AICodeReviewFeedbackInputSchema = z.object({
  code: z.string().describe('The source code to be reviewed.'),
  language: z.enum(['Python', 'JavaScript', 'Java', 'C++']).describe('The programming language of the source code.'),
  focusAreas: z.array(z.enum(['Bug detection', 'Performance optimization', 'Security analysis', 'Best coding practices'])).describe('Specific areas the AI should focus on during the review.'),
});
export type AICodeReviewFeedbackInput = z.infer<typeof AICodeReviewFeedbackInputSchema>;

const IssueSchema = z.object({
  type: z.enum(['Bug', 'Security Vulnerability', 'Performance Issue', 'Best Practice Violation', 'General Comment']).describe('The type of issue identified.'),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Informational']).describe('The severity level of the issue.'),
  description: z.string().describe('A detailed explanation of the issue.'),
  lineNumbers: z.array(z.number()).optional().describe('Optional: Specific line numbers in the code where the issue is found.'),
  suggestions: z.string().describe('Suggestions for how to fix or improve the identified issue.'),
});

const AICodeReviewFeedbackOutputSchema = z.object({
  review: z.array(IssueSchema).describe('An array of identified issues in the code.'),
});
export type AICodeReviewFeedbackOutput = z.infer<typeof AICodeReviewFeedbackOutputSchema>;

const aiCodeReviewFeedbackPrompt = ai.definePrompt({
  name: 'aiCodeReviewFeedbackPrompt',
  input: { schema: AICodeReviewFeedbackInputSchema },
  output: { schema: AICodeReviewFeedbackOutputSchema },
  model: 'googleai/gemini-2.5-flash', // Using the default model configured in genkit.ts
  prompt: `You are an expert AI Code Review Agent. Your task is to perform a comprehensive code review based on the provided source code, programming language, and specific focus areas.

Analyze the code thoroughly for:
- Bugs and logical errors
- Security vulnerabilities
- Performance bottlenecks
- Violations of best coding practices

For each identified issue, provide:
1.  **Type**: Classify as "Bug", "Security Vulnerability", "Performance Issue", "Best Practice Violation", or "General Comment".
2.  **Severity**: Assign a severity level: "Critical", "High", "Medium", "Low", or "Informational".
3.  **Description**: A detailed explanation of the problem.
4.  **Line Numbers**: If applicable, specify the line numbers where the issue is found (as an array of numbers). If not applicable, omit this field.
5.  **Suggestions**: Actionable advice on how to fix or improve the code.

The review should strictly adhere to the specified output JSON format. Ensure all issues are included in the 'review' array.

---
Programming Language: {{{language}}}
Focus Areas: {{#each focusAreas}}
- {{this}}
{{/each}}

Code to Review:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`
---
Output JSON:
\`\`\`json
{
  "review": [
    {
      "type": "Bug",
      "severity": "Critical",
      "description": "Example: Unhandled exception when 'data' is null, leading to a crash.",
      "lineNumbers": [15, 20],
      "suggestions": "Example: Add a null check for 'data' before dereferencing it. Consider using a 'try-catch' block for robust error handling."
    },
    {
      "type": "Security Vulnerability",
      "severity": "High",
      "description": "Example: SQL injection vulnerability due to concatenated query strings.",
      "lineNumbers": [30],
      "suggestions": "Example: Use parameterized queries or an ORM to prevent SQL injection."
    }
  ]
}
\`\`\`
Remember to provide real and specific examples from the code for each issue.`,
});

const aiCodeReviewFeedbackFlow = ai.defineFlow(
  {
    name: 'aiCodeReviewFeedbackFlow',
    inputSchema: AICodeReviewFeedbackInputSchema,
    outputSchema: AICodeReviewFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await aiCodeReviewFeedbackPrompt(input);
    return output!;
  }
);

export async function aiCodeReviewFeedback(input: AICodeReviewFeedbackInput): Promise<AICodeReviewFeedbackOutput> {
  return aiCodeReviewFeedbackFlow(input);
}
