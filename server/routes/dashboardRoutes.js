const express = require('express');
const { getDashboardOverview, getRevenueByMonth, getOrdersOverview, getOrdersRevenueByMonth, getProductsOverview, getProductsData, getTopSellingProducts, getUsersOverview, getNewUsersByMonth, getTopCustomers, getReviewsOverview, getVouchersOverview, getFullReport } = require('../controllers/dashboardController');
const { authAdmin } = require('../middleware/authAdmin');
const router = express.Router();

router.use(authAdmin);

router.get("/overview", getDashboardOverview)
router.get("/ordersOverview", getOrdersOverview)
router.get("/productsOverview", getProductsOverview)
router.get("/productsData", getProductsData)
router.get("/topSellingProducts", getTopSellingProducts)
router.get("/usersOverview", getUsersOverview)
router.get("/newUsersByMonth", getNewUsersByMonth)
router.get("/topUsers", getTopCustomers)
router.get("/reviewsOverview", getReviewsOverview)
router.get("/vouchersOverview", getVouchersOverview)

router.get("/revenueByMonth", getRevenueByMonth)
router.get("/ordersRevenueByMonth", getOrdersRevenueByMonth)

router.get("/getFullReport", getFullReport)

module.exports = router;