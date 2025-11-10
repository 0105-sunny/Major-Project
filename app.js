
if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

const faker = require("@faker-js/faker");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // it helps to create templates and layouts S7
const session = require('express-session');  // it define or provide a user session 
const flash  = require("connect-flash"); // it is used flash a pop up message sinlge time 
const passport  = require("passport");   
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 

//code for map
const fetch = require("node-fetch");
const MongoStore = require('connect-mongo');
const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY;

// maping code 
app.use((req, res, next) => {
  res.locals.MAPTILER_KEY = process.env.MAPTILER_KEY;
  next();
});

 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method")); //Middleware to override the mathod
app.use(express.urlencoded({extended:true})); //used to pasre the data

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then((res) => {
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});

// app.get("/", (req, res,) => {
//     res.send("hi i am root");
// });
const Store = MongoStore.create ({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET ,
  },
  touchAfter: 24*3600 //updating feature in secs 

});
 
Store.on("error", () => {
  console.log("error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    Store,
    secret: process.env.SECRET ,
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() +7*24*60*60*1000,  //time in milisec
        maxage:7*24*60*60*1000,
        httpOnly: true,
    }
}; 


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


//to serialize users into the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
})
 

//  all /listings routes
app.use("/listings", listingsRouter);
 
//  all /reviews routes
app.use("/listings/:id/reviews", reviewsRouter);

// all users route
app.use("/", userRouter);

app.get("/geocode", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query required" });

  const apiUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Geocode error:", err);
    res.status(500).json({ error: "Failed to fetch geocode data" });
  }
});

app.use((err, req, res, next) => {
    let{ statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
});
 
app.listen(8080, () => {  
    console.log("server is listing to port 8080")
});