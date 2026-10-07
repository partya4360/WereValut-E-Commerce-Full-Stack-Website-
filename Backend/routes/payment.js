const express = require('express');
const {createdOrder, varifyPayment} = require('../controllers/payment');
const { verify } = require('jsonwebtoken');
const router = express.Router();

router.post("/order",createdOrder );
router.post("/verify", varifyPayment);

module.exports = router;