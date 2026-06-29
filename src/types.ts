export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

export interface Budget {
  id: string;
  category: Expense['category'];
  monthlyLimit: number;
}

export interface Expense {
  id: string;
  date: string;
  category: 'raw_materials' | 'packaging' | 'utilities' | 'salaries' | 'marketing' | 'logistics' | 'other';
  amount: number;
  description: string;
  reference?: string;
}

export type Role = 'ceo' | 'md' | 'production_manager' | 'quality_assurance' | 'sales_lead' | 'delivery_driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface FactoryDetails {
  name: string;
  registrationNumber: string;
  tin: string;
  address: string;
  district: string;
  phone: string;
  email: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  materialsProvided: string[];
  performanceScore: number; // 0-100 based on delivery speed & consistency
  averageDeliveryDays: number;
}

export interface Settings {
  currency: string;
  factoryDetails: FactoryDetails;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: 'oil' | 'lye' | 'fragrance' | 'colorant' | 'packaging' | 'other';
  quantity: number;
  unit: string;
  costPerUnit: number;
  lowStockThreshold: number;
  supplier?: string;
}

export interface RecipeIngredient {
  rawMaterialId: string;
  percentage?: number;
  amount: number; // in grams or preferred unit
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  expectedYield: number;
  notes: string;
}

export interface QualityLog {
  id: string;
  date: string;
  author: string;
  scentStrength: 'Weak' | 'Moderate' | 'Strong';
  texture: string;
  color: string;
  notes: string;
}

export interface WasteLog {
  id: string;
  batchId: string;
  date: string;
  quantity: number;
  reason: 'failed_saponification' | 'color_bleeding' | 'scent_loss' | 'contamination' | 'other';
  notes: string;
  financialImpact: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface Batch {
  id: string;
  recipeId: string;
  startDate: string;
  cureEndDate: string;
  status: 'curing' | 'ready' | 'depleted' | 'flagged';
  actualYield: number;
  soldCount: number;
  defectCount: number;
  notes?: string;
  qualityLogs?: QualityLog[];
}

export interface FinishedGood {
  id: string;
  sku: string;
  scent: string;
  size: string;
  priceRetail: number;
  priceWholesale: number;
  onHandCount: number;
}

export interface Client {
  id: string;
  name: string;
  type: 'retail' | 'wholesale';
  email: string;
  phone: string;
  district?: string;
  region?: string;
  notes: string;
  totalSpent: number;
}

export interface OrderItem {
  finishedGoodId: string;
  batchId?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientId: string;
  date: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'fulfilled';
  total: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string;
  status: 'scheduled' | 'out' | 'delivered' | 'failed';
  date: string;
  address: string;
  notes?: string;
}
