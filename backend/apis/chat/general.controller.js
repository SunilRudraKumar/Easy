import { redisClient } from '../redisClient.js';
import { functionSchemas } from '../functionSchemas.js';
import { callModel } from '../modelService.js';
import { dispatchFunction } from '../functionDispatcher.js';

/**
 * POST /mcp/chat
 * Body: { contextId: string, messages: Array<{role, content}> }
 */
export async function generalChatController(req, res) {
  console.log('Received request to /mcp/chat:', req.body);

  const { contextId, messages } = req.body;
  if (!contextId || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const key = `ctx:${contextId}`;
  
  // 1) Append new messages
  for (const m of messages) {
    await redisClient.rpush(key, JSON.stringify(m));
  }
  await redisClient.expire(key, 3600);

  // 2) Read full history
  const raw = await redisClient.lrange(key, 0, -1);
  const history = raw.map(j => JSON.parse(j));

  console.log('History loaded from Redis:', history);

  // 3) Call model (Claude's response)
  const modelRes = await callModel(history, functionSchemas);
  console.log('Response from Claude:', modelRes);

  // 4) If function_call, dispatch and wait for confirmation
  if (modelRes.function_call) {
    const { name, arguments: args } = modelRes.function_call;

    console.log(`Claude function call detected: ${name}`, args);

    // Here, check for confirmation (e.g., "yes" from the user)
    const userConfirmation = await getUserConfirmation(req.body.userId); // Replace with actual logic
    console.log('User confirmation:', userConfirmation);

    if (userConfirmation === 'yes') {
      console.log('Proceeding with the function execution');
      // Proceed with the function execution
      const disp = await dispatchFunction({ name, arguments: args });
      return res.json({ contextId, ...disp });
    } else {
      console.log('Transaction cancelled by the user');
      return res.json({
        contextId,
        reply: "Transaction cancelled by the user.",
      });
    }
  }

  // 5) Otherwise, return a plain reply
  console.log('Returning Claude reply:', modelRes.reply);
  return res.json({ contextId, reply: modelRes.reply });
}

// A dummy function to simulate user confirmation
// Replace this with actual logic (e.g., biometric, password check)
async function getUserConfirmation(userId) {
  console.log('Simulating user confirmation for:', userId);

  // For now, simulate a "yes" confirmation
  return 'yes'; // Replace with actual confirmation logic
}
