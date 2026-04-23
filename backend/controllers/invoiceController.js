const Invoice = require('../models/Invoice');
const SalesOrder = require('../models/SalesOrder');
const paginate = require('../utils/paginate');

exports.getInvoices = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const result = await paginate(Invoice, filter, req.query, [
      { path: 'customer', select: 'name email' },
      { path: 'salesOrder', select: 'orderNumber' },
    ]);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer')
      .populate('salesOrder');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create({ ...req.body, createdBy: req.user._id });
    // Mark sales order as invoiced
    await SalesOrder.findByIdAndUpdate(invoice.salesOrder, { status: 'delivered' });
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.markPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidDate: new Date() },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
};
