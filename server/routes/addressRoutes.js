const express = require('express');
const { getAllAddress, addAddress, deleteAddress, editAddress, updateDefault } = require('../controllers/addressController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.route('/').get(getAllAddress).post(addAddress);
router.route('/:index').delete(deleteAddress).patch(editAddress).post(updateDefault)
module.exports = router;