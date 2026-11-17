import { Router } from 'express';
import Repair from '../models/Repair.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = req.user.role === 'customer' ? { customer: req.user._id } :
      req.user.role === 'technician' ? { technician: req.user._id } : {};
    const repairs = await Repair.find(filter).populate('customer', 'name email phone').populate('technician', 'name email').sort({ createdAt: -1 });
    res.json(repairs);
  } catch (e) { next(e); }
});

router.post('/', allow('customer', 'admin'), async (req, res, next) => {
  try {
    const { device, category, issue } = req.body;
    if (!device?.trim() || !issue?.trim()) return res.status(400).json({ message: 'Device and issue description are required.' });
    const repair = await Repair.create({ customer: req.user._id, device, category, issue });
    const result = await repair.populate('customer', 'name email phone');
    res.status(201).json(result);
  } catch (e) { next(e); }
});

router.patch('/:id', allow('admin', 'technician'), async (req, res, next) => {
  try {
    const allowed = ['status', 'technician', 'estimatedCost', 'notes'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const repair = await Repair.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate('customer', 'name email phone').populate('technician', 'name email');
    if (!repair) return res.status(404).json({ message: 'Repair not found.' });
    res.json(repair);
  } catch (e) { next(e); }
});
router.delete('/:id', allow('admin'), async (req, res, next) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id);
    if (!repair) return res.status(404).json({ message: 'Repair not found.' });
    res.json({ message: 'Repair deleted.' });
  } catch (e) { next(e); }
});
export default router;
