const express = require('express');
const catchAsync = require('../utilities/catchAsync')
const review = require('../controllers/reviews')
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');



router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(review.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.destroyReview)
);

module.exports = router;