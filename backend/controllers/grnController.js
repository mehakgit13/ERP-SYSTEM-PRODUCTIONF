const GRN = require('../models/GRN');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const paginate = require('../utils/paginate');

exports.getGRNs = async (req, res, next) => {
  try {
    const result = await paginate(GRN, {}, req.query, [
      { path: 'purchaseOrder', select: 'orderNumber' },
      { path: 'supplier', select: 'name' },
      { path: 'receivedBy', select: 'name' },
    ]);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getGRN = async (req, res, next) => {
  try {
    const grn = await GRN.findById(req.params.id)
      .populate('purchaseOrder')
      .populate('supplier')
      .populate('items.product');
    if (!grn) return res.status(404).json({ success: false, message: 'GRN not found' });
    res.json({ success: true, data: grn });
  } catch (err) { next(err); }
};

exports.createGRN = async (req, res, next) => {
  try {
    const grn = await GRN.create({ ...req.body, receivedBy: req.user._id });

    // Update stock for each received item
    for (const item of grn.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.receivedQty } });
    }

    // Update PO status
    const po = await PurchaseOrder.findById(grn.purchaseOrder);
    if (po) {
      const allReceived = po.items.every(poItem => {
        const grnItem = grn.items.find(g => g.product.toString() === poItem.product.toString());
        return grnItem && grnItem.receivedQty >= poItem.quantity;
      });
      po.status = allReceived ? 'received' : 'partially_received';
      await po.save();
    }

    res.status(201).json({ success: true, data: grn });
  } catch (err) { next(err); }
};
