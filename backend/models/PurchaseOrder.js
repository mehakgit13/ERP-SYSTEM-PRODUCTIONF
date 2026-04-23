const mongoose = require('mongoose');

const POItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:     { type: Number, required: true, min: 1 },
  unitPrice:    { type: Number, required: true },
  receivedQty:  { type: Number, default: 0 },
}, { _id: false });

const PurchaseOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  supplier:    { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items:       [POItemSchema],
  status: {
    type: String,
    enum: ['draft', 'sent', 'partially_received', 'received', 'cancelled'],
    default: 'draft',
  },
  totalAmount:   { type: Number, default: 0 },
  expectedDate:  { type: Date },
  notes:         { type: String, default: '' },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

PurchaseOrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.orderNumber = `PO-${String(count + 1001).padStart(4, '0')}`;
  }
  this.totalAmount = this.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  next();
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
