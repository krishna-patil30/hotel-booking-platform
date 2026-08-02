if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const dbUrl = process.env.ATLASDB_URL;

//console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");//data
const path = require("path"); // views ej
const methodOverride = require("method-override");//put request

const MongoStore = require("connect-mongo");
console.log(MongoStore);


//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); //err
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');//session
const  flash = require("connect-flash"); //flash message
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
//middleware
app.engine("ejs", ejsMate);                      //layout boilerplate 
app.set("view engine", "ejs");                   //view ejs
app.set("views", path.join(__dirname, "views")); //view ejs
app.use(express.static(path.join(__dirname, "public"))); //public css
app.use(express.urlencoded({ extended: true }));  //post 
app.use(methodOverride("_method"));               //put request

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions ={
  store,
 secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7 * 24 *60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true ,
  },
};





app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();
});

app.get("/demoUser",async(req,res)=>{
let fakeUser= new User({
  email:"krishna@gamail.com",
  username:"delta-student"
});

let registeredUser= await User.register(fakeUser,"helloworld");
res.send(registeredUser);
});

//app.get("/", (req, res) => {
 //   res.send("Hi Root Node");
//});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter)

//Yeh upar ke saare routes check hone ke baad chalega.
// Saare galat routes ko catch karne ke liye
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
//  Tumhara main error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});

app.listen(8080, () => {
    console.log("Server listening on port 8080");
}); 