import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  device: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Mobile', 'Laptop', 'Tablet', 'Desktop', 'Other'], default: 'Other' },
  issue: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Requested', 'Diagnosing', 'In Progress', 'Waiting for Parts', 'Completed', 'Cancelled'], default: 'Requested' },
  estimatedCost: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: '' }
}, { timestamps: true });

repairSchema.pre('validate', function(next) {
  if (!this.trackingId) this.trackingId = `FF-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random()*900)}`;
  next();
});
export default mongoose.model('Repair', repairSchema);
