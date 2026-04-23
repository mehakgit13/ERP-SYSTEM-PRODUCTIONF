const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard analytics and stats
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', protect, getDashboardStats);

module.exports = router;
