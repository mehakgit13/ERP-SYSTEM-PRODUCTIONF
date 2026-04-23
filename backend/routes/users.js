// routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, getDashboardStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/stats', authorize('admin'), getDashboardStats);
router.route('/').get(authorize('admin'), getUsers);
router.route('/:id').get(authorize('admin'), getUser).put(authorize('admin'), updateUser).delete(authorize('admin'), deleteUser);

module.exports = router;
