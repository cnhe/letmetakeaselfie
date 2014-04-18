//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

//route files to load
var index = require('./routes/index');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

 // get FB authorization url
    var authUrl = graph.getOauthUrl({
        "client_id":     dotenv.FB_APPID
      , "redirect_uri":  dotenv.ROOT_URL
    });

    // shows dialog
    res.redirect(authUrl);

    // after user click, auth `code` will be set
    // we'll send that and get the access token
    graph.authorize({
        "client_id":      dotenv.FB_APPID
      , "redirect_uri":   dotenv.ROOT_URL
      , "client_secret":  dotenv.FB_APPSECRET
      , "code":           req.query.code
    }, function (err, facebookRes) {
      res.redirect('/loggedIn');
    });

var options = {
	timeout:  3000
	, pool:     { maxSockets:  Infinity }
	, headers:  { connection:  "keep-alive" }
};

graph
  .setOptions(options)
  .get("zuck", function(err, res) {
    console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
  });

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