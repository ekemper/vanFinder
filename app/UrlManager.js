'use strict'

var Crawler = require('./Crawler.js');
var crawl = new Crawler();	

class UrlManager{

	constructor(){

		this.postUrls = [];
		this.searchResultPageUrls = [];
	}

	getSearchResultUrlSet(callback){

		/*
			we want to know all the urls of the pages we want to crawl

			in the future we can generalize the searching to any type of post in any city

			for now lets all agree that the objective is to get van search results from phoenix

			so the url is gonna be : 
		*/
		var self = this;

		var url = 'https://sfbay.craigslist.org/search/cta?&query=van';

		crawl.getSearchResultsCount(url , function(searchResultsCount){

			var numberOfPages = Math.floor(parseInt(searchResultsCount)/100);

			for (var i = 0; i < numberOfPages + 1; i++) {

				let newSearchResultUrls = url + '&s=' + i.toString() + '00';

				self.searchResultPageUrls.push(newSearchResultUrls);
			} 

			callback();

		});
	}



}

module.exports = UrlManager;