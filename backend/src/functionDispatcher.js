// --- START OF FILE functionDispatcher.js ---

import { sendSol } from '../apis/transactions/send.service.js';

export async function dispatchFunction(fnCall) {
  const { name, arguments: args } = fnCall;

  console.log('Dispatching function:', name);
  console.log('Function arguments:', args);

  // Map Claude's 'recipient' to your service's 'toAddress' if necessary
  if (args.recipient && !args.toAddress) {
      args.toAddress = args.recipient;
      delete args.recipient; // Clean up
      console.log('Mapped "recipient" to "toAddress". New args:', args);
  }


  switch (name) {
    case 'send_sol': {  // <--- CHANGE THIS
      try {
        // --- ADDED: Check for required args before calling ---
        if (!args.senderEmail || !args.password || !args.toAddress || args.amount == null) {
            console.error('Error: Missing required arguments for send_sol:', args);
            // You might want the LLM to ask for these, but for now, return an error
            return { reply: `❌ Missing required information (like email or password) to send SOL.` };
        }
        // --- END ADDED ---

        console.log('Calling sendSol function...');
        const result = await sendSol(args); // sendSol expects { senderEmail, password, toAddress, amount }
        console.log('Transaction result:', result);
        // Use the message from the service
        return { reply: result.message, data: result };
      } catch (err) {
        console.error('Error during transaction:', err);
        // Return the specific error message from the service
        return { reply: `❌ Transaction Error: ${err.message}` };
      }
    }
    default:
      console.log('Unknown function:', name);
      return { reply: `❌ Unknown function: ${name}` };
  }
}
// --- END OF FILE functionDispatcher.js ---