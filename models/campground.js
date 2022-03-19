const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const Review = require('./review.js')
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

// to delete reviews inside campground collections
CampgroundSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//making collection in dbs, which exported to app.js and linked to const camp in app js
module.exports = mongoose.model('Campground', CampgroundSchema);