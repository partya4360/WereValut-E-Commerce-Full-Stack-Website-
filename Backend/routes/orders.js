const express = require('express');
const { protect } =require('../middlewere/auth');
const { admin } = require('../middlewere/admin');
const { createOrder, getOrders,myOrders, updateOrderStatus} = require('../controllers/orders');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, myOrders)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;