const mongoose = require('mongoose');
const campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities')


mongoose.connect('mongodb://localhost:27017/camping', {
    useNewUrlParser: true, // version 6++ is no longer necessary
    useUnifiedTopology: true // its too
});

//test theese connections
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected");
});
const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i=0; i<50 ; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})