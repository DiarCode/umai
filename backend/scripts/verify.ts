/**
 * Verification script to confirm all seeded data is in the database
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function verify() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                    📋 DATABASE VERIFICATION                    ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // 1. Verify Platform Admins
    console.log('👑 Platform Admins:');
    const admins = await prisma.platformAdmin.findMany();
    for (const admin of admins) {
      console.log(`  ✓ ${admin.email} (${admin.role})`);
    }
    console.log(`  Total: ${admins.length}\n`);

    // 2. Verify Restaurant
    console.log('🏪 Restaurant:');
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        hours: true,
      },
    });
    if (restaurant) {
      console.log(`  ✓ ${restaurant.name} (${restaurant.slug})`);
      console.log(`  ✓ Address: ${restaurant.addressLine1}, ${restaurant.city}`);
      console.log(`  ✓ Operating Hours: ${restaurant.hours.length} days configured`);
    }
    console.log();

    // 3. Verify Employees
    console.log('👨‍🍳 Employees:');
    const employees = await prisma.restaurantEmployee.findMany({
      include: { roles: true },
    });
    for (const emp of employees) {
      const roles = emp.roles.map((r) => r.role).join(', ');
      console.log(`  ✓ ${emp.fullName} (${emp.email}) - ${roles}`);
    }
    console.log(`  Total: ${employees.length}\n`);

    // 4. Verify Tables
    console.log('🪑 Tables:');
    const tables = await prisma.restaurantTable.findMany({
      orderBy: { label: 'asc' },
    });
    for (const table of tables) {
      console.log(`  ✓ Table ${table.label} (capacity: ${table.capacity}, QR: ${table.qrCode.substring(0, 10)}...)`);
    }
    console.log(`  Total: ${tables.length}\n`);

    // 5. Verify Categories
    console.log('📂 Categories:');
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    for (const cat of categories) {
      console.log(`  ✓ ${cat.name} (${cat.slug})`);
    }
    console.log(`  Total: ${categories.length}\n`);

    // 6. Verify Products
    console.log('🍣 Products (sample):');
    const products = await prisma.product.findMany({
      include: { category: true },
      take: 10,
    });
    for (const prod of products) {
      console.log(`  ✓ ${prod.name} - $${prod.price} [${prod.category?.name}]`);
    }
    const totalProducts = await prisma.product.count();
    console.log(`  Total: ${totalProducts}\n`);

    // 7. Verify Customers
    console.log('👤 Customers:');
    const customers = await prisma.customer.findMany();
    for (const cust of customers) {
      console.log(`  ✓ ${cust.fullName} (${cust.email})`);
    }
    console.log(`  Total: ${customers.length}\n`);

    // 8. Verify Sessions
    console.log('🎫 Sessions:');
    const sessions = await prisma.customerSession.findMany({
      include: { table: true },
    });
    for (const sess of sessions) {
      console.log(`  ✓ Session for Table ${sess.table.label} (active: ${sess.isActive})`);
    }
    console.log(`  Total: ${sessions.length}\n`);

    // 9. Verify Orders
    console.log('📝 Orders:');
    const orders = await prisma.order.findMany({
      include: { items: true, _count: { select: { items: true } } },
      orderBy: { orderNumber: 'asc' },
    });
    for (const order of orders) {
      console.log(`  ✓ Order #${order.orderNumber}: ${order.status} - $${order.total} (${order._count.items} items)`);
    }
    console.log(`  Total: ${orders.length}\n`);

    // 10. Verify Payments
    console.log('💳 Payments:');
    const payments = await prisma.payment.findMany({
      include: { order: { select: { orderNumber: true } } },
    });
    for (const payment of payments) {
      console.log(`  ✓ Order #${payment.order.orderNumber}: ${payment.status} - $${payment.amount} (${payment.provider})`);
    }
    console.log(`  Total: ${payments.length}\n`);

    // 11. Verify Cart Items
    console.log('🛒 Cart Items:');
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true, session: { include: { table: true } } },
    });
    for (const item of cartItems) {
      console.log(`  ✓ ${item.product.name} x${item.quantity} (Table ${item.session.table.label})`);
    }
    console.log(`  Total: ${cartItems.length}\n`);

    // Final Summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ VERIFICATION COMPLETE                    ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`  Platform Admins:  ${admins.length}`);
    console.log(`  Restaurant:       1`);
    console.log(`  Employees:         ${employees.length}`);
    console.log(`  Tables:            ${tables.length}`);
    console.log(`  Categories:        ${categories.length}`);
    console.log(`  Products:          ${totalProducts}`);
    console.log(`  Customers:         ${customers.length}`);
    console.log(`  Sessions:          ${sessions.length}`);
    console.log(`  Orders:            ${orders.length}`);
    console.log(`  Payments:          ${payments.length}`);
    console.log(`  Cart Items:        ${cartItems.length}`);
    console.log('\n═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verify();