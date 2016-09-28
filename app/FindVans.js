'use strict';

var PostManager = require('./PostManager.js');
var pm = new PostManager();
var Crawler = require('./Crawler.js');
var crawl = new Crawler();
var ElasticSearchInterface = require('./ElasticSearchInterface.js') 
var es = new ElasticSearchInterface();

class FindVans{

	constructor(){

		this.baseUrl = 'https://phoenix.craigslist.org';



	}

	getVanPosts(callback){

		this.errorArray = [];

		var self = this;

		pm.getPostsFromUrlSet(function(urls){

			console.log(' in callback for getPostsFromUrlSet : urls = ' + JSON.stringify(urls,null,4));

			var results = [];

			for (var i = 0; i < urls.length; i++) {

				let ithUrl = urls[i];

				try {

					crawl.getPostPageData(self.baseUrl + ithUrl,function(newDocument,error){

						results.push(newDocument);

						if(error){
						     self.errorArray.push(error);
						}

						es.indexNewDocument(newDocument,function(){

							if (results.length === urls.length){
								
								es.catIndices(function(indicesResp){

									callback({
										indicesResponse:indicesResp,
										results: results
									});	
								})
								
							}							
						});
					});

				}catch(error){
					console.warn('error in crawling post : ' + JSON.stringify(error));
					self.errorArray;.push({
						error:error,
						,,,
					})
				}	
			}
		})
	}

}

module.exports = FindVans;
