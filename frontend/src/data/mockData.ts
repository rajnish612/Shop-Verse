import type {
  Product,
  User,
  Category,
  Seller,
  Order,
  CartItem,
  Review,
  Coupon,
  Address,
  DashboardStat,
  ProductAttribute,
} from '../types';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  RoleType,
} from '../types';

// ==================== CATEGORIES ====================

export const categories: Category[] = [
  { id: 1, name: 'Electronics', code: 'electronics', level: 0 },
  { id: 2, name: 'Smartphones', code: 'smartphones', level: 1, parent: { id: 1, name: 'Electronics', code: 'electronics', level: 0 } },
  { id: 3, name: 'Laptops', code: 'laptops', level: 1, parent: { id: 1, name: 'Electronics', code: 'electronics', level: 0 } },
  { id: 4, name: 'Fashion', code: 'fashion', level: 0 },
  { id: 5, name: 'Men\'s Clothing', code: 'mens-clothing', level: 1, parent: { id: 4, name: 'Fashion', code: 'fashion', level: 0 } },
  { id: 6, name: 'Women\'s Clothing', code: 'womens-clothing', level: 1, parent: { id: 4, name: 'Fashion', code: 'fashion', level: 0 } },
  { id: 7, name: 'Home & Garden', code: 'home-garden', level: 0 },
  { id: 8, name: 'Furniture', code: 'furniture', level: 1, parent: { id: 7, name: 'Home & Garden', code: 'home-garden', level: 0 } },
  { id: 9, name: 'Decor', code: 'decor', level: 1, parent: { id: 7, name: 'Home & Garden', code: 'home-garden', level: 0 } },
  { id: 10, name: 'Sports', code: 'sports', level: 0 },
  { id: 11, name: 'Books', code: 'books', level: 0 },
  { id: 12, name: 'Beauty', code: 'beauty', level: 0 },
];

// ==================== SELLERS ====================

export const sellers: Seller[] = [
  { id: 1, name: 'TechHub Electronics', email: 'tech@hub.com', mobile: '+91 9876543210' },
  { id: 2, name: 'Fashion Forward', email: 'info@fashionforward.com', mobile: '+91 9876543211' },
  { id: 3, name: 'HomeStyle Living', email: 'hello@homestyle.com', mobile: '+91 9876543212' },
  { id: 4, name: 'BookWorm Store', email: 'books@worm.com', mobile: '+91 9876543213' },
  { id: 5, name: 'GlowUp Beauty', email: 'glow@beauty.com', mobile: '+91 9876543214' },
];

// ==================== REVIEWS ====================

const sampleReviews: Review[] = [
  { id: 1, rating: 5, text: 'Absolutely love this product! Great quality and fast delivery.', user: { id: 1, name: 'Amit Kumar', avatar: '' }, createdAt: '2026-09-15T10:30:00', updatedAt: '2026-09-15T10:30:00' },
  { id: 2, rating: 4, text: 'Very good product. Worth the price. Would recommend to others.', user: { id: 2, name: 'Priya Singh', avatar: '' }, createdAt: '2026-09-20T14:20:00', updatedAt: '2026-09-20T14:20:00' },
  { id: 3, rating: 3, text: 'Decent quality. Packaging could be better.', user: { id: 3, name: 'Rahul Sharma', avatar: '' }, createdAt: '2026-09-25T09:15:00', updatedAt: '2026-09-25T09:15:00' },
  { id: 4, rating: 5, text: 'Best purchase I\'ve made this year! Exceeded my expectations.', user: { id: 4, name: 'Sneha Patel', avatar: '' }, createdAt: '2026-10-01T16:45:00', updatedAt: '2026-10-01T16:45:00' },
  { id: 5, rating: 2, text: 'Not what I expected. The color is slightly different from the photo.', user: { id: 5, name: 'Vikram Reddy', avatar: '' }, createdAt: '2026-10-05T11:00:00', updatedAt: '2026-10-05T11:00:00' },
];

// ==================== PRODUCTS ====================

export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    description: 'The latest iPhone with A18 Pro chip, 48MP camera system, and titanium design. Features the most advanced display ever on iPhone with ProMotion technology and always-on display.',
    imageUrls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
    numRatings: 1284,
    stockQuantity: 50,
    category: categories[1],
    seller: sellers[0],
    reviews: [sampleReviews[0], sampleReviews[1], sampleReviews[3]],
    createdAt: '2026-08-01T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 144900,
    discount: 8,
    productAttributeValues: [
      { id: 1, value: '256GB', productAttribute: { id: 1, name: 'Storage' } },
      { id: 2, value: 'Desert Titanium', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Galaxy AI is here. The most powerful Galaxy S series yet with Snapdragon 8 Elite, 200MP camera, built-in S Pen and AI-powered productivity features.',
    imageUrls: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'],
    numRatings: 956,
    stockQuantity: 35,
    category: categories[1],
    seller: sellers[0],
    reviews: [sampleReviews[1], sampleReviews[2]],
    createdAt: '2026-08-15T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 129999,
    discount: 12,
    productAttributeValues: [
      { id: 3, value: '512GB', productAttribute: { id: 1, name: 'Storage' } },
      { id: 4, value: 'Titanium Black', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 3,
    name: 'MacBook Pro M4 14"',
    description: 'Supercharged by M4 Pro and M4 Max chips. The most advanced Mac laptops ever with up to 24-core GPU, Liquid Retina XDR display, and all-day battery life.',
    imageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
    numRatings: 743,
    stockQuantity: 20,
    category: categories[2],
    seller: sellers[0],
    reviews: [sampleReviews[0], sampleReviews[3]],
    createdAt: '2026-07-20T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 199900,
    discount: 5,
    productAttributeValues: [
      { id: 5, value: '16GB', productAttribute: { id: 3, name: 'RAM' } },
      { id: 6, value: 'Space Black', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 4,
    name: 'Premium Cotton Slim Fit Shirt',
    description: 'Handcrafted premium cotton formal shirt. Perfect for office wear and special occasions. Features a classic collar and comfortable slim fit design.',
    imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
    numRatings: 2341,
    stockQuantity: 150,
    category: categories[4],
    seller: sellers[1],
    reviews: [sampleReviews[1], sampleReviews[4]],
    createdAt: '2026-06-01T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 2499,
    discount: 40,
    productAttributeValues: [
      { id: 7, value: 'L', productAttribute: { id: 4, name: 'Size' } },
      { id: 8, value: 'White', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 5,
    name: 'Floral Maxi Dress',
    description: 'Elegant floral printed maxi dress in flowing chiffon. Features a flattering A-line silhouette, adjustable straps, and comfortable fit for all-day wear.',
    imageUrls: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    numRatings: 1876,
    stockQuantity: 80,
    category: categories[5],
    seller: sellers[1],
    reviews: [sampleReviews[0], sampleReviews[1], sampleReviews[2]],
    createdAt: '2026-07-10T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 3999,
    discount: 30,
    productAttributeValues: [
      { id: 9, value: 'M', productAttribute: { id: 4, name: 'Size' } },
      { id: 10, value: 'Floral Blue', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 6,
    name: 'Modern Minimalist Sofa',
    description: 'Contemporary 3-seater sofa with premium upholstery and solid wood frame. Minimalist Scandinavian design that transforms any living space.',
    imageUrls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
    numRatings: 432,
    stockQuantity: 10,
    category: categories[7],
    seller: sellers[2],
    reviews: [sampleReviews[3], sampleReviews[4]],
    createdAt: '2026-05-15T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 45999,
    discount: 15,
    productAttributeValues: [
      { id: 11, value: 'Grey', productAttribute: { id: 2, name: 'Color' } },
      { id: 12, value: '3-Seater', productAttribute: { id: 5, name: 'Type' } },
    ],
  },
  {
    id: 7,
    name: 'Handcrafted Ceramic Vase Set',
    description: 'Set of 3 artisan-crafted ceramic vases in earthy tones. Perfect for fresh flowers or as standalone decorative pieces. Each piece is uniquely handmade.',
    imageUrls: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600'],
    numRatings: 567,
    stockQuantity: 45,
    category: categories[8],
    seller: sellers[2],
    reviews: [sampleReviews[0], sampleReviews[1]],
    createdAt: '2026-08-20T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 2999,
    discount: 20,
    productAttributeValues: [
      { id: 13, value: 'Earth Tone', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 8,
    name: 'The Art of Programming',
    description: 'A comprehensive guide to modern programming paradigms. From algorithms to system design, this book covers everything you need to become a better developer.',
    imageUrls: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
    numRatings: 1123,
    stockQuantity: 200,
    category: categories[10],
    seller: sellers[3],
    reviews: [sampleReviews[0], sampleReviews[3]],
    createdAt: '2026-04-01T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 899,
    discount: 25,
    productAttributeValues: [
      { id: 14, value: 'Paperback', productAttribute: { id: 5, name: 'Type' } },
    ],
  },
  {
    id: 9,
    name: 'Luxury Skincare Gift Set',
    description: 'Premium skincare collection featuring cleanser, toner, serum, moisturizer, and eye cream. Made with natural ingredients for a radiant, youthful glow.',
    imageUrls: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
    numRatings: 2156,
    stockQuantity: 60,
    category: categories[11],
    seller: sellers[4],
    reviews: [sampleReviews[0], sampleReviews[1], sampleReviews[3]],
    createdAt: '2026-09-01T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 4999,
    discount: 35,
    productAttributeValues: [],
  },
  {
    id: 10,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with industry-leading ANC, 30-hour battery life, and Hi-Res Audio support. Features adaptive sound control and speak-to-chat.',
    imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    numRatings: 3456,
    stockQuantity: 75,
    category: categories[0],
    seller: sellers[0],
    reviews: [sampleReviews[0], sampleReviews[1], sampleReviews[2], sampleReviews[3]],
    createdAt: '2026-06-15T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 29990,
    discount: 18,
    productAttributeValues: [
      { id: 15, value: 'Black', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 11,
    name: 'Running Performance Shoes',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for long-distance runs with superior energy return technology.',
    imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    numRatings: 1890,
    stockQuantity: 100,
    category: categories[9],
    seller: sellers[1],
    reviews: [sampleReviews[1], sampleReviews[3]],
    createdAt: '2026-07-01T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 8999,
    discount: 22,
    productAttributeValues: [
      { id: 16, value: '10', productAttribute: { id: 4, name: 'Size' } },
      { id: 17, value: 'Red/Black', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
  {
    id: 12,
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS, and a stunning AMOLED display. Track your fitness, receive notifications, and stay connected.',
    imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    numRatings: 2890,
    stockQuantity: 40,
    category: categories[0],
    seller: sellers[0],
    reviews: [sampleReviews[0], sampleReviews[2], sampleReviews[4]],
    createdAt: '2026-08-10T00:00:00',
    updatedAt: '2026-10-01T00:00:00',
    mrpPrice: 34999,
    discount: 10,
    productAttributeValues: [
      { id: 18, value: 'Silver', productAttribute: { id: 2, name: 'Color' } },
    ],
  },
];

// ==================== CURRENT USER ====================

export const currentUser: User = {
  id: 1,
  name: 'Rajnish Kumar',
  email: 'rajnish@example.com',
  avatar: '',
  googleLinked: false,
  roles: [{ id: 1, name: RoleType.USER }],
  addresses: [
    { id: 1, locality: '123, MG Road, Sector 5', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110001' },
    { id: 2, locality: '456, Park Street', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400001' },
  ],
};

export const adminUser: User = {
  id: 100,
  name: 'Admin User',
  email: 'admin@ecommerce.com',
  avatar: '',
  googleLinked: false,
  roles: [{ id: 3, name: RoleType.ADMIN }],
  addresses: [],
};

export const sellerUser: User = {
  id: 200,
  name: 'TechHub Electronics',
  email: 'tech@hub.com',
  avatar: '',
  googleLinked: false,
  roles: [{ id: 2, name: RoleType.SELLER }],
  addresses: [],
};

// ==================== CART ====================

export const cartItems: CartItem[] = [
  { id: 1, product: products[0], quantity: 1 },
  { id: 2, product: products[3], quantity: 2 },
  { id: 3, product: products[9], quantity: 1 },
];

// ==================== ORDERS ====================

export const orders: Order[] = [
  {
    id: 1001,
    user: { id: 1, name: 'Rajnish Kumar', email: 'rajnish@example.com' },
    paymentDetails: { paymentMethod: PaymentMethod.UPI, paymentStatus: PaymentStatus.PAID, transactionId: 'TXN001ABC' },
    shippingAddress: currentUser.addresses[0],
    orderItems: [
      { id: 1, product: products[0], quantity: 1, unitPrice: 133308 },
      { id: 2, product: products[9], quantity: 1, unitPrice: 24592 },
    ],
    totalPrice: 157900,
    orderStatus: OrderStatus.DELIVERED,
    orderDate: '2026-09-15T10:30:00',
    deliveryDate: '2026-09-22T10:30:00',
  },
  {
    id: 1002,
    user: { id: 1, name: 'Rajnish Kumar', email: 'rajnish@example.com' },
    paymentDetails: { paymentMethod: PaymentMethod.COD, paymentStatus: PaymentStatus.PENDING, transactionId: 'TXN002DEF' },
    shippingAddress: currentUser.addresses[0],
    orderItems: [
      { id: 3, product: products[3], quantity: 2, unitPrice: 1499 },
    ],
    totalPrice: 2998,
    orderStatus: OrderStatus.SHIPPED,
    orderDate: '2026-10-05T14:00:00',
    deliveryDate: '2026-10-12T14:00:00',
  },
  {
    id: 1003,
    user: { id: 1, name: 'Rajnish Kumar', email: 'rajnish@example.com' },
    paymentDetails: { paymentMethod: PaymentMethod.UPI, paymentStatus: PaymentStatus.PAID, transactionId: 'TXN003GHI' },
    shippingAddress: currentUser.addresses[1],
    orderItems: [
      { id: 4, product: products[5], quantity: 1, unitPrice: 39099 },
      { id: 5, product: products[6], quantity: 2, unitPrice: 2399 },
    ],
    totalPrice: 43897,
    orderStatus: OrderStatus.PROCESSING,
    orderDate: '2026-10-08T09:00:00',
    deliveryDate: '2026-10-15T09:00:00',
  },
  {
    id: 1004,
    user: { id: 2, name: 'Priya Singh', email: 'priya@example.com' },
    paymentDetails: { paymentMethod: PaymentMethod.UPI, paymentStatus: PaymentStatus.PAID, transactionId: 'TXN004JKL' },
    shippingAddress: { id: 3, locality: '789, Lake View', city: 'Bangalore', state: 'Karnataka', country: 'India', zipCode: '560001' },
    orderItems: [
      { id: 6, product: products[4], quantity: 1, unitPrice: 2799 },
      { id: 7, product: products[8], quantity: 1, unitPrice: 3249 },
    ],
    totalPrice: 6048,
    orderStatus: OrderStatus.PENDING,
    orderDate: '2026-10-10T16:30:00',
    deliveryDate: '2026-10-17T16:30:00',
  },
  {
    id: 1005,
    user: { id: 3, name: 'Rahul Sharma', email: 'rahul@example.com' },
    paymentDetails: { paymentMethod: PaymentMethod.COD, paymentStatus: PaymentStatus.PENDING, transactionId: 'TXN005MNO' },
    shippingAddress: { id: 4, locality: '321, Civil Lines', city: 'Jaipur', state: 'Rajasthan', country: 'India', zipCode: '302001' },
    orderItems: [
      { id: 8, product: products[2], quantity: 1, unitPrice: 189905 },
    ],
    totalPrice: 189905,
    orderStatus: OrderStatus.CONFIRMED,
    orderDate: '2026-10-09T12:00:00',
    deliveryDate: '2026-10-16T12:00:00',
  },
];

// ==================== COUPONS ====================

export const coupons: Coupon[] = [
  { id: 1, code: 'WELCOME10', discount: 10, percentage: true, expiresAt: '2026-12-31T23:59:59', active: true },
  { id: 2, code: 'FLAT500', discount: 500, percentage: false, expiresAt: '2026-11-30T23:59:59', active: true },
  { id: 3, code: 'MEGA25', discount: 25, percentage: true, expiresAt: '2026-10-15T23:59:59', active: true },
  { id: 4, code: 'EXPIRED20', discount: 20, percentage: true, expiresAt: '2026-09-01T23:59:59', active: false },
  { id: 5, code: 'SUMMER30', discount: 30, percentage: true, expiresAt: null, active: true },
];

// ==================== PRODUCT ATTRIBUTES ====================

export const productAttributes: ProductAttribute[] = [
  { id: 1, name: 'Storage', values: [{ id: 1, value: '128GB', productAttribute: { id: 1, name: 'Storage' } }, { id: 2, value: '256GB', productAttribute: { id: 1, name: 'Storage' } }, { id: 3, value: '512GB', productAttribute: { id: 1, name: 'Storage' } }, { id: 4, value: '1TB', productAttribute: { id: 1, name: 'Storage' } }] },
  { id: 2, name: 'Color', values: [{ id: 5, value: 'Black', productAttribute: { id: 2, name: 'Color' } }, { id: 6, value: 'White', productAttribute: { id: 2, name: 'Color' } }, { id: 7, value: 'Blue', productAttribute: { id: 2, name: 'Color' } }, { id: 8, value: 'Red', productAttribute: { id: 2, name: 'Color' } }] },
  { id: 3, name: 'RAM', values: [{ id: 9, value: '8GB', productAttribute: { id: 3, name: 'RAM' } }, { id: 10, value: '16GB', productAttribute: { id: 3, name: 'RAM' } }, { id: 11, value: '32GB', productAttribute: { id: 3, name: 'RAM' } }] },
  { id: 4, name: 'Size', values: [{ id: 12, value: 'S', productAttribute: { id: 4, name: 'Size' } }, { id: 13, value: 'M', productAttribute: { id: 4, name: 'Size' } }, { id: 14, value: 'L', productAttribute: { id: 4, name: 'Size' } }, { id: 15, value: 'XL', productAttribute: { id: 4, name: 'Size' } }, { id: 16, value: 'XXL', productAttribute: { id: 4, name: 'Size' } }] },
  { id: 5, name: 'Type', values: [{ id: 17, value: 'Paperback', productAttribute: { id: 5, name: 'Type' } }, { id: 18, value: 'Hardcover', productAttribute: { id: 5, name: 'Type' } }] },
];

// ==================== ADMIN DASHBOARD STATS ====================

export const adminDashboardStats: DashboardStat[] = [
  { label: 'Total Revenue', value: '₹24,56,890', change: 12.5, changeLabel: 'vs last month' },
  { label: 'Total Orders', value: 1234, change: 8.2, changeLabel: 'vs last month' },
  { label: 'Total Users', value: 5678, change: 15.3, changeLabel: 'vs last month' },
  { label: 'Total Products', value: 892, change: -2.1, changeLabel: 'vs last month' },
];

export const sellerDashboardStats: DashboardStat[] = [
  { label: 'Total Sales', value: '₹8,45,230', change: 18.7, changeLabel: 'vs last month' },
  { label: 'Orders Received', value: 342, change: 5.4, changeLabel: 'vs last month' },
  { label: 'Products Listed', value: 56, change: 3.6, changeLabel: 'vs last month' },
  { label: 'Avg. Rating', value: '4.5', change: 0.2, changeLabel: 'vs last month' },
];

// ==================== HELPER FUNCTIONS ====================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountedPrice(mrpPrice: number, discount: number): number {
  return Math.round(mrpPrice * (1 - discount / 100));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
    [OrderStatus.CONFIRMED]: 'text-blue-600 bg-blue-50',
    [OrderStatus.PROCESSING]: 'text-indigo-600 bg-indigo-50',
    [OrderStatus.SHIPPED]: 'text-purple-600 bg-purple-50',
    [OrderStatus.OUT_FOR_DELIVERY]: 'text-orange-600 bg-orange-50',
    [OrderStatus.DELIVERED]: 'text-green-600 bg-green-50',
    [OrderStatus.CANCELLED]: 'text-red-600 bg-red-50',
  };
  return colors[status];
}
