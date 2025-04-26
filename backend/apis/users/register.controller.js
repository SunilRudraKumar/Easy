import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../src/index.js';

/**
 * POST /users/register
 * Generates a wallet from a 12-word mnemonic (BIP39), like Trust Wallet.
 * Returns: mnemonic, publicKey, secretKey (base58)
 */
export const registerUserController = async (req, res) => {
  try {
    // 1. Generate 12-word mnemonic
    const mnemonic = bip39.generateMnemonic(); // 128 bits entropy

    // 2. Convert to seed buffer
    const seed = await bip39.mnemonicToSeed(mnemonic); // async

    // 3. Derive key from standard path: m/44'/501'/0'/0' (Solana)
    const derivationPath = `m/44'/501'/0'/0'`; 
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;

    // 4. Generate Solana keypair
    const keypair = Keypair.fromSeed(derivedSeed);
    const publicKey = keypair.publicKey.toBase58();
    const secretKey = bs58.encode(keypair.secretKey); // frontend stores this securely

    // 5. Store user in DB
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        publicKey,
      },
    });

    res.status(201).json({
      message: 'Wallet created successfully',
      userId: user.id,
      mnemonic,
      publicKey,
      secretKey,
    });
  } catch (error) {
    console.error('Error generating wallet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
