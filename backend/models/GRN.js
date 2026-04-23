const mongoose = require('mongoose');

const GRNItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderedQty:   { type: Number, required: true },
  receivedQty:  { type: Number, required: true },
  rejectedQty:  { type: Number, default: 0 },
  remarks:      { type: String, default: '' },
}, { _id: false });

const GRNSchema = new mongoose.Schema({
  grnNumber:      { type: String, unique: true },
  purchaseOrder:  { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  supplier:       { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  items:          [GRNItemSchema],
  receivedDate:   { type: Date, default: Date.now },
  receivedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'partial'],
    default: 'pending',
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

GRNSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('GRN').countDocuments();
    this.grnNumber = `GRN-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('GRN', GRNSchema);
