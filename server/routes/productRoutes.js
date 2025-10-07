const express = require('express');
const { getAllProducts, updateProduct, addProduct, deleteProduct, getAllProductsAdmin, getFlashSaleProducts, 
    getProductsByCategory, getFeaturedProducts, getProductBySlug, updateFlashsaleProducts, 
    getRelatedProducts,
    blockProduct} = require('../controllers/productController');
const upload = require('../middleware/multer');
const { authAdmin } = require('../middleware/authAdmin');

const router = express.Router();

router.route('/').get(getAllProducts)
router.route('/flashsale').get(getFlashSaleProducts)
router.route('/getProductsByCategory/:slug').get(getProductsByCategory)
router.route('/getFeatured/').get(getFeaturedProducts)
router.route('/getProductBySlug/:slug').get(getProductBySlug)
router.route('/getRelatedProducts/:slug/:limit').get(getRelatedProducts)

router.use(authAdmin);

router.route('/admin/getAllProducts').get(getAllProductsAdmin)
router.route('/admin/updateFlashsaleProducts').patch(updateFlashsaleProducts)
router.route('/admin/addProduct').post(upload.array("images", 10),addProduct)

router.route('/admin/:id').patch(upload.array("images", 10),updateProduct).post(blockProduct).delete(deleteProduct)

module.exports = router;
