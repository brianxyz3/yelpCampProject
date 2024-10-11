const Campground = require("../models/campground");
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log('DATABASE CONNECTED');
  })
  .catch((err) => {
    console.log('ERROR OCCURRED');
    console.log(err);
  });

  const sample = array => (
    array[Math.floor(Math.random() * array.length)]
  )

  const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          author: "66e032aa19edc0963a0ee0aa",
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae omnis deserunt vero accusantium voluptates sit debitis consequuntur reiciendis qui eaque. Repellendus, cupiditate iusto explicabo nobis, provident nulla illo reprehenderit at dolor dolores, tempora atque eos officia in et corporis voluptatem eveniet architecto quis! Voluptatibus aliquid cumque nam in cupiditate!",
          price,
          geometry: {
            type: 'Point',
            coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
          },
          images: [
            {
              url: "https://res.cloudinary.com/dfrojjvhq/image/upload/v1728482697/camp1_yup72h.jpg",
              filename: "YelpCamp/camp1_yup72h",
            },
            {
              url: "https://res.cloudinary.com/dfrojjvhq/image/upload/v1728482695/camp2_sckwok.jpg",
              filename: "YelpCamp/camp2_sckwok",
            },
          ],
        });
        await camp.save()
    }
  }

  seedDB()
  .then(() =>{
    mongoose.connection.close();
  })