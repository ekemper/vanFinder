'use strict'
var request = require('request');
var cheerio = require('cheerio');

class Crawler{
	/*
		this class meant to be used to parse posts from  a single page of craigslist restults	
	*/
	constructor(){

		this.postUrls = [];
	}

	scrapeForPosts(url, callback){

	    request(url, function(error, response, html){

	        if(error){
	            
	            throw new Error(error);

	        }else{

				var postUrls = [];

			    var $ = cheerio.load(html);

				$('.row').children().each(function(i,elem){

					var postUrl = $(this).attr("href");

					if(postUrl != null){

						postUrls.push(postUrl);			
					}
				});

				callback(postUrls);
	        }
	    });
	}

	getPostPageData(url,callback){

		var self = this;

		request(url, function(error, response, html){

	        if(error){
	           	 callback(null, error);
	        }

	        var $ = cheerio.load(html);

		    var newDocument = {
		    	url: url,
		    	id: self.getPostIdFromUrl(url),
		    	price:$('.price').html(),
		        title:$("#titletextonly").text(),
		        images:[],
		        body:$("#postingbody").text(),
		        attributes:[],
		        crawldate: Date.now()
		    };

		    $('#thumbs').children().each(function(elem){
		        newDocument.images.push( $(this).attr('href') ) ;
		    })

		    $('.attrgroup').children().each(function(elem){

		        var text = $(this).text();

		        if(text.length>0){

		            newDocument.attributes.push( text ) ;                    
		        }
		    })

		    console.log('newDocument : ' + JSON.stringify(newDocument.title,null,4));

	    	callback(newDocument);
	    })
	} 

	getPostIdFromUrl(postUrl){

		var chunks = postUrl.split("/");

		var lastChunk = chunks[chunks.length-1];

		var postId = lastChunk.split('.')[0];

		return postId;
	}



	getSearchResultsCount(url, callback){

		/*	we need to know the total number of posts in the search u
			results so that we can programmatically form the urls of all of the 
			shit to crawl 

			in the dom, the total count element looks like this:

			<span class="totalcount">2348</span>

			at , for example :  'https://'+ geoNameString +'.craigslist.org/search/cta?&query=van';
		*/

		request(url, function(error, response, html){

	        if(error){
	           throw new Error(error); 
	       
			}else{

				var $ = cheerio.load(html);

				var totalCount = $('.totalcount').first().text();

			    callback(totalCount);
			}    
		});	    
	}
}


module.exports = Crawler;	