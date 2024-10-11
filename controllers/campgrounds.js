const Campground = require('../models/campground');
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const {cloudinary} = require('../cloudinary');


module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.createCampground = async (req, res) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {limit: 1});
  const newCampground = req.body.campground;
  newCampground.geometry = geoData.features[0].geometry;
  newCampground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  newCampground.author = req.user._id;
  // if(!newCampground) throw new ExpressError('Invalid Campground Data', 406)
  const addCampground = new Campground(newCampground);
  await addCampground.save();
  console.log(newCampground)
  req.flash("success", "Successfully added a new campground!");
  res.redirect(`/campgrounds/${addCampground._id}`);
};

module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // show campground****** console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {limit: 1});
  campground.geometry = geoData.features[0].geometry
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);
  if(req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  await campground.save();
  console.log(campground)
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to o that");
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a campground");
  res.redirect("/campgrounds");
};

module.exports.uploadImage = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);
  await campground.save();
  req.flash('success', 'Images successfully added');
  res.redirect(`/campgrounds/${campground._id}`)
}