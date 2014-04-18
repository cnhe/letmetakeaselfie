//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
//var auth = require('./auth.js');
var graph = require('fbgraph');
var twit = require('twit');
var dotenv = require('dotenv');
dotenv.load();

app.get('/auth/facebook', function(req, res) {
//app.get('./auth.js', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     process.env.FB_APPID
      , "redirect_uri":  process.env.FB_ROOTURL
      , "scope":         process.env.FB_SCOPE
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
     return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      process.env.FB_APPID
    , "redirect_uri":   process.env.FB_ROOTURL
    , "client_secret":  process.env.FB_APPSECRET
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/UserHasLoggedIn');
  });

  // user gets sent here after being authorized
  app.get('/UserHasLoggedIn', function(req, res) {
  res.render("index", { title: "Logged In" });
  });
});

//route files to load
var index = require('./routes/index');


//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.view);
//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});