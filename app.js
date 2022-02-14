const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campground = require('./models/campground');


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

const app = express(); // to be short

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views')) // we can call the views folder from anywhere

// Our Homepage
app.get('/', (req,res) => {
    res.render('home') //from views folder
})

app.get('/campground', async (req, res) => {
    const camp = new campground({title: 'My Backyard', description: 'cheap camping'}) // call campground func to declarate a new model with new object
    await camp.save(); // saved to database
    res.send(camp);

})
//making a server
app.listen(3000, ()=> {
    console.log('serving on port 3000')
})