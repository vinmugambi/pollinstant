const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  exphbs = require('express-handlebars'),
  path = require('path'),
  passport = require("passport"),
  logger = require('morgan'),
  cookieParser=require('cookie-parser'),
  session=require("cookie-session"),
  LocalStrategy=require("passport-local").Strategy,
  User=require("./models/User"),
  config=require("./config"),
  app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// app.use(helmet());
app.disable('x-powered-by')

app.use(cookieParser());
app.use(session({keys: ["hilueWEiut0270","lwtuyquy88HYgTtwh","..."]}));
app.use(passport.initialize());
//require("./config/passport")(passport);
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(function(req, res, next){
  res.locals.user= req.user;
  next();
});
// Connect mongoose
mongoose.Promise = global.Promise;
var dbUri= process.env.MONGO_URL||"mongodb://localhost/pollista";
mongoose.connect(dbUri, function (err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  } else {
    console.log('Connection to MongoDB server has been successfully established')
  }
});
// app.use("/api", function (req, res, next) {
//   console.log(req.get("Authorization"));
//   next();
// })

require('./routes/api')(app);
require('./routes/ui')(app);
require("./routes/auth")(app);

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});
// custom 500 page
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
app.listen(app.get('port'));
console.log("Application is running on %s ",app.get('port'));
