const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  total:     { type: Number },
}, { _id: false });

OrderItemSchema.pre('save', function (next) {
  this.total = this.quantity * this.unitPrice;
  next();
});

const SalesOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer:    { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items:       [OrderItemSchema],
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'draft',
  },
  totalPrice:   { type: Number, default: 0 },
  tax:          { type: Number, default: 0 },
  discount:     { type: Number, default: 0 },
  grandTotal:   { type: Number, default: 0 },
  notes:        { type: String, default: '' },
  deliveryDate: { type: Date },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-generate order number and calculate totals
SalesOrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('SalesOrder').countDocuments();
    this.orderNumber = `SO-${String(count + 1001).padStart(4, '0')}`;
  }
  this.totalPrice = this.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  this.grandTotal = this.totalPrice + this.tax - this.discount;
  next();
});

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
