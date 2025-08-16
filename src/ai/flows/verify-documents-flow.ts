
'use server';
/**
 * @fileOverview An AI flow to verify user-submitted documents.
 *
 * - verifyDocuments - A function that handles the document verification process.
 * - VerifyDocumentsInput - The input type for the verifyDocuments function.
 * - VerifyDocumentsOutput - The return type for the verifyDocuments function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';

const VerifyDocumentsInputSchema = z.object({
  aadharDataUri: z
    .string()
    .describe(
      "A photo of an Aadhar card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  shopPhotoDataUri: z
    .string()
    .describe(
      "A photo of a shop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  panDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of a PAN card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyDocumentsInput = z.infer<typeof VerifyDocumentsInputSchema>;

const VerifyDocumentsOutputSchema = z.object({
  isAadharValid: z.boolean().describe('Whether the Aadhar card is a valid government-issued ID.'),
  isPanValid: z.boolean().describe('Whether the PAN card is a valid government-issued ID. True if not provided.'),
  isShopPhotoValid: z.boolean().describe('Whether the photo appears to be of a legitimate shop or place of business.'),
});
export type VerifyDocumentsOutput = z.infer<typeof VerifyDocumentsOutputSchema>;


export async function verifyDocuments(input: VerifyDocumentsInput): Promise<VerifyDocumentsOutput> {
  return verifyDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyDocumentsPrompt',
  input: { schema: VerifyDocumentsInputSchema },
  output: { schema: VerifyDocumentsOutputSchema },
  prompt: `You are an expert document verifier for a loan application system in India. Your task is to analyze the provided images and determine their validity.

Aadhar Card Analysis:
- Examine the Aadhar card image: {{media url=aadharDataUri}}
- Determine if it is a legitimate, government-issued Aadhar card. Look for official markings, holograms, and standard layout.
- Set isAadharValid to true if it appears to be a real Aadhar card, otherwise set it to false.

Shop Photo Analysis:
- Examine the shop photo: {{media url=shopPhotoDataUri}}
- Determine if the image is a genuine photograph of a physical shop or a place of business (like a stall, cart, or store). It should not be a selfie, a random object, or an abstract image.
- Set isShopPhotoValid to true if it's a valid shop photo, otherwise set it to false.

{{#if panDataUri}}
PAN Card Analysis:
- Examine the PAN card image: {{media url=panDataUri}}
- Determine if it is a legitimate, government-issued PAN card. Look for the Income Tax Department logo and standard format.
- Set isPanValid to true if it appears to be a real PAN card, otherwise set it to false.
{{else}}
- No PAN card was provided. Set isPanValid to true.
{{/if}}

Provide your assessment in the specified JSON format.
`,
});

const verifyDocumentsFlow = ai.defineFlow(
  {
    name: 'verifyDocumentsFlow',
    inputSchema: VerifyDocumentsInputSchema,
    outputSchema: VerifyDocumentsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
