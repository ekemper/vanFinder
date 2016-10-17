'use strict';

var PostManager = require('./PostManager.js');
var pm = new PostManager();
var Crawler = require('./Crawler.js');
var crawl = new Crawler();
var ElasticSearchInterface = require('./ElasticSearchInterface.js') 
var es = new ElasticSearchInterface();

var jsonfile = require('jsonfile');

class FindVans{

	constructor(){

		this.baseUrl = 'https://sfbay.craigslist.org';

		this.errorFilePath = __dirname + '/errorFile.json';

	}

	getVanPostsUrls(callback){

		this.errorArray = [];

		var self = this;

		pm.getPostUrlsFromUrlSet(function(urls){

			console.log(' in callback for getPostsFromUrlSet : urls.length = ' + urls.length);

			self.getPostsDataFromUrls(urls, callback);
		});
	}


	handleNewPostDocument(newDocument, error, callback){

		var self = this;

		if(error){
		    console.log('error in crawling post : ' + JSON.stringify(error));
			self.errorArray.push({
				error:error,
				message:'could not parse page',
				url:ithUrl
			})
		}

		if(newDocument !== null){

			self.results.push(newDocument);

			console.log('newDocument : ' + JSON.stringify(newDocument.title,null,4));

			es.indexNewDocument(newDocument,function(){

				if (self.results.length === self.urls.length){
					
					self.cleanUp(callback);
				}							
			});
		}else{
			console.log('newDocument is null');
			self.errorArray.push({
				error:'newDocument is null',
				message:'could not parse page',
				url:ithUrl
			})
		}	

		console.log("self.results.length : " + self.results.length);
		console.log("self.errorArray.lengh : " + self.errorArray.length);

		callback();
	}	

	getPostsDataFromUrls(urls, callback){

		this.urls = urls;

		var self = this;
		self.results = [];
		self.errorArray = [];
		self.index = 0;

		function getNext(){

			console.log('------------------------');
		 	console.log('self.index = ' + self.index);

			crawl.getPostPageData(self.baseUrl + urls[self.index] ,function(newDocument, error){

				self.handleNewPostDocument(newDocument, error, function(){
					
					if(self.index == self.urls.length-1){
						callback();
					}else{
						self.index += 1;
						getNext();						
					}



				});
			});	
		}

		getNext();
	}	

	cleanUp(callback){

		es.catIndices(function(indicesResp){

			jsonfile.writeFile(self.errorFilePath, self.errorArray, function (err) {
			  	if(error){
			  		throw new Error(error);
			  	}

				callback({
					indicesResponse:indicesResp,
					results: results
				});
			})
		});
	}

}

module.exports = FindVans;
