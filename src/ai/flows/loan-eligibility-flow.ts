
'use server';
/**
 * @fileOverview An AI flow to determine loan eligibility, suggest a loan amount, and list potential lenders.
 *
 * - determineLoanEligibility - A function that handles the loan eligibility process.
 * - LoanEligibilityInput - The input type for the determineLoanEligibility function.
 * - LoanEligibilityOutput - The return type for the determineLoanEligibility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { AltScoreOutput } from './alt-score-flow';
import { RiskScoreOutput } from './risk-score-flow';

const LoanEligibilityInputSchema = z.object({
  altScore: z.custom<AltScoreOutput>(),
  riskScore: z.custom<RiskScoreOutput>(),
  hasCibil: z.boolean(),
});
export type LoanEligibilityInput = z.infer<typeof LoanEligibilityInputSchema>;

const BankSchema = z.object({
  name: z.string().describe('Name of the bank or financial institution.'),
  chance: z.enum(['High', 'Medium', 'Low']).describe('The likelihood of getting a loan from this bank.'),
});

const LoanEligibilityOutputSchema = z.object({
  maxLoanAmount: z
    .number()
    .describe(
      'The maximum loan amount the user is eligible for, in Indian Rupees.'
    ),
  banks: z
    .array(BankSchema)
    .describe(
      'A list of banks categorized by the chance of loan approval.'
    ),
  tips: z
    .array(z.string())
    .describe(
      'Actionable tips for the user to improve their loan eligibility.'
    ),
});
export type LoanEligibilityOutput = z.infer<typeof LoanEligibilityOutputSchema>;

export async function determineLoanEligibility(
  input: LoanEligibilityInput
): Promise<LoanEligibilityOutput> {
  return loanEligibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loanEligibilityPrompt',
  input: { schema: LoanEligibilityInputSchema },
  output: { schema: LoanEligibilityOutputSchema },
  prompt: `You are an expert loan officer for small business owners in India. Your task is to determine the maximum loan eligibility and suggest potential lenders based on the user's ALT-SCORE, RISK-SCORE, and CIBIL status.

User's Data:
- ALT-SCORE Info: {{json altScore}}
- RISK-SCORE Info: {{json riskScore}}
- Has CIBIL Score: {{hasCibil}}

Maximum Loan Amount Calculation:
1.  **Base Limit:**
    - If 'hasCibil' is true, the absolute maximum limit is ₹100,000.
    - If 'hasCibil' is false (new vendor), the absolute maximum limit is ₹50,000.
2.  **Score-Based Adjustment:**
    - High ALT-SCORE (>650) and Low RISK-SCORE (<4) should result in eligibility for the maximum base limit.
    - Moderate ALT-SCORE (550-650) or Medium RISK-SCORE (4-6) should result in a reduced amount (e.g., 50-70% of the base limit).
    - Low ALT-SCORE (<550) or High RISK-SCORE (>6) should result in a very low or zero loan amount. Prioritize the RISK-SCORE in this calculation; a high risk score is a strong negative signal.
3.  **Final Amount:** Calculate and set the final 'maxLoanAmount'. Round it to the nearest thousand.

Bank Suggestions:
- Based on the scores, suggest a list of banks.
- **High Chance (ALT-SCORE > 650, RISK-SCORE < 4):** Suggest banks like Ujjivan Small Finance Bank, Bandhan Bank. These are more likely to lend to this profile.
- **Medium Chance (ALT-SCORE 550-650, RISK-SCORE 4-6):** Suggest banks like SBI Small Loan, HDFC MicroBiz.
- **Low Chance (ALT-SCORE < 550 or RISK-SCORE > 6):** Suggest banks like ICICI Business Loan, but categorize them as 'Low' chance.

Tips for Improvement:
- Provide 2-3 actionable tips based on the user's data.
- Example tips: "Upload your PAN card to increase your chances of approval.", "Repaying any existing loans on time will improve your eligibility.", "Increase your monthly UPI transactions to build a stronger digital financial history."

Provide your final assessment in the specified JSON format.
`,
});

const loanEligibilityFlow = ai.defineFlow(
  {
    name: 'loanEligibilityFlow',
    inputSchema: LoanEligibilityInputSchema,
    outputSchema: LoanEligibilityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
