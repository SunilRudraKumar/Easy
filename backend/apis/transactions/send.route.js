import express from 'express';
import { sendSol } from './send.service.js';

const router = express.Router();

/**
 * POST /transactions/send
 * Body: { senderEmail, password, toAddress, amount }
 */
router.post('/', async (req, res) => {
  try {
    const { senderEmail, password, toAddress, amount } = req.body;

    // Call your service function
    const result = await sendSol({ senderEmail, password, toAddress, amount });

    // Return its structured response
    return res.status(200).json({
      message: result.message,
      txHash: result.txHash,
      explorer: result.explorer,
    });
  } catch (err) {
    console.error('Error in /transactions/send:', err);
    // If your service throws an Error with message, return that
    return res.status(400).json({ error: err.message || 'Transaction failed' });
  }
});

export default router;
