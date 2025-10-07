const express = require('express');
const { createOrder, getUserOrders, clearUserOrders, updatePaymentOrder, getAllOrders, updateOrderStatus, updateOrderReviewProduct, clearOrders, updateOrderStateUser, updateOrderReturnState, } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const { authAdmin } = require('../middleware/authAdmin');
const router = express.Router();

router.route('/updatePayment/:id').post(updatePaymentOrder)

router.use(auth);

router.route('/user').get(getUserOrders).delete(clearUserOrders).post(createOrder)
router.patch('/userUpdate/:orderId', updateOrderStateUser)
router.patch('/userReturn/:orderId/:itemId', updateOrderReturnState)
router.patch('/userReview/:orderId', updateOrderReviewProduct)

router.use(authAdmin);

router.route('/admin/getAllOrders').get(getAllOrders)
router.route('/admin/upadteStatus/:orderId').patch(updateOrderStatus)
router.route('/admin/clearOrders').delete(clearOrders)

module.exports = router;