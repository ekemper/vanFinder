'use strict';
var UrlManager = require('./UrlManager.js');
var urlMan = new UrlManager();
var Crawler = require('./Crawler.js');
var crawl = new Crawler();
class PostManager {

	constructor(){
	}

	getPostUrlsFromUrlSet(callback){

		urlMan.getSearchResultUrlSet(function(){

			var responseArray = [];
			var responseIndex = 0;

			var urlsArray = urlMan.searchResultPageUrls;

			for (var i = 0; i < urlsArray.length; i++) {
				let ithUrl = urlsArray[i];

				crawl.scrapeForPosts(ithUrl, function(response){

					responseIndex += 1;

					responseArray = responseArray.concat(response);

					if(responseIndex === urlsArray.length){

						callback(responseArray);
					}	
				});
			}			
		});
	}
}

module.exports = PostManager;	