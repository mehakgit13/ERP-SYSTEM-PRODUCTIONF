const express = require('express');
const router = express.Router();
const po = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.route('/').get(po.getPurchaseOrders).post(authorize('admin','purchase'), po.createPurchaseOrder);
router.route('/:id').get(po.getPurchaseOrder).put(authorize('admin','purchase'), po.updatePurchaseOrder);
module.exports = router;
