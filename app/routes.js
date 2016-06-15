// Dependencies
var express         = require('express');
var mongoose        = require('mongoose');
var app             = express();
var jwt             = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Operationlog    = require('./model.js');
var User            = require('./models/user.js');
var router          = express.Router();
// Opens App Routes
module.exports = function(app, passport) {
    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.set('superSecret', 'ohmyfishfishfish1118');//Sercet variable

    router.route("/signup")
      .post(function(req, res) {
      if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
      } else {
        var newUser            = new User();
                // set the user's local credentials
        newUser.name    = req.body.name;
        newUser.password = newUser.generateHash(req.body.password);
        // save the user
        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, msg: 'Username already exists.'});
          }
          res.json({success: true, msg: 'Successful created new user.'});
        });
      }
    });

    router.route("/authenticate")
      .post(function(req, res) {
      User.findOne({
        name: req.body.name
      }, function(err, user) {
        if (err) throw err;

        if (!user) {
          res.status(400).json({"error": "Authentication failed. User not found."});
          //res.send({success: false, msg: 'Authentication failed. User not found.'});
        }
        else if(!user.validPassword(req.body.password)){
          res.status(400).json({"error": "Authentication failed. Wrong password."});
          //res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
        else{
          // check if password matches
              // if user is found and password is right create a token
            //  var expires = expiresIn(60); // 60S
              var token = jwt.sign(user, app.get('superSecret'), { expiresIn: '1h' });
              // return the information including token as JSON
              res.json({success: true, token: token, userID: user._id, userName:user.name});
            }
          });
    });

    //Route Middleware to Protect API Routes

  router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['ohmyfish-ticket'];

    console.log(token);
      if(token){
        //
        jwt.verify(token, app.get('superSecret') ,function(err, decoded){
          if(err){
            return res.json({ success: false, message: 'Failed to authenticate token.' });
          } else{
            req.decoded = decoded;
            next();
          }
        });


      } else{
        return res.status(403).json({
          success: false,
          message :'No token provided.'
        });
      }
  });

    router.route("/operationlog")
        .get(function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Operationlog.find({});
        query.exec(function(err, operationlog){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(operationlog);
        });
    })
    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    .post(function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newoperationlog = new Operationlog(req.body);

        // New User is saved in the db.
        newoperationlog.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
    router.route("/operationlog/:userId")
      .get(function(req, res){
        if (req.params.userId) {
        Operationlog.find({ userId: req.params.userId }, function (err, operationlog) {
          if(err)
              res.send(err);

            res.json(operationlog);
        });
      }
    });

    router.route("/operationlog/user/:logId")
      .get(function(req, res){
        if (req.params.logId) {
        Operationlog.find({ _id : req.params.logId }, function (err, operationlog) {
          if(err)
              res.send(err);

            res.json(operationlog);
        });
      }
    });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    router.route("/query/")
      .post(function(req, res){

      // Grab all of the query parameters from the body.
      var lat             = req.body.latitude;
      var long            = req.body.longitude;
      var distance        = req.body.distance;
      var fishName        = req.body.fishName;
      var fishTotalWeight = req.body.fishTotalWeight;
      var fishCount       = req.body.fishCount;
      var userId          = req.body.userId;

      // Opens a generic Mongoose Query. Depending on the post body we will...
      var query = Operationlog.find({});

      // ...include filter by Max Distance (converting miles to meters)
      if(distance){

        // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
        query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

        // Converting meters to miles. Specifying spherical geometry (for globe)
        maxDistance: distance * 1609.34, spherical: true});
      }

      // ...include filter by fishName
      if(fishName){
        query = query.where('fishName').equals(fishName);
      }

      // ...include filter by fishTotalWeight
      if(fishTotalWeight){
        query = query.where('fishTotalWeight').gte(fishTotalWeight);
      }

      // ...include filter by fishCount
      if(fishCount){
        query = query.where('fishCount').gte(fishCount);
      }

      // ...include filter by userId
      if(userId){
        query = query.where('userId').ne(userId);
      }

      // Execute Query and Return the Query Results
      query.exec(function(err, operationlog){
        if(err)
        res.send(err);

        // If no errors, respond with a JSON of all users that meet the criteria
        res.json(operationlog);
      });
    });


    app.use('/',router);// do not miss this line using the

};
