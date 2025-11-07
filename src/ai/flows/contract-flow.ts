
'use server';
/**
 * @fileOverview An AI flow for generating service agreement contracts.
 *
 * - generateContract - A function that takes user input and conversation history to generate contract text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the structure for a message in the conversation history
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

// Define the input schema for the main function
const ContractInputSchema = z.object({
  prompt: z.string().describe('The latest user message or request.'),
  history: z.array(MessageSchema).describe('The conversation history between the user and the assistant.'),
});
export type ContractInput = z.infer<typeof ContractInputSchema>;

const contractPrompt = ai.definePrompt({
  name: 'contractPrompt',
  input: { schema: ContractInputSchema },
  output: { format: 'text' },
  prompt: `You are an AI assistant designed exclusively to help vendors create service agreement contracts. Your ONLY purpose is to generate a contract.

Strict Rules:
1.  **Stay On Topic**: Your conversation must ALWAYS be about creating a service agreement. If the user asks about anything else (e.g., the weather, jokes, general questions, other legal documents), you MUST politely decline and steer the conversation back to creating the contract. Example response: "I can only assist with creating service agreements. Shall we continue with the contract details?"
2.  **Gather Information**: Ask clarifying questions to gather all necessary details for a standard service contract. This includes:
    -   Vendor's Name and Client's Name
    -   Description of Services to be provided
    -   Dates of Service (Start and End)
    -   Payment Terms (Total amount, deposit, payment schedule, accepted payment methods)
    -   Cancellation Policy
    -   Any other special terms or clauses mentioned by the user.
3.  **Generate the Full Contract**: Once you have enough information, or if the user asks you to "create the contract" or "generate the agreement", generate the full text of the contract. The contract should be well-formatted using Markdown for clarity (headings, bold text, lists). It MUST start with the title "SERVICE AGREEMENT".
4.  **Be an Assistant, Not a Lawyer**: Always include a disclaimer at the end of the generated contract text: "This is an AI-generated document and is not a substitute for legal advice. It is highly recommended to have this agreement reviewed by a qualified legal professional before signing."

Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

New User Input:
{{{prompt}}}

Your Response:`,
});

const generateContractFlow = ai.defineFlow(
  {
    name: 'generateContractFlow',
    inputSchema: ContractInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await contractPrompt(input);
    return response.text;
  }
);

/**
 * Generates a response for a contract creation conversation.
 * @param prompt The latest user message.
 * @param history The existing conversation history.
 * @returns The AI's response as a string.
 */
export async function generateContract(prompt: string, history: z.infer<typeof MessageSchema>[]): Promise<string> {
  return generateContractFlow({ prompt, history });
}
