const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title:        { type: String, required: [true, 'Product title is required'], trim: true },
  sku:          { type: String, required: [true, 'SKU is required'], unique: true, uppercase: true },
  description:  { type: String, default: '' },
  category:     { type: String, required: true },
  price:        { type: Number, required: true, min: 0 },
  costPrice:    { type: Number, default: 0, min: 0 },
  stock:        { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10 },
  unit:         { type: String, default: 'pcs' },
  imageUrl:     { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

// Virtual: stock status
ProductSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.reorderLevel) return 'low_stock';
  return 'in_stock';
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
