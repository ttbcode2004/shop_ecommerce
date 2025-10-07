const express = require('express');
const { createVoucher, getAllVouchers, getVoucherByCode, updateVoucher, applyVoucher, deleteVoucher, getAllVouchersByUser } = require('../controllers/voucherController');
const { auth } = require('../middleware/auth');
const { authAdmin } = require('../middleware/authAdmin');

const router = express.Router();

router.use(auth);

router.get('/getVouchersByUser', getAllVouchersByUser);
router.post("/applyVoucher", applyVoucher);

router.use(authAdmin);

router.get('/getVouchers', getAllVouchers);
router.post('/adminVoucher',createVoucher);
router.route("/adminVoucher/:id").patch(updateVoucher).delete(deleteVoucher);
router.get("/vouchers/code/:code", getVoucherByCode);

module.exports = router;