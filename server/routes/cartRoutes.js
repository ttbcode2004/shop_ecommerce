const express = require('express');
const { addToCart, getCart, updateCartItem, clearCart, deleteCartItem, getCartNotUser } = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.route('/getCartNotUser').post(getCartNotUser)

router.use(auth);
router.route('/userCart').get(getCart).post(addToCart).patch(updateCartItem);
router.route('/userDeleteCart/:cartId').delete(deleteCartItem);
router.route('/clear').post(clearCart)

module.exports = router;