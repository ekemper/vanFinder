var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var Crawler = require('./app/Crawler.js');
var UrlManager = require('./app/UrlManager.js');
var ElasticSearchInterface = require('./app/ElasticSearchInterface.js');
//var PostManager = require('./app/PostManager.js');

var FindVans = require('./app/FindVans.js');



app.use(morgan('dev')); // log requests to the console

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 2222; 

var router = express.Router();

router.use(function(req, res, next) {
	next();
});
//------------------------------------------------------------
router.get('/', function(req, res) {
	res.json({ message: 'you have been routed to the root route. they are coming to get you!' });	
});
//------------------------------------------------------------
router.get('/crawl', function(req, res) {

	var crawl = new Crawler();

	var searchUrl = "https://phoenix.craigslist.org/search/cta?query=van";

	crawl.scrapeForPosts(searchUrl, function(response){

		res.json({
			note : ' this is a test of the method : crawl.scrapeForPosts()',	
			message: response 
		});	
	});
});
//------------------------------------------------------------
router.get('/get-search-url-set', function(req, res){

	var urlMan = new UrlManager();

	urlMan.getSearchResultUrlSet(function(){

		res.json({
			note: 'this is a test of the method : urlMan.getSearchResultUrlSet()',
			searchResultPageUrls: urlMan.searchResultPageUrls
		});
	})
})
//------------------------------------------------------------
router.get('/get-vanposts', function(req, res){

	var findVans = new FindVans();

	findVans.getVanPostsUrls(function(response){

		res.json({
			note : ' this is a  test : finding and indexing van posts!!',	
			message: response 
		});

	})
});
//------------------------------------------------------------
app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);


var esi = new ElasticSearchInterface();
esi.initIndex(function(indexInfoResponse){
	console.log(JSON.stringify(indexInfoResponse,null,4));
	console.log('initialised the vans index');
})

