const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Supplier name is required'], trim: true },
  email:         { type: String, lowercase: true, default: '' },
  phone:         { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  address: {
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    state:   { type: String, default: '' },
    country: { type: String, default: '' },
    zip:     { type: String, default: '' },
  },
  taxId:       { type: String, default: '' },
  paymentTerms:{ type: String, default: 'Net 30' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
