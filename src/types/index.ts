// Core type definitions for PrivateInstance

export interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  role: 'user' | 'admin';
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'license' | 'custom';
  category: string;
  image: string;
  inStock: boolean;
  stockCount?: number;
  downloadUrl?: string; // For license products
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customSpecs?: string; // For custom software
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  promoCode?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'balance';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  deliveryInfo?: {
    licenseKey?: string;
    downloadUrl?: string;
    expiresAt?: string;
  };
}

export interface CustomOrder {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  status: 'chat' | 'specs_approved' | 'in_development' | 'completed';
  specifications: string;
  additionalPaymentRequests: PaymentRequest[];
  completionInfo?: string; // Markdown content for final delivery
  chatMessages: ChatMessage[];
  createdAt: string;
  completedAt?: string;
}

export interface PaymentRequest {
  id: string;
  customOrderId: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export interface ChatMessage {
  id: string;
  customOrderId: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  message: string;
  timestamp: string;
  type: 'message' | 'payment_request' | 'system';
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'topup' | 'purchase' | 'refund';
  amount: number;
  description: string;
  orderId?: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    salesCount: number;
    revenue: number;
  }>;
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
}

export interface License {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  licenseKey: string;
  downloadUrl: string;
  expiresAt?: string;
  isActive: boolean;
  activatedAt?: string;
  maxActivations?: number;
  currentActivations: number;
  createdAt: string;
}

export interface OxapayWebhook {
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  created_at: string;
}

// Form interfaces
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutForm {
  promoCode?: string;
  acceptTerms: boolean;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  type: 'license' | 'custom';
  category: string;
  image: string;
  stockCount?: number;
  downloadUrl?: string;
  features: string[];
}

export interface TopupForm {
  amount: number;
  currency: 'USD' | 'EUR' | 'BTC' | 'ETH';
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, customSpecs?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}