import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Repair from './src/models/Repair.js';
import Inventory from './src/models/Inventory.js';
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fixflow');
  await Promise.all([User.deleteMany({}), Repair.deleteMany({}), Inventory.deleteMany({})]);
  const [admin, tech, customer] = await User.create([
    { name: 'Aarav Admin', email: 'admin@fixflow.demo', password: 'Admin123!', role: 'admin' },
    { name: 'Riya Technician', email: 'tech@fixflow.demo', password: 'Tech123!', role: 'technician' },
    { name: 'Demo Customer', email: 'customer@fixflow.demo', password: 'Customer123!', role: 'customer' }
  ]);
  await Repair.create([
    { customer: customer._id, technician: tech._id, device: 'iPhone 13', category: 'Mobile', issue: 'Battery drains quickly', status: 'In Progress', estimatedCost: 2499 },
    { customer: customer._id, technician: tech._id, device: 'Dell Inspiron', category: 'Laptop', issue: 'Keyboard keys not responding', status: 'Diagnosing', estimatedCost: 1800 },
    { customer: customer._id, device: 'Samsung Tab', category: 'Tablet', issue: 'Cracked screen', status: 'Requested' }
  ]);
  await Inventory.create([
    { name: 'USB-C Charging Port', sku: 'PART-USB-C', quantity: 3, reorderLevel: 5, unitPrice: 450, category: 'Mobile Parts' },
    { name: 'Laptop SSD 512GB', sku: 'PART-SSD512', quantity: 12, reorderLevel: 4, unitPrice: 3200, category: 'Storage' },
    { name: 'Phone Battery Pack', sku: 'PART-BATT', quantity: 7, reorderLevel: 5, unitPrice: 950, category: 'Mobile Parts' }
  ]);
  console.log('Seed complete. Demo accounts are listed in README.md');
  await mongoose.disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
