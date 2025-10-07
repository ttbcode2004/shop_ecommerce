const express = require('express');
const { createSubOrder, getAllSubOrders, updateSubOrderStatus } = require('../controllers/subOrderController');
const { authAdmin } = require('../middleware/authAdmin');
const router = express.Router();

router.route('/createSubOrder').post(createSubOrder)

router.use(authAdmin);
router.route('/admin/getAllSubOrders').get(getAllSubOrders)
router.route('/admin/upadteStatus/:orderId').patch(updateSubOrderStatus)

module.exports = router;