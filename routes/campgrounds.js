const express = require('express');
const router = express.Router();
const multer  = require('multer');
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const catchAsync = require('../utilities/catchAsync')
const campground = require('../controllers/campgrounds')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


router
  .route('/')
  .get(catchAsync(campground.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground));

router.get("/new", isLoggedIn, campground.newForm);

router
  .route("/:id")
  .get(catchAsync(campground.showCampground))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.destroyCampground));

router.route("/:id/images").put(isLoggedIn, upload.array('image'), catchAsync(campground.uploadImage));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.editForm)
);

module.exports = router;