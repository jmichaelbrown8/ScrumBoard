var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
	var api = express.Router();
	
	api.use(bodyparser.json());
	
	// read list
	api.get('/pbis', wagner.invoke(function(PBI){
		return function(req, res) {
			PBI.find({})
				.sort({ order: 1 })
				.exec(function(error, pbis){
					if (error) {
						return res
							.status( status.INTERNAL_SERVER_ERROR )
							.json({error: error.toString() });
					}
					if (!pbis) {
						return res
							.status( status.NOT_FOUND )
							.json( {error: 'Not found'} );
					}
					res.json( {pbis: pbis} );
				});
		};
	}));
	
	// create pbi
	api.post('/pbi', wagner.invoke(function(PBI){
		return function(req, res) {
			PBI.create(req.body, function(error, doc) {
					if (error) {
						return res
							.status( status.INTERNAL_SERVER_ERROR )
							.json({error: error.toString()});
					}
					if (!doc) {
						return res
							.status( status.INTERNAL_SERVER_ERROR )
							.json({error: 'no PBI created'});
					}
					res.json(doc);
				});
		};
	}));
	
	// update pbi
	api.post('/pbi/:id', wagner.invoke(function(PBI){
		return function(req, res) {
			PBI.findByIdAndUpdate(req.params.id, req.body, function(error, obj){
				if (error) {
					return res
						.status( status.INTERNAL_SERVER_ERROR )
						.json( {error: error.toString()} );
				}
				if (!obj) {
					return res
						.status( status.INTERNAL_SERVER_ERROR )
						.json( {error: 'no PBI returned'} );
				}
				res.json(obj);
			});
		};
	}));
	
	// delete pbi
	api.delete('/pbi/:id', wagner.invoke(function(PBI){
		return function(req, res) {
			PBI.find({_id: req.params.id}).remove(function(error, obj) {
				if (error) {
					return res
						.status( status.INTERNAL_SERVER_ERROR )
						.json({error: error.toString()});
				}
				if (!obj) {
					return res
						.status( status.NOT_FOUND )
						.json({error: 'not found'});
				}
				res.json(obj)
			});
		};
	}));
	
	return api;
};