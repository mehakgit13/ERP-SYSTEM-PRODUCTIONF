const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, markPaid } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.route('/').get(getInvoices).post(authorize('admin','finance','sales'), createInvoice);
router.route('/:id').get(getInvoice).put(authorize('admin','finance'), updateInvoice);
router.patch('/:id/mark-paid', authorize('admin','finance'), markPaid);
module.exports = router;
