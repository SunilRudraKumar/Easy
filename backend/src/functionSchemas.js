// --- START OF FILE functionSchemas.js ---

export const functionSchemas = [
  {
    name: 'send_sol', // <--- CHANGE THIS
    description: 'Send SOL tokens from a user to a specified Solana address',
    parameters: {
      type: 'object',
      properties: {
        senderEmail: { type: 'string', description: "User's registered email" },
        password: { type: 'string', description: "User's account password" },
        toAddress: { type: 'string', description: 'Recipient Solana address' },
        amount: { type: 'number', description: 'Amount of SOL to send' },
      },
      required: ['senderEmail', 'password', 'toAddress', 'amount'],
    },
  },
  // Add more tools here if needed
];
// --- END OF FILE functionSchemas.js ---