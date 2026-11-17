import { Router } from 'express';
import Inventory from '../models/Inventory.js';
import { protect, allow } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', async (_req, res, next) => {
  try { res.json(await Inventory.find().sort({ name: 1 })); } catch (e) { next(e); }
});
router.post('/', allow('admin'), async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
});
router.patch('/:id', allow('admin'), async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (e) { next(e); }
});
router.delete('/:id', allow('admin'), async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Inventory item deleted.' });
  } catch (e) { next(e); }
});
export default router;
