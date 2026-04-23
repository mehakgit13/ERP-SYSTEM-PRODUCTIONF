const PurchaseOrder = require('../models/PurchaseOrder');
const paginate = require('../utils/paginate');

exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(PurchaseOrder, filter, req.query, [
      { path: 'supplier', select: 'name email' },
      { path: 'items.product', select: 'title sku' },
    ]);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('supplier')
      .populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Purchase order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.updatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Purchase order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};
