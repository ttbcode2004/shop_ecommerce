const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist, clearWishlist } = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.route('/addWishlist').post(addToWishlist);
router.route('/getWishlist').get(getWishlist);
router.route('/deleteWishlist/:productId').delete(deleteWishlist);
router.route('/clearWishlist').post(clearWishlist);

module.exports = router;