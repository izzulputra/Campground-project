const mongoose = require('mongoose');
const Schema = mongoose.Schema; // to be shorter way

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [ // menggunakan properti reviews untuk memanggil / menghubungkan antara 2 model
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // referensi mengacu pada model/collection milik Review
        }
    ]
});

//making collection in dbs, which exported to app.js and linked to const camp in app js
module.exports = mongoose.model('Campground', CampgroundSchema);