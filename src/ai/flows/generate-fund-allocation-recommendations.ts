'use server';
/**
 * @fileOverview AI-powered recommendations for fund allocation.
 *
 * - generateFundAllocationRecommendations - A function that generates fund allocation recommendations.
 * - GenerateFundAllocationRecommendationsInput - The input type for the generateFundAllocationRecommendations function.
 * - GenerateFundAllocationRecommendationsOutput - The return type for the generateFundAllocationRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFundAllocationRecommendationsInputSchema = z.object({
  studentNeeds: z
    .string()
    .describe('Description of student needs and priorities.'),
  availableFunds: z.number().describe('The total amount of available funds.'),
  previousAllocations: z
    .string()
    .optional()
    .describe('Optional: Details of previous fund allocations.'),
});
export type GenerateFundAllocationRecommendationsInput = z.infer<
  typeof GenerateFundAllocationRecommendationsInputSchema
>;

const GenerateFundAllocationRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('AI-powered recommendations for fund allocation.'),
  rationale: z
    .string()
    .describe('Explanation of the rationale behind the recommendations.'),
});
export type GenerateFundAllocationRecommendationsOutput = z.infer<
  typeof GenerateFundAllocationRecommendationsOutputSchema
>;

export async function generateFundAllocationRecommendations(
  input: GenerateFundAllocationRecommendationsInput
): Promise<GenerateFundAllocationRecommendationsOutput> {
  return generateFundAllocationRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFundAllocationRecommendationsPrompt',
  input: {schema: GenerateFundAllocationRecommendationsInputSchema},
  output: {schema: GenerateFundAllocationRecommendationsOutputSchema},
  prompt: `You are an expert in fund allocation for educational institutions. Based on the following information, provide recommendations for how to allocate funds to best meet student needs and priorities.

Student Needs and Priorities: {{{studentNeeds}}}
Available Funds: {{{availableFunds}}}

{{#if previousAllocations}}
Previous Allocations: {{{previousAllocations}}}
{{/if}}

Provide clear and actionable recommendations, along with a detailed rationale for each recommendation.
`, // Added Handlebars conditional for previousAllocations
});

const generateFundAllocationRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateFundAllocationRecommendationsFlow',
    inputSchema: GenerateFundAllocationRecommendationsInputSchema,
    outputSchema: GenerateFundAllocationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
