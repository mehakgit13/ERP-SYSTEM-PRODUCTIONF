const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const paginate = require('../utils/paginate');

exports.getSalesOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(SalesOrder, filter, req.query, [
      { path: 'customer', select: 'name email' },
      { path: 'items.product', select: 'title sku' },
      { path: 'createdBy', select: 'name' },
    ]);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getSalesOrder = async (req, res, next) => {
  try {
    const order = await SalesOrder.findById(req.params.id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name');
    if (!order) return res.status(404).json({ success: false, message: 'Sales order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.createSalesOrder = async (req, res, next) => {
  try {
    const order = await SalesOrder.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.updateSalesOrder = async (req, res, next) => {
  try {
    const order = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Sales order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await SalesOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Sales order not found' });

    // Deduct stock when order is confirmed
    if (status === 'confirmed') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
