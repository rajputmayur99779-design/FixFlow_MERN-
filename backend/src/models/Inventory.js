import mongoose from 'mongoose';
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  reorderLevel: { type: Number, min: 0, default: 5 },
  unitPrice: { type: Number, min: 0, default: 0 },
  category: { type: String, default: 'General' }
}, { timestamps: true });
export default mongoose.model('Inventory', inventorySchema);
