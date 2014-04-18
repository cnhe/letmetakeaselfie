//load environment variables
var dotenv = require('dotenv');
dotenv.load();

/*//add instagram api setup
var ig = require('instagram-node-lib');
ig.set('client_id', process.env.instagram_client_id);
ig.set('client_secret', process.env.instagram_client_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;*/

//add fbgraph
var graph = require('fbgraph');
graph.set('client_id', process.env.FB_APPID);
graph.set('client_secret', process.env.FB_APPSECRET);

var twit = require('twit');
twit.set('client_id', process.env.TWITTER_APPID);
twit.set('client_secret', process.env.TWITTER_APPSECRET);

exports.graph = graph;
exports.twit = twit;