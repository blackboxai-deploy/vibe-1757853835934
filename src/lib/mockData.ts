import { Product, User, Order, CustomOrder, ChatMessage, PromoCode, AdminStats, License, Transaction } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    username: 'john_dev',
    balance: 150.00,
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/357191d7-d45b-41d8-8eaa-9564c4d8a515.png'
  },
  {
    id: 'admin-1',
    email: 'admin@privateinstance.com',
    username: 'admin',
    balance: 0,
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d909f06f-2a52-4108-8cd3-55a2af899b32.png'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Premium VPN License',
    description: 'Lifetime premium VPN access with unlimited bandwidth and global server network. Includes all premium features and priority support.',
    price: 49.99,
    type: 'license',
    category: 'VPN & Security',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6f7375dc-9272-4e91-805a-8eb6a87b43bf.png',
    inStock: true,
    stockCount: 100,
    downloadUrl: 'https://example.com/download/vpn-client',
    features: [
      'Unlimited bandwidth',
      'Global server network',
      'Kill switch protection',
      'Split tunneling',
      '24/7 support'
    ],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'product-2',
    name: 'Custom Discord Bot',
    description: 'Fully customized Discord bot tailored to your server needs. Includes moderation, entertainment, and utility features.',
    price: 89.99,
    type: 'custom',
    category: 'Discord Bots',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a1faa98c-b839-48e5-949c-b4706c37fdf4.png',
    inStock: true,
    features: [
      'Custom commands',
      'Moderation system',
      'Music player',
      'Server analytics',
      'Full source code'
    ],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: 'product-3',
    name: 'Game Cheat Suite',
    description: 'Advanced game enhancement tools with undetected features. Regular updates and lifetime support included.',
    price: 29.99,
    type: 'license',
    category: 'Gaming',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/11d0ee81-2ca8-4a1f-91e2-13a15cfad515.png',
    inStock: true,
    stockCount: 50,
    downloadUrl: 'https://example.com/download/game-cheat',
    features: [
      'Undetected cheats',
      'Multiple game support',
      'Regular updates',
      'User-friendly interface',
      'Lifetime support'
    ],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: 'product-4',
    name: 'Custom Web Scraper',
    description: 'Professional web scraping solution built specifically for your data needs. Includes proxy rotation and anti-detection.',
    price: 199.99,
    type: 'custom',
    category: 'Automation',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4fbca747-b8f3-4b91-9a4a-056a471a774b.png',
    inStock: true,
    features: [
      'Custom target sites',
      'Proxy rotation',
      'Anti-detection measures',
      'Data export formats',
      'Scheduling system'
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  },
  {
    id: 'product-5',
    name: 'Password Manager Pro',
    description: 'Secure password management solution with military-grade encryption and cross-platform sync.',
    price: 19.99,
    type: 'license',
    category: 'Security',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/765b1b7b-0598-45eb-bcdd-e12e31d8bd3d.png',
    inStock: true,
    stockCount: 200,
    downloadUrl: 'https://example.com/download/password-manager',
    features: [
      'Military-grade encryption',
      'Cross-platform sync',
      'Auto-fill functionality',
      'Secure notes',
      'Two-factor authentication'
    ],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'product-6',
    name: 'Custom Trading Bot',
    description: 'Sophisticated cryptocurrency trading bot with advanced algorithms and risk management.',
    price: 299.99,
    type: 'custom',
    category: 'Trading',
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc0b2ba3-8dab-4aa0-88c5-c6296fa6863a.png',
    inStock: true,
    features: [
      'Advanced algorithms',
      'Risk management',
      'Multiple exchanges',
      'Backtesting tools',
      'Real-time monitoring'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z'
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [{
      product: mockProducts[0],
      quantity: 1
    }],
    totalAmount: 44.99,
    discount: 5.00,
    promoCode: 'WELCOME10',
    status: 'completed',
    paymentMethod: 'balance',
    createdAt: '2024-01-20T14:30:00Z',
    completedAt: '2024-01-20T14:31:00Z',
    deliveryInfo: {
      licenseKey: 'VPN-PREM-XYZ123-ABC789',
      downloadUrl: 'https://example.com/download/vpn-client',
      expiresAt: '2025-01-20T14:31:00Z'
    }
  },
  {
    id: 'order-2',
    userId: 'user-1',
    items: [{
      product: mockProducts[1],
      quantity: 1,
      customSpecs: 'Need a music bot with playlist management and 24/7 uptime'
    }],
    totalAmount: 89.99,
    discount: 0,
    status: 'processing',
    paymentMethod: 'balance',
    createdAt: '2024-01-22T09:15:00Z'
  }
];

// Mock Custom Orders
export const mockCustomOrders: CustomOrder[] = [
  {
    id: 'custom-1',
    orderId: 'order-2',
    userId: 'user-1',
    productId: 'product-2',
    status: 'chat',
    specifications: 'Need a music bot with playlist management and 24/7 uptime',
    additionalPaymentRequests: [],
    chatMessages: [
      {
        id: 'msg-1',
        customOrderId: 'custom-1',
        senderId: 'user-1',
        senderRole: 'user',
        message: 'Hi! I need a Discord bot for my gaming server. The main features I need are music playback with playlist support and 24/7 uptime.',
        timestamp: '2024-01-22T09:20:00Z',
        type: 'message'
      },
      {
        id: 'msg-2',
        customOrderId: 'custom-1',
        senderId: 'admin-1',
        senderRole: 'admin',
        message: 'Hello! Thanks for your order. I can definitely help you with that. For the music functionality, would you prefer YouTube integration or multiple sources (YouTube, Spotify, SoundCloud)?',
        timestamp: '2024-01-22T10:30:00Z',
        type: 'message'
      }
    ],
    createdAt: '2024-01-22T09:15:00Z'
  }
];

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = mockCustomOrders[0].chatMessages;

// Mock Promo Codes
export const mockPromoCodes: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    maxUses: 100,
    usedCount: 25,
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'promo-2',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    maxUses: 20,
    usedCount: 8,
    expiresAt: '2024-06-30T23:59:59Z',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Licenses
export const mockLicenses: License[] = [
  {
    id: 'license-1',
    orderId: 'order-1',
    userId: 'user-1',
    productId: 'product-1',
    licenseKey: 'VPN-PREM-XYZ123-ABC789',
    downloadUrl: 'https://example.com/download/vpn-client',
    expiresAt: '2025-01-20T14:31:00Z',
    isActive: true,
    activatedAt: '2024-01-20T14:32:00Z',
    maxActivations: 3,
    currentActivations: 1,
    createdAt: '2024-01-20T14:31:00Z'
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: 'topup',
    amount: 100.00,
    description: 'Balance topup via cryptocurrency',
    paymentMethod: 'BTC',
    status: 'completed',
    createdAt: '2024-01-18T08:00:00Z'
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    type: 'purchase',
    amount: -44.99,
    description: 'Premium VPN License',
    orderId: 'order-1',
    status: 'completed',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'tx-3',
    userId: 'user-1',
    type: 'purchase',
    amount: -89.99,
    description: 'Custom Discord Bot',
    orderId: 'order-2',
    status: 'completed',
    createdAt: '2024-01-22T09:15:00Z'
  }
];

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
  totalRevenue: 2459.95,
  totalOrders: 47,
  totalUsers: 156,
  totalProducts: 6,
  recentOrders: mockOrders,
  topProducts: [
    {
      product: mockProducts[0],
      salesCount: 23,
      revenue: 1149.77
    },
    {
      product: mockProducts[2],
      salesCount: 18,
      revenue: 539.82
    },
    {
      product: mockProducts[4],
      salesCount: 15,
      revenue: 299.85
    }
  ],
  revenueChart: [
    { date: '2024-01-15', revenue: 299.95, orders: 6 },
    { date: '2024-01-16', revenue: 159.94, orders: 3 },
    { date: '2024-01-17', revenue: 419.91, orders: 8 },
    { date: '2024-01-18', revenue: 229.93, orders: 4 },
    { date: '2024-01-19', revenue: 599.88, orders: 12 },
    { date: '2024-01-20', revenue: 389.90, orders: 7 },
    { date: '2024-01-21', revenue: 359.44, orders: 7 }
  ],
  userGrowth: [
    { date: '2024-01-15', users: 142 },
    { date: '2024-01-16', users: 145 },
    { date: '2024-01-17', users: 148 },
    { date: '2024-01-18', users: 151 },
    { date: '2024-01-19', users: 153 },
    { date: '2024-01-20', users: 154 },
    { date: '2024-01-21', users: 156 }
  ]
};

// Helper functions
export const getCurrentUser = (): User => mockUsers[0];
export const getProductById = (id: string): Product | undefined => 
  mockProducts.find(p => p.id === id);
export const getOrdersByUserId = (userId: string): Order[] => 
  mockOrders.filter(o => o.userId === userId);
export const getLicensesByUserId = (userId: string): License[] => 
  mockLicenses.filter(l => l.userId === userId);
export const getTransactionsByUserId = (userId: string): Transaction[] => 
  mockTransactions.filter(t => t.userId === userId);
export const getCustomOrdersByUserId = (userId: string): CustomOrder[] => 
  mockCustomOrders.filter(co => co.userId === userId);

export const validatePromoCode = (code: string): PromoCode | null => {
  const promo = mockPromoCodes.find(p => 
    p.code === code && 
    p.isActive && 
    p.usedCount < p.maxUses && 
    new Date(p.expiresAt) > new Date()
  );
  return promo || null;
};

export const calculateDiscount = (total: number, promoCode?: PromoCode): number => {
  if (!promoCode) return 0;
  
  if (promoCode.type === 'percentage') {
    return total * (promoCode.value / 100);
  } else {
    return Math.min(promoCode.value, total);
  }
};