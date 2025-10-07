const express = require('express');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.route('/addReview').post(createReview)
router.route('/:id').get(getProductReviews)

module.exports = router;