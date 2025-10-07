const express = require('express');
const { authAdmin } = require('../middleware/authAdmin');
const { getAllDelivers, createDeliver, updateDeliver, deleteDeliver } = require('../controllers/deliverController');

const router = express.Router();

router.get('/getAllDelivers', getAllDelivers);

router.use(authAdmin);

router.post('/adminDeliver',createDeliver);
router.route("/adminDeliver/:id").patch(updateDeliver).delete(deleteDeliver);

module.exports = router;