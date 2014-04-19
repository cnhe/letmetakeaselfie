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

var t = new twit({
    consumer_key:         process.env.TWIT_CONKEY
  , consumer_secret:      process.env.TWIT_CONSECRET
  , access_token:         process.env.TWIT_ACCESSTOKEN
  , access_token_secret:  process.env.TWIT_ACCESSSECRET
});

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//route files to load
var index = require('./routes/index');
//var loggedin = require('./routes/loggedin');

exports.graph = graph;
exports.twit = twit;

t.get('search/tweets', { q: '#selfie', count: 10 }, function(err, reply) {
  //console.log(reply);
})

app.get('/auth/facebook', function(req, res) {
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
		} 
		else {  //req.query.error == 'access_denied'
			res.send('access denied');
		}

		console.log("return? also what is code");
		console.log(req.query.code);

		return;
	}

	console.log(req.query.code);
	// code is set
	// we'll send that and get the access token
	graph.authorize({
		"client_id":      process.env.FB_APPID
		, "redirect_uri":   process.env.FB_ROOTURL
		, "client_secret":  process.env.FB_APPSECRET
		, "code":           req.query.code
	}, function (err, facebookRes) 
	{
		console.log("login success?");
		res.redirect('/loggedin');
	});
});

console.log("access token");
console.log(graph.getAccessToken());

app.get('/test', function(req,res) { 
	graph.get('/me', function(err,response) { console.log(response); res.render('index')}); });

app.get('/loggedin', function(req, res){
	res.render("index", {title: "Logged in"})
});

  graph.get('/me/likes', function(req, res){
	console.log(res);
  });

  graph.get("zuck", function(err, res){
  		console.log(res);
  	});

//routes
app.get('/', index.view);
//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});