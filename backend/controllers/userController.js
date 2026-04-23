const User = require('../models/User');
const paginate = require('../utils/paginate');

exports.getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }
    if (req.query.role) filter.role = req.query.role;
    const result = await paginate(User, filter, req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body; // prevent password update via this route
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const SalesOrder = require('../models/SalesOrder');
    const Product = require('../models/Product');
    const Invoice = require('../models/Invoice');
    const PurchaseOrder = require('../models/PurchaseOrder');

    const [totalUsers, totalProducts, lowStockCount, pendingOrders, totalRevenue, unpaidInvoices] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$reorderLevel'] } }),
      SalesOrder.countDocuments({ status: { $in: ['draft', 'confirmed'] } }),
      Invoice.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$grandTotal' } } }]),
      Invoice.countDocuments({ status: 'unpaid' }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        lowStockCount,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        unpaidInvoices,
      },
    });
  } catch (err) { next(err); }
};
