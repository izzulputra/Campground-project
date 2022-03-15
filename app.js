const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate =require('ejs-mate') // to layouting with ejs-mate
const {campgroundSchema, reviewSchema} = require('./schema.js'); //import schema for joi in schema.js
const catchAsync = require('./utils/catchAsync') //wrap Async
const ExpressError = require('./utils/ExpressError') //Express Error get the status dan message function
const campground = require('./models/campground');
const Review = require('./models/review')
const methodOverride = require('method-override')

const validateCampground = (req, res, next) =>{
const  {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

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

app.engine('ejs', ejsMate) // use to layouting the boilerplate
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views')) // we can call the views folder from anywhere

app.use(express.urlencoded({extended:true})); // to parse JSON
app.use(methodOverride('_method'))


// Our Homepage
app.get('/', (req,res) => {
    res.render('home') //from views folder
})

// app.get('/campground', async (req, res) => {
//     const camp = new campground({title: 'My Backyard', description: 'cheap camping'}) // call campground func to declarate a new model with new object
//     await camp.save(); // saved to database
//     res.send(camp);
// })

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', {campgrounds})
})
//order is important!! dont give the new under :id
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds',validateCampground, catchAsync (async (req,res) => { //use catch async wrapper function in utils
    //if(!req.body.campground) throw new ExpressError('Invalid campground Data', 400);

    const camp = new campground(req.body.campground) // its will work when the JSON file of the form is same like campground :{title: abc, location: abc}
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`); // to show what's going on 
}));

//for showing an show page
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id)
    res.render('campgrounds/show', {camp})
}));

//for showing an edit page
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp})
}))

app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, {...req.body.campground}) //use spread parameters, it will update inside the object
    res.redirect(`/campgrounds/${camp._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

//To add path review campground
app.post('/campgrounds/:id/reviews',validateReview, catchAsync(async(req,res)=> {
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review); // catch body of the POST body on show.ejs which the name is review
    camp.reviews.push(review); //campground with includes that review and save the id of them on campground models
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

app.all('*',(res, req, next) => {
    next(new ExpressError('Page not found!', 404))

})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', {err})// passing value of err to rendering page
     //in folder views withouth pathing
})

//create a server
app.listen(3000, ()=> {
    console.log('serving on port 3000')
})