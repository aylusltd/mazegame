var redis = require('redis').createClient();

var Model = {};

Model.set= function(key, value, cb){
	redis.set(key, JSON.stringify(value));
	return typeof cb == 'function' ? cb() : null;
}

Model.get = function(key, cb){
	var obj = {};



	return typeof cb == 'function' ? cb() : null;
}