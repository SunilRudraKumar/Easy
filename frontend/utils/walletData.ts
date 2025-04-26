export interface Token {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  value: number;
  change: number;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: number;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  isPayment?: boolean;
  paymentAmount?: number;
  paymentSymbol?: string;
}

export const dummyUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    lastMessage: 'Thanks for the ETH!',
    timestamp: Date.now() - 1800000,
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    lastMessage: 'When are you selling your BTC?',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Check out this new DeFi project',
    timestamp: Date.now() - 7200000,
    unreadCount: 1,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    lastMessage: 'Got your SOL transfer',
    timestamp: Date.now() - 86400000,
  },
];

export const dummyMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hey Sarah, sending you some ETH for the project',
    isUser: true,
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    text: 'Perfect timing! I was just about to ask',
    isUser: false,
    timestamp: Date.now() - 3500000,
  },
  {
    id: '3',
    text: 'Payment of 0.5 ETH sent to Sarah',
    isUser: false,
    timestamp: Date.now() - 3400000,
    isPayment: true,
    paymentAmount: 0.5,
    paymentSymbol: 'ETH',
  },
  {
    id: '4',
    text: 'Thanks! Got it 🎉',
    isUser: false,
    timestamp: Date.now() - 3300000,
  },
];

export const dummyBotMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Welcome to Easy! I\'m your AI assistant. How can I help you with your crypto today?',
    isUser: false,
    timestamp: Date.now() - 3600000,
  },
];

export const getTotalBalance = (tokens: Token[]): number => {
  return tokens.reduce((sum, token) => sum + token.value, 0);
};

export const dummyTokens: Token[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    balance: 0.5,
    value: 20000,
    change: 2.5
  },
  {
    id: '2',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    balance: 15.7,
    value: 1500,
    change: -1.2
  },
  {
    id: '3',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: 2.3,
    value: 4600,
    change: 0.8
  },
  {
    id: '4',
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: 1000,
    value: 1000,
    change: 0.01
  }
];