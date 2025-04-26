import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bcrypt from 'bcryptjs';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { prisma } from '../../src/index.js';

export async function sendSol({ senderEmail, password, toAddress, amount }) {
  console.log('Starting SOL transfer...');
  console.log('Sender Email:', senderEmail);
  console.log('Amount:', amount);
  console.log('Recipient Address:', toAddress);

  const user = await prisma.user.findUnique({ where: { email: senderEmail } });
  if (!user) throw new Error('User not found');
  if (!await bcrypt.compare(password, user.hashedPassword)) {
    throw new Error('Invalid credentials');
  }

  console.log('User authenticated successfully');
  
  const seed = await bip39.mnemonicToSeed(user.mnemonic);
  const derived = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
  const kp = Keypair.fromSeed(derived);

  const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: kp.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    })
  );

  console.log('Transaction created. Sending...');
  const sig = await conn.sendTransaction(tx, [kp]);
  await conn.confirmTransaction(sig, 'confirmed');

  console.log('Transaction confirmed:', sig);
  return {
    message: `✅ Sent ${amount} SOL to ${toAddress}`,
    txHash: sig,
    explorer: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  };
}
