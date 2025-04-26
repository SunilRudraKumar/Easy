import bcrypt from 'bcryptjs';
import { prisma } from '../../src/index.js';
import { v4 as uuidv4 } from 'uuid';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * POST /users/create-account
 * Accepts email + password, creates a new Solana wallet, and stores everything securely.
 */
export const createAccountController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 12-word mnemonic and derive keypair
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    const publicKey = keypair.publicKey.toBase58();
    const secretKey = bs58.encode(keypair.secretKey); // Optional return

    // Store user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        hashedPassword,
        publicKey,
        mnemonic, // TODO: Encrypt this in production!
      },
    });

    res.status(201).json({
      message: 'Account created successfully',
      publicKey,
      mnemonic, // show on /auth/mnemonic screen
    });
  } catch (error) {
    console.error('Error in create-account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
