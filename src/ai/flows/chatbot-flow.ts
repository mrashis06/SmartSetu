
'use server';
/**
 * @fileOverview A simple chatbot flow for SmartSetu-Bot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string().describe('The user\'s latest message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string().describe("The bot's response.");
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {
    const prompt = `You are "SmartSetu-Bot", a friendly and helpful AI assistant for the SmartSetu application, which helps small business owners in India get loans.

Your primary role is to:
1.  Answer user questions about the loan application process, ALT-SCORE, RISK-SCORE, and required documents.
2.  Guide users through the app if they are lost.
3.  Provide general financial advice for small business owners.
4.  Keep your answers concise and easy to understand.
5.  If you don't know the answer, say so politely. Do not make up information.

Here is the conversation history:
{{#each history}}
{{#if (eq this.role 'user')}}
User: {{{this.content}}}
{{else}}
You: {{{this.content}}}
{{/if}}
{{/each}}

Here is the user's new message:
User: {{{message}}}

Your response:
`;

    const llmResponse = await ai.generate({
      prompt,
      history: history.map((msg) => ({ role: msg.role, content: [{ text: msg.content }] })),
      config: {
        temperature: 0.5,
      },
    });

    return llmResponse.text;
  }
);
