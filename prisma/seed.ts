import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.auditLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.client.deleteMany();
  await prisma.qualityLog.deleteMany();
  await prisma.wasteLog.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.rawMaterial.deleteMany();
  await prisma.finishedGood.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = bcrypt.hashSync('MichealOgullei', 10);
  const staffPassword = bcrypt.hashSync('Staff@123', 10);

  const users = await Promise.all([
    prisma.user.create({ data: { id: 'u1', name: 'Namatovu Sarah', email: 'sarah@mogullei.co.ug', phone: '0772000111', role: 'ceo', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u2', name: 'Kato Paul', email: 'paul@mogullei.co.ug', phone: '0752000222', role: 'md', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u3', name: 'Achieng Grace', email: 'grace@mogullei.co.ug', phone: '0703000333', role: 'production_manager', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u4', name: 'Mugisha Brian', email: 'brian@mogullei.co.ug', phone: '0784000444', role: 'quality_assurance', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u5', name: 'Nakintu Betty', email: 'betty@mogullei.co.ug', phone: '0795000555', role: 'sales_lead', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u6', name: 'Okello John', email: 'john@mogullei.co.ug', phone: '0716000666', role: 'delivery_driver', status: 'active', password: staffPassword } }),
    prisma.user.create({ data: { id: 'u7', name: 'Micheal Ogullei', email: 'micheal@ogullei.com', phone: '0700000000', role: 'ceo', status: 'active', password: defaultPassword } }),
  ]);

  await Promise.all([
    prisma.supplier.create({ data: { id: 'sup1', name: 'Mukwano Industries', contactPerson: 'Alice', phone: '0701111111', materialsProvided: ['Coconut Oil', 'Palm Oil'], performanceScore: 95, averageDeliveryDays: 2 } }),
    prisma.supplier.create({ data: { id: 'sup2', name: 'Chemipharm Uganda', contactPerson: 'Bob', phone: '0702222222', materialsProvided: ['Sodium Hydroxide (Lye)'], performanceScore: 82, averageDeliveryDays: 5 } }),
    prisma.supplier.create({ data: { id: 'sup3', name: 'Natural Scents EA', contactPerson: 'Charlie', phone: '0703333333', materialsProvided: ['Lavender Essential Oil', 'Lemon Fragrance'], performanceScore: 98, averageDeliveryDays: 1 } }),
  ]);

  await Promise.all([
    prisma.rawMaterial.create({ data: { id: 'rm1', name: 'Olive Oil', category: 'oil', quantity: 25000, unit: 'g', costPerUnit: 50, lowStockThreshold: 5000, supplier: 'Mukwano Industries' } }),
    prisma.rawMaterial.create({ data: { id: 'rm2', name: 'Coconut Oil', category: 'oil', quantity: 15000, unit: 'g', costPerUnit: 20, lowStockThreshold: 3000, supplier: 'Bidco Uganda' } }),
    prisma.rawMaterial.create({ data: { id: 'rm3', name: 'Shea Butter', category: 'oil', quantity: 5000, unit: 'g', costPerUnit: 100, lowStockThreshold: 2000, supplier: 'Northern Shea Co-op' } }),
    prisma.rawMaterial.create({ data: { id: 'rm4', name: 'Sodium Hydroxide (Lye)', category: 'lye', quantity: 2000, unit: 'g', costPerUnit: 15, lowStockThreshold: 5000, supplier: 'Kampala Chemicals Ltd' } }),
    prisma.rawMaterial.create({ data: { id: 'rm5', name: 'Lavender Essential Oil', category: 'fragrance', quantity: 500, unit: 'g', costPerUnit: 500, lowStockThreshold: 200, supplier: 'Aroma Source UG' } }),
    prisma.rawMaterial.create({ data: { id: 'rm6', name: 'Activated Charcoal', category: 'colorant', quantity: 1000, unit: 'g', costPerUnit: 150, lowStockThreshold: 500, supplier: 'EcoBurn Charcoal' } }),
  ]);

  const r1 = await prisma.recipe.create({
    data: {
      id: 'r1', name: 'Himalayan Lavender', expectedYield: 10, notes: 'Classic relaxing lavender bar. Superfat at 5%.',
      ingredients: {
        create: [
          { rawMaterialId: 'rm1', amount: 500, percentage: 50 },
          { rawMaterialId: 'rm2', amount: 300, percentage: 30 },
          { rawMaterialId: 'rm3', amount: 200, percentage: 20 },
          { rawMaterialId: 'rm4', amount: 142 },
          { rawMaterialId: 'rm5', amount: 30 },
        ]
      }
    }
  });

  const r2 = await prisma.recipe.create({
    data: {
      id: 'r2', name: 'Charcoal & Tea Tree', expectedYield: 10, notes: 'Detoxifying facial bar. Add tea tree oil at trace.',
      ingredients: {
        create: [
          { rawMaterialId: 'rm1', amount: 400, percentage: 40 },
          { rawMaterialId: 'rm2', amount: 400, percentage: 40 },
          { rawMaterialId: 'rm3', amount: 200, percentage: 20 },
          { rawMaterialId: 'rm4', amount: 150 },
          { rawMaterialId: 'rm6', amount: 15 },
        ]
      }
    }
  });

  const today = new Date();

  await prisma.batch.create({
    data: {
      id: 'b402', recipeId: 'r1',
      startDate: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000),
      cureEndDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'curing', actualYield: 100, soldCount: 0, defectCount: 0,
      qualityLogs: {
        create: [{
          date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
          author: 'Achieng Grace', scentStrength: 'Strong', texture: 'Smooth',
          color: 'Light Purple', notes: 'Curing well, scent is holding strong.'
        }]
      }
    }
  });

  await prisma.batch.create({
    data: {
      id: 'b405', recipeId: 'r2',
      startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      cureEndDate: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000),
      status: 'curing', actualYield: 95, soldCount: 0, defectCount: 0,
    }
  });

  await prisma.batch.create({
    data: {
      id: 'b398', recipeId: 'r1',
      startDate: new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000),
      cureEndDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      status: 'ready', actualYield: 105, soldCount: 45, defectCount: 2,
    }
  });

  await prisma.batch.create({
    data: {
      id: 'b390', recipeId: 'r2',
      startDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
      cureEndDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      status: 'depleted', actualYield: 90, soldCount: 88, defectCount: 2,
    }
  });

  await prisma.batch.create({
    data: {
      id: 'b391', recipeId: 'r1',
      startDate: new Date(today.getTime() - 55 * 24 * 60 * 60 * 1000),
      cureEndDate: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000),
      status: 'flagged', actualYield: 100, soldCount: 10, defectCount: 15,
      notes: 'Reports of unusual color fading.',
    }
  });

  await Promise.all([
    prisma.finishedGood.create({ data: { id: 'fg1', sku: 'LAV-100', scent: 'Himalayan Lavender', size: '100g', priceRetail: 15000, priceWholesale: 10000, onHandCount: 450 } }),
    prisma.finishedGood.create({ data: { id: 'fg2', sku: 'CHA-100', scent: 'Charcoal & Tea Tree', size: '100g', priceRetail: 16000, priceWholesale: 11000, onHandCount: 200 } }),
    prisma.finishedGood.create({ data: { id: 'fg3', sku: 'EUC-100', scent: 'Eucalyptus & Mint', size: '100g', priceRetail: 15000, priceWholesale: 10000, onHandCount: 600 } }),
  ]);

  await Promise.all([
    prisma.client.create({ data: { id: 'c1', name: 'Kampala Organics', type: 'wholesale', email: 'hello@kampalaorganics.ug', phone: '0772123456', district: 'Kampala', region: 'Central', notes: 'Boutique Hotel Group', totalSpent: 12400000 } }),
    prisma.client.create({ data: { id: 'c2', name: 'Nile Wellness Spa', type: 'wholesale', email: 'orders@nilewellness.ug', phone: '0752987654', district: 'Jinja', region: 'Eastern', notes: 'Regional Chain', totalSpent: 8500000 } }),
    prisma.client.create({ data: { id: 'c3', name: 'Entebbe Natural Market', type: 'wholesale', email: 'purchasing@entebbenatural.ug', phone: '0701555111', district: 'Wakiso', region: 'Central', notes: 'Local Retailer', totalSpent: 6200000 } }),
    prisma.client.create({ data: { id: 'c4', name: 'Nakato Maria', type: 'retail', email: 'nakato.maria@example.ug', phone: '0782444333', district: 'Mukono', region: 'Central', notes: 'Prefers lavender', totalSpent: 150000 } }),
  ]);

  const o1 = await prisma.order.create({
    data: {
      id: 'o9022', clientId: 'c1', date: today, status: 'fulfilled', total: 1000000,
      items: { create: [{ finishedGoodId: 'fg1', batchId: 'b398', quantity: 100, price: 10000 }] }
    }
  });

  const o2 = await prisma.order.create({
    data: {
      id: 'o8994', clientId: 'c2', date: new Date(today.getTime() - 24 * 60 * 60 * 1000), status: 'fulfilled', total: 550000,
      items: { create: [{ finishedGoodId: 'fg2', batchId: 'b390', quantity: 50, price: 11000 }] }
    }
  });

  await Promise.all([
    prisma.delivery.create({ data: { id: 'd1', orderId: 'o9022', status: 'scheduled', date: new Date(today.getTime() + 24 * 60 * 60 * 1000), address: 'Plot 45, Kampala Road, Kampala', notes: 'Global Logistics pickup' } }),
    prisma.delivery.create({ data: { id: 'd2', orderId: 'o8994', status: 'out', date: today, address: '12 Main Street, Jinja', notes: 'Local Courier' } }),
  ]);

  await Promise.all([
    prisma.task.create({ data: { id: 't1', title: 'Check Batch B402', description: 'Perform quality check and log scent strength before packaging.', authorId: 'u2', status: 'pending' } }),
    prisma.task.create({ data: { id: 't2', title: 'Schedule Delivery for Kampala Organics', description: "Coordinate with driver for tomorrow's bulk delivery.", authorId: 'u5', status: 'pending' } }),
    prisma.task.create({ data: { id: 't3', title: 'Order Lye', description: 'Stock is running low on sodium hydroxide.', authorId: 'u3', status: 'completed', createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000) } }),
  ]);

  await Promise.all([
    prisma.expense.create({ data: { id: 'exp1', date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), category: 'utilities', amount: 150000, description: 'Electricity Bill - UMEME', reference: 'INV-001' } }),
    prisma.expense.create({ data: { id: 'exp2', date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), category: 'packaging', amount: 450000, description: 'Eco-friendly soap boxes (1000 pcs)' } }),
    prisma.expense.create({ data: { id: 'exp3', date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000), category: 'raw_materials', amount: 1200000, description: 'Bulk Coconut Oil' } }),
    prisma.expense.create({ data: { id: 'exp4', date: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000), category: 'salaries', amount: 3500000, description: 'Monthly Staff Salaries' } }),
  ]);

  await Promise.all([
    prisma.budget.create({ data: { id: 'b1', category: 'raw_materials', monthlyLimit: 5000000 } }),
    prisma.budget.create({ data: { id: 'b2', category: 'marketing', monthlyLimit: 1500000 } }),
    prisma.budget.create({ data: { id: 'b3', category: 'utilities', monthlyLimit: 500000 } }),
    prisma.budget.create({ data: { id: 'b4', category: 'packaging', monthlyLimit: 2000000 } }),
    prisma.budget.create({ data: { id: 'b5', category: 'logistics', monthlyLimit: 1000000 } }),
  ]);

  await prisma.auditLog.create({
    data: {
      id: 'al1',
      timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000),
      userId: 'u7', action: 'LOGIN', details: 'User logged in successfully'
    }
  });

  await prisma.settings.create({
    data: {
      id: 'singleton',
      currency: 'UGX',
      factoryName: 'MOgullei Industries',
      registrationNumber: '80010001234567',
      tin: '1001234567',
      address: 'Plot 42, Industrial Area',
      district: 'Kampala',
      phone: '0414123456',
      email: 'admin@mogullei.co.ug',
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
