const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');
const Invoice = require('../models/Invoice');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalCustomers,
      totalSuppliers,
      lowStockProducts,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      unpaidInvoices,
      paidInvoices,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Customer.countDocuments(),
      Supplier.countDocuments(),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$reorderLevel'] } }),
      SalesOrder.countDocuments({ status: 'pending' }),
      SalesOrder.countDocuments({ status: 'confirmed' }),
      SalesOrder.countDocuments({ status: 'shipped' }),
      SalesOrder.countDocuments({ status: 'delivered' }),
      Invoice.countDocuments({ status: 'unpaid' }),
      Invoice.countDocuments({ status: 'paid' }),
    ]);

    // Revenue from paid invoices
    const revenueResult = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Unpaid invoice total
    const unpaidResult = await Invoice.aggregate([
      { $match: { status: 'unpaid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const unpaidAmount = unpaidResult[0]?.total || 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyRevenue = await Invoice.aggregate([
      { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Low stock products list
    const lowStockList = await Product.find(
      { $expr: { $lte: ['$stock', '$reorderLevel'] } },
      'title sku stock reorderLevel category'
    ).limit(10);

    // Recent sales orders
    const recentOrders = await SalesOrder.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalProducts,
          totalCustomers,
          totalSuppliers,
          lowStockProducts,
          pendingOrders,
          confirmedOrders,
          shippedOrders,
          deliveredOrders,
          unpaidInvoices,
          paidInvoices,
        },
        revenue: { totalRevenue, unpaidAmount },
        monthlyRevenue,
        lowStockList,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};
