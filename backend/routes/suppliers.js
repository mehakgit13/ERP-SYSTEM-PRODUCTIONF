const express = require('express');
const router = express.Router();
const s = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.route('/').get(s.getSuppliers).post(authorize('admin','purchase'), s.createSupplier);
router.route('/:id').get(s.getSupplier).put(authorize('admin','purchase'), s.updateSupplier).delete(authorize('admin'), s.deleteSupplier);
module.exports = router;
