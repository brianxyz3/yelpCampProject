const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = req.body.review;
  const newReview = new Review(review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await newReview.save();
  await campground.save();
  req.flash("success", "Added new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  console.log("Deleted Reviews in deleted Campground");
  req.flash("success", "Deleted review!");
  res.redirect(`/campgrounds/${id}`);
};