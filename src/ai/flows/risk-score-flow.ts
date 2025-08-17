
'use server';
/**
 * @fileOverview An AI flow to calculate a user's RISK-SCORE based on their financial data.
 *
 * - calculateRiskScore - Calculates the risk score and provides analysis.
 * - RiskScoreInput - The input type for the calculateRiskScore function.
 * - RiskScoreOutput - The return type for the calculateRiskScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  AdditionalInfoData,
  FinancialInfoData,
} from '@/context/questionnaire-context';

const RiskScoreInputSchema = z.object({
  financialInfo: z.custom<FinancialInfoData>(),
  additionalInfo: z.custom<AdditionalInfoData>(),
});
export type RiskScoreInput = z.infer<typeof RiskScoreInputSchema>;

const RiskScoreOutputSchema = z.object({
  risk_score: z.number().min(0).max(10).describe('The calculated RISK-SCORE, between 0 and 10.'),
  category: z.enum(['Low', 'Medium', 'High']).describe('The risk category based on the score.'),
  reasons: z.array(z.string()).describe('A list of localization keys for the top 3-4 reasons influencing the score.'),
  tips: z.array(z.string()).describe('A list of localization keys for actionable tips for the user to improve their score.'),
});
export type RiskScoreOutput = z.infer<typeof RiskScoreOutputSchema>;

export async function calculateRiskScore(
  input: RiskScoreInput
): Promise<RiskScoreOutput> {
  return riskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskScorePrompt',
  input: { schema: RiskScoreInputSchema },
  output: { schema: RiskScoreOutputSchema },
  prompt: `You are a risk analyst for a loan provider specializing in small business owners in India. Your task is to calculate a "RISK-SCORE" based on the provided financial and additional information. The score must be between 0 (very low risk) and 10 (very high risk).

Analyze the following user data:
- Financial Info: {{json financialInfo}}
- Additional Info: {{json additionalInfo}}

Risk Scoring Guidelines:
- **Negative Net Income (Income - Expenses):** This is the MOST IMPORTANT factor. A high negative net income is a strong indicator of financial distress and very high risk. A profitable business is fundamentally less risky.
- **High Cash Dependency:** Analyze the ratio of cash income to total income. A high dependency on cash is a major risk factor as it suggests a less transparent and potentially unstable income stream. This should significantly increase the risk score.
- **Existing Loan:** Having an existing loan increases risk as it adds to the debt burden.
- **Short Business Duration:** Businesses operating for less than 5 years are generally riskier than established ones.
- **No CIBIL Score:** While common for small vendors, the absence of a credit history (CIBIL score) increases uncertainty and should be considered a moderate risk factor.
- **Not Owning a House/Business:** Lack of personal or business assets can indicate lower stability and higher risk.
- **Low Stock/Inventory Value:** This suggests a smaller scale of operation, which can be a minor risk factor, but should not be heavily penalized on its own.

Your Task:
1.  Calculate the final RISK-SCORE between 0 and 10, with a strong emphasis on Net Income.
2.  Categorize the score: 0-3 is 'Low' risk, 4-6 is 'Medium' risk, 7-10 is 'High' risk.
3.  Provide localization keys for the top 3-4 most influential reasons for the calculated score. Use the following keys:
    - 'riskScore.reasons.cashflow': For negative monthly cash flow.
    - 'riskScore.reasons.cash': For high dependency on cash income.
    - 'riskScore.reasons.loan': For having an existing loan.
    - 'riskScore.reasons.duration': For short business duration.
    - 'riskScore.reasons.cibil': For the absence of a CIBIL score.
    - 'riskScore.reasons.assets': For lack of personal or business assets.
4.  Provide a list of localization keys for actionable tips for improvement. Use the following keys:
    - 'riskScore.tips.upi'
    - 'riskScore.tips.repay'
    - 'riskScore.tips.pan'

Provide your assessment in the specified JSON format.
`,
});

const riskScoreFlow = ai.defineFlow(
  {
    name: 'riskScoreFlow',
    inputSchema: RiskScoreInputSchema,
    outputSchema: RiskScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
