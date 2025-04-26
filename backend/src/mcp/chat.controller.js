// --- START OF FILE chat.controller.js ---

import { redisClient } from '../redisClient.js';
import { functionSchemas } from '../functionSchemas.js';
import { callModel } from '../modelService.js';
import { dispatchFunction } from '../functionDispatcher.js';

const PENDING_ACTION_KEY_PREFIX = 'pending_action:';
const PENDING_ACTION_TTL = 300; // 5 minutes to confirm

/**
 * POST /mcp/chat
 * Body: { contextId: string, messages: Array<{role, content}>, userId?: string }
 */
export async function generalChatController(req, res) {
  console.log('Received request to /mcp/chat:', req.body);

  const { contextId, messages, userId } = req.body; // Assuming userId might come from auth middleware later
  if (!contextId || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid payload: contextId and messages required.' });
  }

  const userMessage = messages[messages.length - 1];
  if (userMessage.role !== 'user') {
      return res.status(400).json({ error: 'Invalid payload: Last message must be from user.' });
  }

  const historyKey = `ctx:${contextId}`;
  const pendingActionKey = `${PENDING_ACTION_KEY_PREFIX}${contextId}`;

  // --- Check if this is a confirmation message ---
  const userContentLower = userMessage.content.toLowerCase().trim();
  if (['yes', 'y', 'confirm', 'proceed', 'ok', 'okay'].includes(userContentLower)) {
      const pendingActionJson = await redisClient.get(pendingActionKey);
      if (pendingActionJson) {
          console.log('User confirmation detected for pending action.');
          await redisClient.del(pendingActionKey); // Consume the pending action

          const pendingAction = JSON.parse(pendingActionJson);

          // --- IMPORTANT: Real confirmation needed here ---
          // Replace dummy check with actual password/biometric verification using userId
          const isUserConfirmed = await performRealUserConfirmation(userId, pendingAction.arguments.password);
          // ---

          if (isUserConfirmed) {
              console.log('User confirmed. Proceeding with function execution:', pendingAction);

              // Append the confirmation action to history *before* dispatching for context
              await redisClient.rpush(historyKey, JSON.stringify(userMessage)); // User's 'yes'
              // Maybe add an assistant message indicating execution?
              const executingMsg = { role: 'assistant', content: `Okay, executing the action: ${pendingAction.name}` };
              await redisClient.rpush(historyKey, JSON.stringify(executingMsg));
              await redisClient.expire(historyKey, 3600); // Reset expiry

              const dispResult = await dispatchFunction(pendingAction);

              // Append function result to history
              const resultMsg = { role: 'assistant', content: dispResult.reply }; // Use 'assistant' role for function results
              await redisClient.rpush(historyKey, JSON.stringify(resultMsg));
              await redisClient.expire(historyKey, 3600); // Reset expiry

              return res.json({ contextId, ...dispResult }); // Return result directly
          } else {
              console.log('User confirmation failed or cancelled.');
               // Append cancellation to history
              await redisClient.rpush(historyKey, JSON.stringify(userMessage)); // User's 'yes' (which failed confirmation)
              const cancelMsg = { role: 'assistant', content: 'Action cancelled due to failed confirmation.' };
              await redisClient.rpush(historyKey, JSON.stringify(cancelMsg));
              await redisClient.expire(historyKey, 3600); // Reset expiry

              return res.json({ contextId, reply: "Action cancelled: Confirmation failed." });
          }
      }
      // If user said 'yes' but there was no pending action, treat as normal message below
      console.log("User said 'yes' but no pending action found.");
  }

   // If user said 'no' or similar, clear pending action
   if (['no', 'n', 'cancel', 'stop'].includes(userContentLower)) {
       const deletedCount = await redisClient.del(pendingActionKey);
       if (deletedCount > 0) {
           console.log('User cancelled pending action.');
            // Append cancellation to history
           await redisClient.rpush(historyKey, JSON.stringify(userMessage)); // User's 'no'
           const cancelMsg = { role: 'assistant', content: 'Okay, I have cancelled the pending action.' };
           await redisClient.rpush(historyKey, JSON.stringify(cancelMsg));
           await redisClient.expire(historyKey, 3600); // Reset expiry
           return res.json({ contextId, reply: "Okay, I've cancelled the action." });
       }
        // If user said 'no' but there was no pending action, treat as normal message below
   }


  // --- Normal message processing ---

  // 1) Append new user message(s) to history
  for (const m of messages) { // Assuming messages only contains the latest user turn
    await redisClient.rpush(historyKey, JSON.stringify(m));
  }
  await redisClient.expire(historyKey, 3600); // Reset expiry

  // 2) Read full history
  const rawHistory = await redisClient.lrange(historyKey, 0, -1);
  const history = rawHistory.map(j => JSON.parse(j));
  console.log('History loaded from Redis:', history);

  // 3) Call model
  const modelRes = await callModel(history, functionSchemas); // Pass schemas (though not used by Anthropic API directly here)
  console.log('Response from Claude:', modelRes);

  let responsePayload;

  // 4) If function_call detected by modelService
  if (modelRes.function_call) {
    const { name, arguments: args } = modelRes.function_call;
    console.log(`Claude proposes function call: ${name}`, args);

    // Store the proposed action and ask for confirmation
    const proposedAction = { name, arguments: args };
    await redisClient.setex(pendingActionKey, PENDING_ACTION_TTL, JSON.stringify(proposedAction));
    console.log(`Stored pending action for ${contextId}, expires in ${PENDING_ACTION_TTL}s.`);

    // Construct confirmation message
    // TODO: Make this more dynamic based on function name/args if more functions are added
    const confirmationQuestion = `Okay, I have the details to send ${args.amount} SOL to ${args.toAddress} using the email ${args.senderEmail}. Shall I proceed? (Reply yes/no)`;

    responsePayload = {
        contextId,
        reply: confirmationQuestion, // Ask for confirmation
        needsConfirmation: true,
        // You could optionally include proposedAction here if the frontend needs it
    };

    // Append AI's proposal/question to history
    const assistantMsg = { role: 'assistant', content: confirmationQuestion };
    await redisClient.rpush(historyKey, JSON.stringify(assistantMsg));

  } else {
    // 5) Otherwise, it's a plain reply from the model
    console.log('Returning Claude text reply:', modelRes.reply);
    responsePayload = { contextId, reply: modelRes.reply };

    // Append AI's text reply to history
    const assistantMsg = { role: 'assistant', content: modelRes.reply };
    await redisClient.rpush(historyKey, JSON.stringify(assistantMsg));
  }

  // Ensure history expiry is reset after potential appends
  await redisClient.expire(historyKey, 3600);

  return res.json(responsePayload);
}

// --- IMPORTANT: Replace this with real security logic ---
// This dummy function is INSECURE. In reality, you'd verify the password
// against the hash stored for the userId, or use biometrics/2FA.
// You MUST pass the actual userId to this function.
async function performRealUserConfirmation(userId, providedPassword) {
    console.log(`Performing dummy confirmation check for userId: ${userId}`);
    if (!userId || !providedPassword) {
        console.error("Confirmation check requires userId and password.");
        return false; // Cannot confirm without necessary info
    }
    // Fetch user from DB based on userId (you'll need userId passed in req.body or from session/token)
    // const user = await prisma.user.findUnique({ where: { id: userId } }); // Assuming you have user ID
    // if (!user) return false;
    // const match = await bcrypt.compare(providedPassword, user.hashedPassword);
    // return match;

    // For now, just return true for testing, but **REPLACE THIS**
    console.warn("Using dummy confirmation check - REPLACE WITH SECURE LOGIC!");
    return true;
}
// --- END OF FILE chat.controller.js ---