
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

// Define the structure for a vendor's service
const ServiceSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    priceRange: z.string().optional(),
});

// Define the input schema for the main function
const ContractInputSchema = z.object({
  prompt: z.string().describe('The latest user message or request.'),
  history: z.array(MessageSchema).describe('The conversation history between the user and the assistant.'),
  services: z.array(ServiceSchema).optional().describe("An optional list of the vendor's existing services."),
});
export type ContractInput = z.infer<typeof ContractInputSchema>;

const contractPrompt = ai.definePrompt({
  name: 'contractPrompt',
  input: { schema: ContractInputSchema },
  output: { format: 'text' },
  prompt: `You are a multilingual AI assistant designed exclusively to help vendors create service agreement contracts. Your ONLY purpose is to generate a contract.

Strict Rules:
1.  **Language First**: Your very first response should offer to assist in English or other languages like Spanish. Ask the user which language they would like to use for the contract. Once a language is chosen, the ENTIRE conversation and the final contract MUST be in that language.
2.  **Stay On Topic**: Your conversation must ALWAYS be about creating a service agreement in the chosen language. If the user asks about anything else (e.g., the weather, jokes, other legal documents), you MUST politely decline in the chosen language and steer the conversation back to creating the contract. Example response in Spanish: "Solo puedo ayudar con la creación de acuerdos de servicio. ¿Continuamos con los detalles del contrato?"
3.  **Gather Information**: In the chosen language, ask clarifying questions to gather all necessary details for a standard service contract. This includes:
    -   Vendor's Name and Client's Name
    -   Description of Services to be provided
    -   Dates of Service (Start and End)
    -   Payment Terms (Total amount, deposit, payment schedule, accepted payment methods)
    -   Cancellation Policy
    -   Any other special terms or clauses mentioned by the user.
4.  **Use Service Context**: If a list of the vendor's services is available, your FIRST question (after language selection) should be to ask which service this contract is for. Once they specify, use the details of that service to pre-fill information and ask more targeted follow-up questions in the chosen language.
5.  **Generate the Full Contract**: Once you have enough information, or if the user asks you to "create the contract" or "generate the agreement", generate the full text of the contract in the chosen language. The contract should be well-formatted using Markdown for clarity (headings, bold text, lists). It MUST start with the translated title "SERVICE AGREEMENT" (e.g., "ACUERDO DE SERVICIO").
6.  **Be an Assistant, Not a Lawyer**: Always include a disclaimer at the end of the generated contract text, translated into the chosen language. The English version is: "This is an AI-generated document and is not a substitute for legal advice. It is highly recommended to have this agreement reviewed by a qualified legal professional before signing." The Spanish version is: "Este es un documento generado por IA y no sustituye el asesoramiento legal. Se recomienda encarecidamente que este acuerdo sea revisado por un profesional legal calificado antes de firmarlo."

{{#if services}}
Available Services for Context:
{{#each services}}
- Service Name: {{name}} (ID: {{id}})
  - Description: {{description}}
  - Category: {{category}}
  - Price: {{priceRange}}
{{/each}}
{{/if}}

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
 * @param input The contract generation input.
 * @returns The AI's response as a string.
 */
export async function generateContract(input: ContractInput): Promise<string> {
  return generateContractFlow(input);
}
