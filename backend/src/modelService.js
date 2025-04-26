// --- START OF FILE modelService.js ---

import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Regex to find JSON block within ```json ... ```
const jsonRegex = /```json\s*([\s\S]*?)\s*```/;

export async function callModel(history, schemas) { // schemas parameter is not currently used by Anthropic messages API here, but kept for potential future use
  const messages = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content
  }));

  // Ensure the last message is from the user
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
      console.error('Error: Last message must be from the user.');
      return { reply: 'Error: Invalid conversation history.' };
  }


  console.log('Sending request to Claude with messages:', messages);

  try {
    const completion = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Use the latest model if possible
      max_tokens: 512,
      messages,
      system: `
        You are a helpful AI assistant for managing a Solana wallet.
        Your goal is to understand user requests and, when appropriate, prepare a function call to execute actions.
        The only available function is 'send_sol'. Use this function name *exactly* when the user wants to send SOL.
        The 'send_sol' function requires these arguments: 'senderEmail', 'password', 'toAddress', 'amount'.
        If the user asks to send SOL but does not provide their email or password, you MUST ask for the missing 'senderEmail' and 'password' in a normal text response first. Do NOT generate a function call without all required arguments.
        When you have all necessary information ('senderEmail', 'password', 'toAddress', 'amount') and are ready to call the function, respond ONLY with the following JSON structure, nothing else:
        {
          "function": "send_sol",
          "arguments": {
            "senderEmail": "...",
            "password": "...",
            "toAddress": "...",
            "amount": ...
          }
        }
        Do not add any explanatory text, greetings, or markdown formatting around the JSON when you are making a function call.
        If you are just asking for information or replying normally, do not use the JSON format.
      `
    });

    console.log('Claude response:', completion);

    if (!completion || !completion.content || !completion.content[0] || !completion.content[0].text) {
      console.error('Claude response is invalid or empty:', completion);
      return { reply: 'Error: Could not process the request (invalid response from AI).' };
    }

    const text = completion.content[0].text.trim(); // Trim whitespace

    console.log('Raw text from Claude:', text);

    // Try to parse directly if it starts with {
    if (text.startsWith('{') && text.endsWith('}')) {
        try {
            console.log('Attempting direct JSON parse...');
            const parsed = JSON.parse(text);
            if (parsed.function === 'send_sol' && parsed.arguments) {
                 console.log('Direct JSON parse successful:', parsed);
                 // --- ADDED: Validate required arguments ---
                 const args = parsed.arguments;
                 if (!args.senderEmail || !args.password || !args.toAddress || args.amount == null) {
                     console.warn('Function call parsed, but missing required arguments:', args);
                     // Let the user know what's missing based on the refined prompt
                     return { reply: `Okay, I have the recipient and amount. Please provide your sender email and password to proceed.` };
                 }
                 // --- END ADDED ---
                 return { function_call: { name: parsed.function, arguments: parsed.arguments } };
            } else {
                 console.log('Parsed JSON, but not a valid function call format.');
            }
        } catch (err) {
            console.log('Direct JSON parse failed:', err.message);
            // Fall through to regex check or return as text
        }
    }

    // Try extracting JSON from markdown code block
    const match = text.match(jsonRegex);
    if (match && match[1]) {
      try {
        console.log('Attempting regex JSON parse...');
        const jsonString = match[1];
        const parsed = JSON.parse(jsonString);
        if (parsed.function === 'send_sol' && parsed.arguments) {
            console.log('Regex JSON parse successful:', parsed);
            // --- ADDED: Validate required arguments ---
            const args = parsed.arguments;
            if (!args.senderEmail || !args.password || !args.toAddress || args.amount == null) {
                console.warn('Function call parsed from regex, but missing required arguments:', args);
                // Let the user know what's missing based on the refined prompt
                return { reply: `Okay, I have the recipient and amount. Please provide your sender email and password to proceed.` };
            }
            // --- END ADDED ---
            return { function_call: { name: parsed.function, arguments: parsed.arguments } };
        } else {
            console.log('Parsed JSON from regex, but not a valid function call format.');
        }
      } catch (err) {
        console.error('Error parsing JSON from regex:', err);
        // It might have been JSON but malformed, return the original text maybe?
         return { reply: text }; // Return original text if parsing fails
      }
    }

    // If neither direct parse nor regex parse worked, return the text as a reply
    console.log('No valid function call JSON found, returning text reply.');
    return { reply: text };

  } catch (error) {
    console.error('Error calling Claude:', error);
    // Check for specific Anthropic error types if needed
    const errorMessage = error.message || 'Failed to process the request.';
    return { reply: `Error: ${errorMessage}` };
  }
}
// --- END OF FILE modelService.js ---