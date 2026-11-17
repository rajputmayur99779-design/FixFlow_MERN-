import { Router } from 'express';
import Repair from '../models/Repair.js';
import Inventory from '../models/Inventory.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.get('/summary', protect, allow('admin', 'technician'), async (req, res, next) => {
  try {
    const filter = req.user.role === 'technician' ? { technician: req.user._id } : {};
    const [total, active, completed, revenue, lowStock, byStatus] = await Promise.all([
      Repair.countDocuments(filter),
      Repair.countDocuments({ ...filter, status: { $in: ['Requested', 'Diagnosing', 'In Progress', 'Waiting for Parts'] } }),
      Repair.countDocuments({ ...filter, status: 'Completed' }),
      Repair.aggregate([{ $match: { ...filter, status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$estimatedCost' } } }]),
      Inventory.countDocuments({ $expr: { $lte: ['$quantity', '$reorderLevel'] } }),
      Repair.aggregate([{ $match: filter }, { $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);
    res.json({ total, active, completed, revenue: revenue[0]?.total || 0, lowStock, byStatus });
  } catch (e) { next(e); }
});
export default router;
