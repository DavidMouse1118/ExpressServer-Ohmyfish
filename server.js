// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var passport	      = require('passport');
var config          = require('./config/database'); // get db config file
var User            = require('./app/models/user'); // get the mongoose model
var port            = process.env.PORT || 3000;
var jwt         = require('jwt-simple');
//var passport        = require('passport');
//var flash           = require('connect-flash');
var morgan          = require('morgan');
//var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
//var session         = require('express-session');
var methodOverride  = require('method-override');
var cors            = require('cors');
var app             = express();


mongoose.connect("mongodb://localhost/MeanMapApp");


// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
// Use the passport package in our application
app.use(passport.initialize());
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

require('./config/passport')(passport);

// required for passport
//app.use(session({ secret: 'Ohmyfishfishfish1118' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages store

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
