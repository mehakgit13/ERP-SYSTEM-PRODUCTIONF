// routes/customers.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.route('/').get(c.getCustomers).post(authorize('admin','sales'), c.createCustomer);
router.route('/:id').get(c.getCustomer).put(authorize('admin','sales'), c.updateCustomer).delete(authorize('admin'), c.deleteCustomer);
module.exports = router;
