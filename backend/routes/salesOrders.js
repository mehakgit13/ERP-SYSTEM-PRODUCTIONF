const express = require('express');
const router = express.Router();
const { getSalesOrders, getSalesOrder, createSalesOrder, updateSalesOrder, updateStatus } = require('../controllers/salesOrderController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getSalesOrders).post(authorize('admin','sales'), createSalesOrder);
router.route('/:id').get(getSalesOrder).put(authorize('admin','sales'), updateSalesOrder);
router.patch('/:id/status', authorize('admin','sales'), updateStatus);
module.exports = router;
