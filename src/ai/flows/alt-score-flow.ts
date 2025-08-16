
'use server';
/**
 * @fileOverview An AI flow to calculate a user's ALT-SCORE based on their financial data.
 *
 * - calculateAltScore - Calculates the score and provides analysis.
 * - AltScoreInput - The input type for the calculateAltScore function.
 * - AltScoreOutput - The return type for the calculateAltScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  AdditionalInfoData,
  FinancialInfoData,
} from '@/context/questionnaire-context';

const AltScoreInputSchema = z.object({
  financialInfo: z.custom<FinancialInfoData>(),
  additionalInfo: z.custom<AdditionalInfoData>(),
});
export type AltScoreInput = z.infer<typeof AltScoreInputSchema>;

const ReasonSchema = z.object({
  reason: z.string().describe('A single, concise reason for the calculated score.'),
  type: z.enum(['positive', 'negative']).describe('Whether the reason is a positive or negative factor.'),
});

const AltScoreOutputSchema = z.object({
  score: z.number().min(300).max(900).describe('The calculated ALT-SCORE, between 300 and 900.'),
  reasons: z.array(ReasonSchema).describe('A list of the top 3-4 reasons influencing the score.'),
  tips: z.array(z.string()).describe('A list of actionable tips for the user to improve their score. If data is missing, this should include a tip to complete the form.'),
  isDataSufficient: z.boolean().describe('Whether enough data was provided to calculate a meaningful score.'),
});
export type AltScoreOutput = z.infer<typeof AltScoreOutputSchema>;

export async function calculateAltScore(
  input: AltScoreInput
): Promise<AltScoreOutput> {
  return altScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'altScorePrompt',
  input: { schema: AltScoreInputSchema },
  output: { schema: AltScoreOutputSchema },
  prompt: `You are a financial analyst specializing in credit scoring for small business owners in India. Your task is to calculate an "ALT-SCORE" based on the provided financial and additional information. The score must be between 300 and 900.

Analyze the following user data:
- Financial Info: {{financialInfo}}
- Additional Info: {{additionalInfo}}

Scoring Guidelines:
- Base Score: Start with a base score of 500.
- Monthly UPI Transactions: High UPI transaction value is a strong positive signal. Increase score significantly (e.g., +50 to +150) for values above ₹50,000. Low values are a negative signal.
- Income vs. Expenses: A high positive net income (cash income - expenses) is very good. Increase score (+50 to +100). A negative net income is a strong negative signal.
- Cash Dependency: High ratio of cash income to UPI transactions is a negative factor.
- Business Duration: 'More than 5 years' is a positive signal (+20 to +50).
- Existing Loan: Having an existing loan is a slight negative factor (-10 to -30), as it represents existing debt.
- CIBIL Score: If available and good (e.g., >700), this is a major positive factor (+100 to +200). If low (<600), it's a major negative factor.
- Own House/Business: Owning a house or the business are positive stability indicators (+10 to +40 each).
- Govt Benefits: Receiving government benefits can be a slight positive, showing integration with financial systems (+10).

Your Task:
1.  Calculate the final ALT-SCORE after considering all factors. Ensure it is within the 300-900 range.
2.  Determine if there is enough data. If crucial fields like monthlyUpiTransactions, monthlyCashIncome, or monthlyExpenses are missing, set isDataSufficient to false. Otherwise, set it to true.
3.  Provide the top 3-4 most influential reasons for the calculated score, labeling each as 'positive' or 'negative'.
4.  Provide a list of actionable tips for improvement.
    - If isDataSufficient is false, your primary tip MUST be 'Complete the full questionnaire to get an accurate score and analysis.'
    - Other tips could include: 'Increase the volume of UPI transactions', 'Try to build a CIBIL credit history', 'Upload your PAN card for better identity verification', 'Maintain a positive monthly cash flow'.

Provide your assessment in the specified JSON format.
`,
});

const altScoreFlow = ai.defineFlow(
  {
    name: 'altScoreFlow',
    inputSchema: AltScoreInputSchema,
    outputSchema: AltScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
