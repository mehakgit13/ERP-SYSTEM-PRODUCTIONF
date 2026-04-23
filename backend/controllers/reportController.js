const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// GET /api/reports/sales?from=&to=
exports.salesReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) { const end = new Date(to); end.setHours(23, 59, 59); filter.createdAt.$lte = end; }
    }
    const orders = await SalesOrder.find(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'title sku')
      .sort({ createdAt: -1 });

    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.grandTotal || 0), 0),
      byStatus: orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {}),
    };

    res.json({ success: true, data: orders, summary });
  } catch (err) { next(err); }
};

// GET /api/reports/inventory
exports.inventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ stock: 1 });
    const summary = {
      totalProducts: products.length,
      totalStockValue: products.reduce((s, p) => s + (p.stock * p.price), 0),
      lowStock: products.filter(p => p.stock <= p.reorderLevel).length,
      outOfStock: products.filter(p => p.stock === 0).length,
    };
    res.json({ success: true, data: products, summary });
  } catch (err) { next(err); }
};

// GET /api/reports/finance?from=&to=
exports.financeReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) { const end = new Date(to); end.setHours(23, 59, 59); filter.createdAt.$lte = end; }
    }
    const invoices = await Invoice.find(filter)
      .populate('customer', 'name')
      .populate('salesOrder', 'orderNumber')
      .sort({ createdAt: -1 });

    const summary = {
      totalInvoices: invoices.length,
      totalPaid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0),
      totalUnpaid: invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + i.totalAmount, 0),
      totalOverdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0),
    };

    res.json({ success: true, data: invoices, summary });
  } catch (err) { next(err); }
};
