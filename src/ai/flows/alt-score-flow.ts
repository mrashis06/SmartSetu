
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
  key: z.string().describe('A localization key for the reason.'),
  type: z.enum(['positive', 'negative']).describe('Whether the reason is a positive or negative factor.'),
});

const AltScoreOutputSchema = z.object({
  score: z.number().min(300).max(900).describe('The calculated ALT-SCORE, between 300 and 900.'),
  reasons: z.array(ReasonSchema).describe('A list of the top 3-4 reasons influencing the score, represented by localization keys.'),
  tips: z.array(z.string()).describe('A list of actionable tip localization keys for the user to improve their score.'),
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
- Financial Info: {{json financialInfo}}
- Additional Info: {{json additionalInfo}}

Scoring Guidelines:
- Base Score: Start with a base score of 500.
- **Profitability (Net Income):** This is the MOST IMPORTANT factor. A high positive net income (total income - expenses) is a very strong positive signal. Increase score significantly (+100 to +200) for strong profitability. A negative net income is a major negative factor.
- **Digital Transaction Health:** A high percentage of income via UPI is a strong positive signal, even if the total amount is low, as it shows transparency. Analyze the ratio of UPI transactions to total income.
- **Cash Dependency:** A high ratio of cash income to total income is a negative factor, as it indicates less transparency.
- **CIBIL Score:** If available and good (e.g., >700), this is a major positive factor (+100 to +200). If low (<600), it's a major negative factor.
- **Business Duration:** 'More than 5 years' is a positive signal (+20 to +50).
- **Asset Ownership:** Owning a house or the business are positive stability indicators (+10 to +40 each).
- **Existing Loan:** Having an existing loan is a slight negative factor (-10 to -30), as it represents existing debt.
- **Govt Benefits:** Receiving government benefits can be a slight positive, showing integration with financial systems (+10).

Your Task:
1.  Calculate the final ALT-SCORE after considering all factors, with a strong emphasis on Net Income. Ensure it is within the 300-900 range.
2.  Determine if there is enough data. If crucial fields like monthlyUpiTransactions, monthlyCashIncome, or monthlyExpenses are missing, set isDataSufficient to false. Otherwise, set it to true.
3.  Provide the top 3-4 most influential reasons for the calculated score. Use the following localization keys for the 'key' field:
    - Positive Reasons:
        - 'altScore.reasons.positive.highProfit': For strong positive net income.
        - 'altScore.reasons.positive.highUpi': For a high percentage of UPI transactions.
        - 'altScore.reasons.positive.goodCibil': For a good CIBIL score.
        - 'altScore.reasons.positive.longDuration': For business duration over 5 years.
        - 'altScore.reasons.positive.ownsAssets': For owning a house or business.
        - 'altScore.reasons.positive.govtBenefits': For receiving government benefits.
    - Negative Reasons:
        - 'altScore.reasons.negative.lowProfit': For negative or low net income.
        - 'altScore.reasons.negative.highCash': For high dependency on cash income.
        - 'altScore.reasons.negative.lowCibil': For a low CIBIL score.
        - 'altScore.reasons.negative.shortDuration': For business duration less than 5 years.
        - 'altScore.reasons.negative.noAssets': For not owning a house or business.
        - 'altScore.reasons.negative.existingLoan': For having an existing loan.
4.  Provide a list of actionable tip localization keys.
    - If isDataSufficient is false, your primary tip key MUST be 'altScore.tips.complete'.
    - Other tip keys: 'altScore.tips.upi', 'altScore.tips.cibil', 'altScore.tips.pan', 'altScore.tips.cashflow'.

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
