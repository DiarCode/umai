/**
 * Database Seed Script
 *
 * This script populates the database with comprehensive mock data for testing.
 * It creates a realistic restaurant scenario with:
 * - Platform administrators
 * - Restaurant with operating hours, employees, and tables
 * - Menu categories and products with dietary information
 * - Customer sessions and orders
 * - Payment records
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

// Initialize Prisma with adapter
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
};

const prisma = getPrismaClient();

// ============================================================================
// CONFIGURATION
// ============================================================================

const SALT_ROUNDS = 10;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateQrCode(): string {
  return `QR-${generateToken(16)}`;
}

function generateGuestToken(): string {
  return `GT-${generateToken(24)}`;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDate(daysFromNow: number, hours: number, minutes: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function createTime(hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ============================================================================
// SEED DATA DEFINITIONS
// ============================================================================

const CUISINE_DATA = {
  name: 'Sakura Sushi',
  slug: 'sakura-sushi',
  description: 'Authentic Japanese cuisine featuring fresh sushi, sashimi, and traditional dishes prepared with the finest ingredients.',
  categories: [
    { name: 'Sushi Rolls', slug: 'sushi-rolls', sortOrder: 1 },
    { name: 'Sashimi', slug: 'sashimi', sortOrder: 2 },
    { name: 'Appetizers', slug: 'appetizers', sortOrder: 3 },
    { name: 'Main Dishes', slug: 'main-dishes', sortOrder: 4 },
    { name: 'Desserts', slug: 'desserts', sortOrder: 5 },
    { name: 'Beverages', slug: 'beverages', sortOrder: 6 },
  ],
  products: [
    // Sushi Rolls
    { name: 'Dragon Roll', slug: 'dragon-roll', category: 'sushi-rolls', price: 16.99, description: 'Shrimp tempura, avocado, and eel topped with thinly sliced avocado and eel sauce', dietaryTags: ['seafood'], allergens: ['shellfish', 'fish', 'gluten'], nutrition: { calories: 380, protein: 18, carbs: 52, fat: 12 } },
    { name: 'Rainbow Roll', slug: 'rainbow-roll', category: 'sushi-rolls', price: 18.99, description: 'California roll topped with assorted fresh fish: tuna, salmon, yellowtail, and shrimp', dietaryTags: ['seafood'], allergens: ['shellfish', 'fish', 'gluten'], nutrition: { calories: 420, protein: 22, carbs: 48, fat: 14 } },
    { name: 'Spicy Tuna Roll', slug: 'spicy-tuna-roll', category: 'sushi-rolls', price: 12.99, description: 'Fresh tuna mixed with spicy mayo, cucumber, and sesame seeds', dietaryTags: ['seafood', 'spicy'], allergens: ['fish', 'sesame', 'gluten'], nutrition: { calories: 290, protein: 16, carbs: 38, fat: 8 } },
    { name: 'Philadelphia Roll', slug: 'philadelphia-roll', category: 'sushi-rolls', price: 14.99, description: 'Salmon, cream cheese, and cucumber rolled in seaweed and rice', dietaryTags: ['seafood'], allergens: ['fish', 'dairy', 'gluten'], nutrition: { calories: 340, protein: 14, carbs: 44, fat: 12 } },
    { name: 'Vegetable Roll', slug: 'vegetable-roll', category: 'sushi-rolls', price: 9.99, description: 'Fresh cucumber, avocado, carrot, and pickled radish', dietaryTags: ['vegetarian', 'vegan'], allergens: [], nutrition: { calories: 180, protein: 4, carbs: 36, fat: 4 } },
    { name: 'California Roll', slug: 'california-roll', category: 'sushi-rolls', price: 11.99, description: 'Imitation crab, avocado, and cucumber', dietaryTags: ['seafood'], allergens: ['fish', 'gluten'], nutrition: { calories: 260, protein: 8, carbs: 42, fat: 6 } },

    // Sashimi
    { name: 'Salmon Sashimi', slug: 'salmon-sashimi', category: 'sashimi', price: 15.99, description: '8 pieces of premium Atlantic salmon', dietaryTags: ['seafood', 'gluten-free'], allergens: ['fish'], nutrition: { calories: 180, protein: 28, carbs: 0, fat: 8 } },
    { name: 'Tuna Sashimi', slug: 'tuna-sashimi', category: 'sashimi', price: 17.99, description: '8 pieces of fresh yellowfin tuna', dietaryTags: ['seafood', 'gluten-free'], allergens: ['fish'], nutrition: { calories: 160, protein: 32, carbs: 0, fat: 2 } },
    { name: 'Mixed Sashimi', slug: 'mixed-sashimi', category: 'sashimi', price: 24.99, description: "Chef's selection of 12 pieces: salmon, tuna, yellowtail, and white fish", dietaryTags: ['seafood', 'gluten-free'], allergens: ['fish'], nutrition: { calories: 280, protein: 48, carbs: 0, fat: 8 } },

    // Appetizers
    { name: 'Edamame', slug: 'edamame', category: 'appetizers', price: 6.99, description: 'Steamed soybeans with sea salt', dietaryTags: ['vegetarian', 'vegan', 'gluten-free'], allergens: ['soy'], nutrition: { calories: 120, protein: 11, carbs: 10, fat: 5 } },
    { name: 'Miso Soup', slug: 'miso-soup', category: 'appetizers', price: 4.99, description: 'Traditional Japanese soup with tofu, seaweed, and green onions', dietaryTags: ['vegetarian', 'gluten-free'], allergens: ['soy', 'fish'], nutrition: { calories: 60, protein: 4, carbs: 6, fat: 2 } },
    { name: 'Gyoza', slug: 'gyoza', category: 'appetizers', price: 8.99, description: 'Pan-fried pork dumplings (6 pieces)', dietaryTags: [], allergens: ['gluten', 'soy'], nutrition: { calories: 220, protein: 10, carbs: 24, fat: 10 } },
    { name: 'Age Dashi Tofu', slug: 'age-dashi-tofu', category: 'appetizers', price: 7.99, description: 'Crispy fried tofu in savory dashi broth', dietaryTags: ['vegetarian', 'vegan'], allergens: ['soy', 'gluten'], nutrition: { calories: 180, protein: 8, carbs: 14, fat: 10 } },
    { name: 'Tempura', slug: 'tempura', category: 'appetizers', price: 11.99, description: 'Light batter-fried shrimp and vegetables', dietaryTags: ['seafood'], allergens: ['shellfish', 'gluten'], nutrition: { calories: 320, protein: 12, carbs: 28, fat: 18 } },

    // Main Dishes
    { name: 'Chicken Teriyaki', slug: 'chicken-teriyaki', category: 'main-dishes', price: 18.99, description: 'Grilled chicken breast glazed with house-made teriyaki sauce, served with rice and vegetables', dietaryTags: ['gluten-free'], allergens: ['soy'], nutrition: { calories: 480, protein: 38, carbs: 42, fat: 14 } },
    { name: 'Beef Yakiniku', slug: 'beef-yakiniku', category: 'main-dishes', price: 24.99, description: 'Grilled sliced beef with savory yakiniku sauce, served with rice', dietaryTags: [], allergens: ['soy', 'gluten'], nutrition: { calories: 520, protein: 32, carbs: 38, fat: 22 } },
    { name: 'Salmon Teriyaki', slug: 'salmon-teriyaki', category: 'main-dishes', price: 22.99, description: 'Grilled salmon with teriyaki glaze, served with rice and seasonal vegetables', dietaryTags: ['seafood', 'gluten-free'], allergens: ['fish', 'soy'], nutrition: { calories: 440, protein: 34, carbs: 36, fat: 18 } },
    { name: 'Vegetable Udon', slug: 'vegetable-udon', category: 'main-dishes', price: 14.99, description: 'Thick wheat noodles stir-fried with seasonal vegetables', dietaryTags: ['vegetarian', 'vegan'], allergens: ['gluten', 'soy'], nutrition: { calories: 380, protein: 10, carbs: 68, fat: 8 } },

    // Desserts
    { name: 'Mochi Ice Cream', slug: 'mochi-ice-cream', category: 'desserts', price: 7.99, description: 'Assorted flavors: green tea, mango, and strawberry (3 pieces)', dietaryTags: ['vegetarian'], allergens: ['dairy', 'soy'], nutrition: { calories: 180, protein: 3, carbs: 32, fat: 5 } },
    { name: 'Green Tea Ice Cream', slug: 'green-tea-ice-cream', category: 'desserts', price: 5.99, description: 'Premium matcha green tea ice cream', dietaryTags: ['vegetarian'], allergens: ['dairy'], nutrition: { calories: 160, protein: 2, carbs: 22, fat: 8 } },
    { name: 'Tempura Ice Cream', slug: 'tempura-ice-cream', category: 'desserts', price: 8.99, description: 'Vanilla ice cream wrapped in pound cake and fried, served with chocolate sauce', dietaryTags: ['vegetarian'], allergens: ['dairy', 'gluten', 'eggs'], nutrition: { calories: 380, protein: 6, carbs: 48, fat: 18 } },

    // Beverages
    { name: 'Green Tea', slug: 'green-tea', category: 'beverages', price: 3.99, description: 'Traditional Japanese green tea', dietaryTags: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
    { name: 'Sake', slug: 'sake', category: 'beverages', price: 12.99, description: 'Premium Japanese rice wine (glass)', dietaryTags: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], nutrition: { calories: 120, protein: 0, carbs: 4, fat: 0 } },
    { name: 'Ramune', slug: 'ramune', category: 'beverages', price: 4.99, description: 'Japanese marble soda - original flavor', dietaryTags: ['vegetarian', 'vegan'], allergens: [], nutrition: { calories: 100, protein: 0, carbs: 26, fat: 0 } },
    { name: 'Iced Tea', slug: 'iced-tea', category: 'beverages', price: 3.99, description: 'Fresh brewed iced tea with lemon', dietaryTags: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], nutrition: { calories: 60, protein: 0, carbs: 16, fat: 0 } },
  ],
};

const EMPLOYEE_ROLES: Record<string, Prisma.EmployeeRoleName[]> = {
  director: ['DIRECTOR'],
  manager: ['MANAGER'],
  waiter: ['WAITER'],
  cashier: ['CASHIER', 'WAITER'],
  kitchen: ['KITCHEN'],
};

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedPlatformAdmins() {
  console.log('👑 Seeding platform admins...');

  const admins = [
    { email: 'admin@umai.io', password: 'Admin123!', fullName: 'System Administrator', role: 'SUPER_ADMIN' as const },
    { email: 'support@umai.io', password: 'Support123!', fullName: 'Support Team', role: 'SUPPORT' as const },
    { email: 'analyst@umai.io', password: 'Analyst123!', fullName: 'Data Analyst', role: 'ANALYST' as const },
  ];

  const created = [];
  for (const admin of admins) {
    const record = await prisma.platformAdmin.create({
      data: {
        email: admin.email,
        passwordHash: await hashPassword(admin.password),
        fullName: admin.fullName,
        role: admin.role,
        isActive: true,
      },
    });
    created.push(record);
    console.log(`  ✓ Created admin: ${admin.email}`);
  }

  return created;
}

async function seedRestaurant() {
  console.log('🏪 Seeding restaurant...');

  const restaurant = await prisma.restaurant.create({
    data: {
      slug: CUISINE_DATA.slug,
      name: CUISINE_DATA.name,
      description: CUISINE_DATA.description,
      phone: '+1-555-0123',
      email: 'info@sakura-sushi.com',
      addressLine1: '123 Cherry Blossom Lane',
      addressLine2: 'Suite 100',
      city: 'San Francisco',
      countryCode: 'US',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      isActive: true,
      settings: {
        acceptOnlinePayments: true,
        requireReservation: false,
        maxPartySize: 12,
        defaultTaxRate: 0.085,
        serviceFeeRate: 0.05,
      },
    },
  });

  console.log(`  ✓ Created restaurant: ${restaurant.name}`);

  // Seed operating hours
  console.log('  📅 Seeding operating hours...');
  const operatingHours: { dayOfWeek: Prisma.DayOfWeek; openTime: Date; closeTime: Date }[] = [
    { dayOfWeek: 'MON', openTime: createTime(11, 0), closeTime: createTime(22, 0) },
    { dayOfWeek: 'TUE', openTime: createTime(11, 0), closeTime: createTime(22, 0) },
    { dayOfWeek: 'WED', openTime: createTime(11, 0), closeTime: createTime(22, 0) },
    { dayOfWeek: 'THU', openTime: createTime(11, 0), closeTime: createTime(22, 0) },
    { dayOfWeek: 'FRI', openTime: createTime(11, 0), closeTime: createTime(23, 0) },
    { dayOfWeek: 'SAT', openTime: createTime(10, 0), closeTime: createTime(23, 0) },
    { dayOfWeek: 'SUN', openTime: createTime(10, 0), closeTime: createTime(21, 0) },
  ];

  for (const hours of operatingHours) {
    await prisma.restaurantOperatingHours.create({
      data: {
        restaurantId: restaurant.id,
        ...hours,
      },
    });
  }
  console.log(`    ✓ Created ${operatingHours.length} operating hours records`);

  return restaurant;
}

async function seedEmployees(restaurantId: string) {
  console.log('👨‍🍳 Seeding restaurant employees...');

  const employees = [
    { fullName: 'Takeshi Yamamoto', email: 'takeshi@sakura-sushi.com', phone: '+1-555-0101', roleType: 'director' },
    { fullName: 'Yuki Tanaka', email: 'yuki@sakura-sushi.com', phone: '+1-555-0102', roleType: 'manager' },
    { fullName: 'Hiroshi Sato', email: 'hiroshi@sakura-sushi.com', phone: '+1-555-0103', roleType: 'waiter' },
    { fullName: 'Kenji Nakamura', email: 'kenji@sakura-sushi.com', phone: '+1-555-0104', roleType: 'waiter' },
    { fullName: 'Mika Yoshida', email: 'mika@sakura-sushi.com', phone: '+1-555-0105', roleType: 'cashier' },
    { fullName: 'Sora Kimura', email: 'sora@sakura-sushi.com', phone: '+1-555-0106', roleType: 'kitchen' },
    { fullName: 'Ryu Watanabe', email: 'ryu@sakura-sushi.com', phone: '+1-555-0107', roleType: 'kitchen' },
  ];

  const created = [];
  for (const emp of employees) {
    const employee = await prisma.restaurantEmployee.create({
      data: {
        restaurantId,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        passwordHash: await hashPassword('Employee123!'),
        isActive: true,
        roles: {
          create: EMPLOYEE_ROLES[emp.roleType].map((role) => ({ role })),
        },
      },
    });
    created.push(employee);
    console.log(`  ✓ Created employee: ${emp.fullName} (${emp.roleType})`);
  }

  return created;
}

async function seedTables(restaurantId: string) {
  console.log('🪑 Seeding restaurant tables...');

  const tables = [
    { label: 'A1', capacity: 2 },
    { label: 'A2', capacity: 2 },
    { label: 'A3', capacity: 4 },
    { label: 'A4', capacity: 4 },
    { label: 'B1', capacity: 4 },
    { label: 'B2', capacity: 6 },
    { label: 'B3', capacity: 6 },
    { label: 'C1', capacity: 8 },
    { label: 'C2', capacity: 10 },
    { label: 'VIP', capacity: 12 },
  ];

  const created = [];
  for (const table of tables) {
    const record = await prisma.restaurantTable.create({
      data: {
        restaurantId,
        label: table.label,
        capacity: table.capacity,
        qrCode: generateQrCode(),
        isActive: true,
      },
    });
    created.push(record);
    console.log(`  ✓ Created table: ${table.label} (capacity: ${table.capacity})`);
  }

  return created;
}

async function seedCategories(restaurantId: string) {
  console.log('📂 Seeding menu categories...');

  const created = [];

  for (const cat of CUISINE_DATA.categories) {
    const category = await prisma.category.create({
      data: {
        restaurantId,
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    created.push(category);
    console.log(`  ✓ Created category: ${cat.name}`);
  }

  return created;
}

async function seedProducts(restaurantId: string, categories: { id: string; slug: string }[]) {
  console.log('🍣 Seeding products...');

  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));
  const created = [];

  for (const prod of CUISINE_DATA.products) {
    const categoryId = categoryMap.get(prod.category);
    if (!categoryId) {
      console.warn(`  ⚠ Category not found: ${prod.category}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        restaurantId,
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: new Prisma.Decimal(prod.price),
        currency: 'USD',
        isAvailable: true,
        dietaryTags: prod.dietaryTags,
        allergens: { contains: prod.allergens },
        nutrition: prod.nutrition,
      },
    });
    created.push(product);
    console.log(`  ✓ Created product: ${prod.name} ($${prod.price})`);
  }

  return created;
}

async function seedMediaAssets(restaurantId: string, products: { id: string; slug: string; name: string }[]) {
  console.log('🖼️  Seeding media assets...');

  const created = [];

  for (const product of products.slice(0, 10)) {
    const asset = await prisma.mediaAsset.create({
      data: {
        restaurantId,
        type: 'IMAGE',
        storageKey: `products/${product.slug}/main.jpg`,
        mimeType: 'image/jpeg',
        fileSize: randomInt(50000, 200000),
        width: 800,
        height: 600,
      },
    });

    await prisma.productAsset.create({
      data: {
        productId: product.id,
        assetId: asset.id,
        kind: 'PHOTO',
        sortOrder: 0,
      },
    });

    created.push(asset);
    console.log(`  ✓ Created asset for: ${product.name}`);
  }

  return created;
}

async function seedCustomers() {
  console.log('👤 Seeding customers...');

  const customers = [
    { email: 'john.doe@email.com', fullName: 'John Doe', phone: '+1-555-0201', locale: 'en' },
    { email: 'jane.smith@email.com', fullName: 'Jane Smith', phone: '+1-555-0202', locale: 'en' },
    { email: 'mike.johnson@email.com', fullName: 'Mike Johnson', phone: '+1-555-0203', locale: 'en' },
    { email: 'sarah.wilson@email.com', fullName: 'Sarah Wilson', phone: '+1-555-0204', locale: 'en' },
    { email: 'david.lee@email.com', fullName: 'David Lee', phone: '+1-555-0205', locale: 'en' },
    { email: 'emily.chen@email.com', fullName: 'Emily Chen', phone: '+1-555-0206', locale: 'en' },
    { email: 'chris.taylor@email.com', fullName: 'Chris Taylor', phone: '+1-555-0207', locale: 'en' },
    { email: 'lisa.anderson@email.com', fullName: 'Lisa Anderson', phone: '+1-555-0208', locale: 'en' },
  ];

  const created = [];
  for (const cust of customers) {
    const customer = await prisma.customer.create({
      data: {
        email: cust.email,
        fullName: cust.fullName,
        phone: cust.phone,
        locale: cust.locale,
      },
    });
    created.push(customer);
    console.log(`  ✓ Created customer: ${cust.fullName}`);
  }

  return created;
}

async function seedSessions(restaurantId: string, tables: { id: string; label: string }[]) {
  console.log('🎫 Seeding customer sessions...');

  const sessions = [
    { tableIndex: 0, daysOffset: 0 },
    { tableIndex: 1, daysOffset: 0 },
    { tableIndex: 2, daysOffset: -1 },
    { tableIndex: 3, daysOffset: -2 },
    { tableIndex: 4, daysOffset: -3 },
  ];

  const created = [];
  for (const sess of sessions) {
    const table = tables[sess.tableIndex];
    const session = await prisma.customerSession.create({
      data: {
        restaurantId,
        tableId: table.id,
        guestToken: generateGuestToken(),
        expiresAt: createDate(sess.daysOffset + 1, 23, 59),
        isActive: sess.daysOffset >= 0,
      },
    });
    created.push(session);
    console.log(`  ✓ Created session for table: ${table.label}`);
  }

  return created;
}

async function seedOrders(
  restaurantId: string,
  sessions: { id: string }[],
  products: { id: string; name: string; price: Prisma.Decimal }[],
  customers: { id: string }[],
  employees: { id: string }[],
) {
  console.log('📝 Seeding orders...');

  const ordersData = [
    { sessionIndex: 0, status: 'PLACED' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 1, status: 'ACCEPTED' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 2, status: 'IN_PROGRESS' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 2, status: 'READY' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 3, status: 'SERVED' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 3, status: 'COMPLETED' as Prisma.OrderStatus, channel: 'DINE_IN' as Prisma.OrderChannel },
    { sessionIndex: 4, status: 'COMPLETED' as Prisma.OrderStatus, channel: 'TAKEAWAY' as Prisma.OrderChannel },
  ];

  const created = [];
  let orderNumber = 1000;

  for (const orderData of ordersData) {
    const session = sessions[orderData.sessionIndex];
    const customer = randomElement(customers);
    const employee = randomElement(employees);

    // Select 2-4 random products for order
    const orderProducts = [...products].sort(() => Math.random() - 0.5).slice(0, randomInt(2, 4));

    let subtotal = new Prisma.Decimal(0);
    const orderItems: { productId: string; quantity: number; nameSnapshot: string; unitPriceSnapshot: Prisma.Decimal; totalPriceSnapshot: Prisma.Decimal }[] = [];

    for (const product of orderProducts) {
      const quantity = randomInt(1, 3);
      const totalPrice = product.price.mul(quantity);
      subtotal = subtotal.add(totalPrice);

      orderItems.push({
        productId: product.id,
        quantity,
        nameSnapshot: product.name,
        unitPriceSnapshot: product.price,
        totalPriceSnapshot: totalPrice,
      });
    }

    const tax = subtotal.mul(0.085);
    const serviceFee = subtotal.mul(0.05);
    const total = subtotal.add(tax).add(serviceFee);

    const orderRecord = await prisma.order.create({
      data: {
        restaurantId,
        tableSessionId: session.id,
        customerId: Math.random() > 0.5 ? customer.id : null,
        orderNumber: orderNumber++,
        channel: orderData.channel,
        status: orderData.status,
        currency: 'USD',
        subtotal,
        tax,
        serviceFee,
        total,
        placedAt: createDate(-1, randomInt(11, 21), randomInt(0, 59)),
        completedAt: orderData.status === 'COMPLETED' ? createDate(-1, 22, 30) : null,
        createdByEmployeeId: Math.random() > 0.3 ? employee.id : null,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    created.push(orderRecord);
    console.log(`  ✓ Created order #${orderRecord.orderNumber}: ${orderData.status} (${orderItems.length} items, $${total.toFixed(2)})`);

    // Create payment for completed/served orders
    if (orderData.status === 'COMPLETED' || orderData.status === 'SERVED') {
      const paymentStatus = orderData.status === 'COMPLETED' ? 'SUCCEEDED' : 'PROCESSING';
      await prisma.payment.create({
        data: {
          orderId: orderRecord.id,
          provider: Math.random() > 0.5 ? 'ONLINE' : 'CASH',
          status: paymentStatus as Prisma.PaymentStatus,
          amount: total,
          currency: 'USD',
          providerRef: paymentStatus === 'SUCCEEDED' ? `PAY-${generateToken(12)}` : null,
        },
      });
    }
  }

  return created;
}

async function seedCartItems(sessions: { id: string; isActive: boolean }[], products: { id: string; name: string; isAvailable: boolean }[]) {
  console.log('🛒 Seeding cart items...');

  const activeSessions = sessions.filter((s) => s.isActive);
  const created = [];

  for (const session of activeSessions) {
    const cartProducts = products.filter((p) => p.isAvailable).sort(() => Math.random() - 0.5).slice(0, randomInt(1, 3));

    for (const product of cartProducts) {
      const cartItem = await prisma.cartItem.create({
        data: {
          sessionId: session.id,
          productId: product.id,
          quantity: randomInt(1, 2),
        },
      });
      created.push(cartItem);
      console.log(`  ✓ Created cart item: ${product.name} (qty: ${cartItem.quantity})`);
    }
  }

  return created;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    🌸 UMAI DATABASE SEED                      ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  try {
    // Clear existing data (in reverse dependency order)
    console.log('🧹 Cleaning existing data...\n');

    await prisma.payment.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.customerSession.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.productAsset.deleteMany({});
    await prisma.mediaAsset.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.restaurantEmployeeRole.deleteMany({});
    await prisma.restaurantEmployee.deleteMany({});
    await prisma.restaurantTable.deleteMany({});
    await prisma.restaurantOperatingHours.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.platformAdmin.deleteMany({});

    console.log('  ✓ All existing data cleared\n');

    // Seed in dependency order
    const admins = await seedPlatformAdmins();
    console.log('');

    const restaurant = await seedRestaurant();
    console.log('');

    const employees = await seedEmployees(restaurant.id);
    console.log('');

    const tables = await seedTables(restaurant.id);
    console.log('');

    const categories = await seedCategories(restaurant.id);
    console.log('');

    const products = await seedProducts(restaurant.id, categories);
    console.log('');

    await seedMediaAssets(restaurant.id, products);
    console.log('');

    const customers = await seedCustomers();
    console.log('');

    const sessions = await seedSessions(restaurant.id, tables);
    console.log('');

    const orders = await seedOrders(restaurant.id, sessions, products, customers, employees);
    console.log('');

    await seedCartItems(sessions, products);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                        📊 SEED SUMMARY                         ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  Platform Admins:  ${admins.length}`);
    console.log(`  Restaurant:       1 (${restaurant.name})`);
    console.log(`  Employees:        ${employees.length}`);
    console.log(`  Tables:           ${tables.length}`);
    console.log(`  Categories:       ${categories.length}`);
    console.log(`  Products:         ${products.length}`);
    console.log(`  Customers:        ${customers.length}`);
    console.log(`  Sessions:         ${sessions.length}`);
    console.log(`  Orders:           ${orders.length}`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                   ✅ SEED COMPLETED SUCCESSFULLY               ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('🔐 Test Credentials:');
    console.log('');
    console.log('  Platform Admins:');
    console.log('    - admin@umai.io     / Admin123!');
    console.log('    - support@umai.io   / Support123!');
    console.log('    - analyst@umai.io   / Analyst123!');
    console.log('');
    console.log('  Restaurant Employees:');
    console.log('    - takeshi@sakura-sushi.com  / Employee123!');
    console.log('    - yuki@sakura-sushi.com    / Employee123!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Execute seed
main()
  .catch((error) => {
    console.error('Fatal error during seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
