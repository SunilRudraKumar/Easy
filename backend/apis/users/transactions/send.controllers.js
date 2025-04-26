import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { prisma } from '../../src/index.js';
import bcrypt from 'bcryptjs';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

/**
 * POST /transactions/send
 * Sends SOL from user to another wallet on Solana devnet.
 */
export const sendSolController = async (req, res) => {
  try {
    const { senderEmail, password, toAddress, amount } = req.body;

    if (!senderEmail || !password || !toAddress || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Get user and validate password
    const user = await prisma.user.findUnique({ where: { email: senderEmail } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // Derive keypair from mnemonic
    const seed = await bip39.mnemonicToSeed(user.mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
    const senderKeypair = Keypair.fromSeed(derivedSeed);

    // Connect to devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Convert amount to lamports
    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

    // Build transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports,
      })
    );

    // Send and confirm
    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    await connection.confirmTransaction(signature, 'confirmed');

    return res.status(200).json({
      message: `✅ Successfully sent ${amount} SOL to ${toAddress}`,
      txHash: signature,
      explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    });
  } catch (error) {
    console.error('Send transaction failed:', error);
    return res.status(500).json({ error: '🚨 Transaction failed. Please try again.' });
  }
};
