'use server';
/**
 * @fileOverview An AI flow to calculate a user's ALT-SCORE based on their financial data.
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
  reasons: z.array(ReasonSchema).describe('Top 3-4 reasons influencing the score, each represented by a localization key and type.'),
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
  prompt: `You are a financial analyst specializing in credit scoring for small business owners in India. 
Your task is to calculate an "ALT-SCORE" based on the provided financial and additional information. 
The score must be between 300 and 900.

Analyze the following user data:
- Financial Info: {{json financialInfo}}
- Additional Info: {{json additionalInfo}}

Scoring Guidelines:
- Base Score: Start with a base score of 500.
- Profitability (Net Income): Very important. Positive net income is a strong positive (+100–200). Negative income is major negative.
- Digital Transactions (UPI): High % via UPI is positive.
- Cash Dependency: High % cash income is negative.
- CIBIL Score: Good (>700) is strong positive, low (<600) is strong negative.
- Business Duration: >5 years is positive.
- Asset Ownership: Owning house/business is positive.
- Existing Loan: Slight negative.
- Govt Benefits: Slight positive.

Your Task:
1. Calculate ALT-SCORE in range 300–900.
2. Check data sufficiency (if missing key financial fields like monthlyUpiTransactions or monthlyExpenses, set isDataSufficient to false).
3. Provide 3–4 reasons for the score. For EACH reason, you MUST provide:
   - A "key" property. This key MUST be one of the valid keys listed below. Do not use any other string. It is critical that every reason has a valid 'key'.
   - A "type" property ("positive" or "negative").
   - Valid keys:
     - Positive: "altScore.reasons.highProfit", "altScore.reasons.highUpi", "altScore.reasons.goodCibil", "altScore.reasons.longDuration", "altScore.reasons.ownsAssets", "altScore.reasons.govtBenefits"
     - Negative: "altScore.reasons.lowProfit", "altScore.reasons.highCash", "altScore.reasons.lowCibil", "altScore.reasons.shortDuration", "altScore.reasons.noAssets", "altScore.reasons.existingLoan"
4. Provide actionable tips for improvement. Each tip MUST be one of the following valid keys:
   - If data is insufficient, ONLY use: "altScore.tips.complete"
   - Otherwise, choose from: "altScore.tips.upi", "altScore.tips.cibil", "altScore.tips.pan", "altScore.tips.cashflow"

Return ONLY JSON in the specified schema. It is absolutely mandatory that every reason object in the 'reasons' array contains a 'key' property with one of the specified valid string values.`,
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
