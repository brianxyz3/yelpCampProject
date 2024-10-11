const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;


const imageSchema = new Schema({
  url: {
    type: String,
  },
  filename: {
    type: String,
  }
});

imageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON: {virtuals: true}};

const campgroundSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: [{
      type: Number,
      required: true
    }]
  },
  images: [imageSchema],
  price: {
    type: Number,
    // required: true,
  },
  description: String,
  location: {
    type: String,
    // required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
  return `
  <strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
  <p>${this.description.substring(0,25)}...
  `
})

campgroundSchema.post('findOneAndDelete', async(doc) => {
  if(doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', campgroundSchema);