const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { createOrder, getBuyerOrders, getMyOrders,getOrdersChat,postOrdersChat,orderAcceptByClient } = require('../controllers/orderController')
const router = express.Router();


router
    .route('/orderPlace/new')
    .post(isAuthenticatedUser, createOrder);

router
    .route('/getBuyerOrders')
    .get(isAuthenticatedUser, getBuyerOrders)

router
    .route('/getOrdersChat/')
    .get(isAuthenticatedUser, getOrdersChat)

router
    .route('/postOrdersChat/')
    .post(isAuthenticatedUser, postOrdersChat)

    router
    .route('/orderAcceptByClient/')
    .post(isAuthenticatedUser, orderAcceptByClient)







module.exports = router;