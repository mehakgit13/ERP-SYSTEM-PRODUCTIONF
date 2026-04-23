const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (paginated, searchable)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: lowStock
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: List of products }
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     responses:
 *       201: { description: Product created }
 */
router.route('/')
  .get(getProducts)
  .post(authorize('admin', 'inventory'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'inventory'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

module.exports = router;
