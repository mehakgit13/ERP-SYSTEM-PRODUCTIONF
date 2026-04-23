const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  salesOrder:    { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    description: String,
    quantity:    Number,
    unitPrice:   Number,
    total:       Number,
  }],
  subtotal:    { type: Number, required: true },
  tax:         { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  grandTotal:  { type: Number, required: true },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'overdue', 'cancelled'],
    default: 'unpaid',
  },
  issueDate:   { type: Date, default: Date.now },
  dueDate:     { type: Date, required: true },
  paidDate:    { type: Date },
  notes:       { type: String, default: '' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

InvoiceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${String(count + 2001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
