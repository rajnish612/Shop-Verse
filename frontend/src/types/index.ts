// ==================== ENUMS ====================

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  UPI = "UPI",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum RoleType {
  USER = "USER",
  ADMIN = "ADMIN",
}

// ==================== INTERFACES ====================

export interface Role {
  id: number;
  name: RoleType;
}

export interface Address {
  id: number;
  locality: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface User {
  id: number;
  email: string;
  roles: string[];
  name: string;
  avatar: string;
  active: boolean;
  googleLinked: boolean;
  addresses: Address[];
  joinedAt: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  level: number;
  children: Category[];
}

export interface ProductAttributeValue {
  id: number;
  value: string;
  productAttribute: {
    id: number;
    name: string;
  };
}
export interface UserDetails {
  id: number;
  email: string;
  roles: RoleType[];
  name: string;
  avatar?: string;
  address: Address[];
  active: boolean;
  googleLinked: boolean;
  joinedAt: Date;
}
export interface CategoryCounts {
  rootCount: number;
  nestedCount: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  values: Record<number, string>;
}
export interface CartAttribute {
  id: number;
  name: string;
  values: Record<number, string>;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrls: string[];
  price: number;
  discount: number;
  quantity: number;
  configurationKey: string;
  selectedAttributes: CartAttribute[];
}
export interface Review {
  id: number;
  rating: number;
  text: string;
  productId: number;
  userId: number;
  avatar: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  numRatings: number;
  stockQuantity: number;

  categoryId: number;
  categoryName: string;
  categoryCode: string;

  mrpPrice: number;
  discount: number;

  attributes: ProductAttribute[];

  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
}

export interface PaymentDetails {
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId: string;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;

  orderStatus: OrderStatus;
  orderDate: string;
  deliveryDate: string;

  shippingAddress: Address;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId: string | null;

  orderItems: OrderItem[];
  totalPrice: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  selectedAttributes: {
    id: number;
    name: string;
    value: string;
  }[];
}

export interface Coupon {
  id: number;
  code: string;
  discount: number;
  percentage: boolean;
  expiresAt: string | null;
  active: boolean;
}

// ==================== UI HELPER TYPES ====================

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}
