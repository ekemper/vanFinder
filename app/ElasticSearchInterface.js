'use strict';

var request = require('request');

class ElasticSearchInterface {

	constructor(){
	}

	call(url, verb, data, callback){

		request({
		    url:url, 
		    method: verb,
		    json: data
		    
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
		        callback({
		        	error:error,
		        	statusCode:response.statusCode, 
		        	body:body
		        })
			}
		});
	}

	indexNewDocument(data,callback){
		
		var verb = "POST";

		var url = "http://localhost:9200/customer/external?pretty' -d '" + data;

		this.call(url, verb, data, function(responseObject){

			callback(responseObject);
		})
	}

	getIndexInfo(indexName, callback){
		
		var verb = "GET";
		var data = {};
		var url = "http://localhost:9200/" + indexName;

		this.call(url, verb, data, function(responseObject){

			callback(responseObject);
		})
	}

	deleteIndex(indexName, callback){
		
		var verb = "DELETE";
		var data = {};
		var url = 'http://localhost:9200/'+indexName+'/';

		this.call(url, verb, data, function(responseObject){

			callback(responseObject);
		})
	}

	createIndex(indexName, callback){
		
		var verb = "PUT";
		var data = {};
		var url = 'http://localhost:9200/'+indexName+'/';

		this.call(url, verb, data, function(responseObject){

			callback(responseObject);
		})
	}


	initIndex(callback){
		var indexName = 'vanposts';
		var self = this;
		self.deleteIndex(indexName,function(){
			self.createIndex(indexName,function(){
				self.getIndexInfo(indexName, function(getIndexInfoResponse){
					callback(getIndexInfoResponse);
				});
			});
		});
	}


}

module.exports = ElasticSearchInterface;


