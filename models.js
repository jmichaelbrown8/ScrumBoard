var mongoose = require('mongoose');
var wagner = require('wagner-core');

module.exports = function(wagner) {
	mongoose.connect('mongodb://localhost:27017/');
	
	var PBI = mongoose.model('PBI', require('./pbi'), 'pbis');
	
	wagner.factory('PBI', function(){
		return PBI;
	});
	
	return {
		PBI: PBI
	};
};