const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { salesReport, inventoryReport, financeReport } = require('../controllers/reportController');

router.get('/sales',     protect, authorize('admin', 'sales', 'finance'), salesReport);
router.get('/inventory', protect, authorize('admin', 'inventory'), inventoryReport);
router.get('/finance',   protect, authorize('admin', 'finance'), financeReport);

module.exports = router;
