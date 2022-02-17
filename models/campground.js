const mongoose = require('mongoose');
const Schema = mongoose.Schema; // to be shorter way

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

//making collection in dbs, which exported to app.js and linked to const camp in app js
module.exports = mongoose.model('Campground', CampgroundSchema);