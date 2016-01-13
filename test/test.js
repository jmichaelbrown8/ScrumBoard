var assert = require('assert');
var pbiSchema = require('../pbi');
var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3000';

describe('Schemas', function(){
	var PBI = mongoose.model('PBI', pbiSchema)
	
	describe('PBI', function() {
    
		it('has a "what" column', function() {
		  var pbi = new PBI({ what: 'some item' });

		  assert.equal(pbi.what, 'some item');
		  
		});
		
		it('has an order of -1 if not specified', function() {
		  var pbi = new PBI({ what: 'some item' });

		  assert.equal(pbi.order, -1);
		  
		});
		
		it('has an array of acceptance criteria', function() {
		  var pbi = new PBI({ what: 'some item' });

		  assert.equal(pbi.acceptanceCriteria.length, 0);
		  
		});
  });
	
});

describe('APIs', function(){
	var server;
	var PBI;
	var api;
	
	before(function() {
		var app = express();
		
		// Bootstrap server
		models = require('../models')(wagner);
		api = require('../api')(wagner);
		app.use(api);
		server = app.listen(3000);
		
		// Make PBI model available in tests
		PBI = models.PBI;
	});
	
	after(function() {
		server.close();
	});
	
	beforeEach(function(done) {
		// Make sure PBIs are empty before each test
		PBI.remove({}, function(error) {
			assert.ifError(error);
			done();
		});
	});
	describe('PBI', function(){
		it('returns a list when user goes to /pbis', function(done) {
			//Create two PBIs
			PBI.create({ what: 'some item' }, function(error, doc){
				assert.ifError(error);
				PBI.create({ what: 'some other item' }, function(error, doc){
					var url = URL_ROOT + '/pbis';
					superagent.get(url, function(error, res) {
						assert.ifError(error);
						assert.equal(res.status, 200);
						assert.equal(JSON.parse(res.text).pbis.length, 2);
						done();
					});
					
					
				});
			});
		});
		
		it('creates a PBI when user posts to /pbi', function(done) {
			var url = URL_ROOT + '/pbi';
			superagent.post(url) 
				.send({what: 'create item'})
				.end(function(error, res) {
					assert.ifError(error);
					assert.equal(res.status, 200);
					
					// check that it made it to the mongodb
					PBI.findOne({_id: res.body._id}).exec(function(error, res) {
						assert.ifError(error);
						assert.equal(res.what, 'create item');
						done();
					});
				});
			
		});
		
		it('updates a PBI when user posts to /pbi/:id', function(done){
			// create some item
			PBI.create({ what: 'some item'}, function(error, doc){
				assert.ifError(error);
				// update item
				var url = URL_ROOT + '/pbi/' + doc._id;
				superagent.post(url)
					.send({what: 'updated item'})
					.end(function(error, res) {
						assert.ifError(error);
						assert.equal(res.status, 200);
						
						// check that it made the change
						PBI.findOne({_id: doc._id}).exec(function(error, res) {
							assert.ifError(error);
							assert.equal(res.what, 'updated item');
							done();
						});
					});
			});
		});
		
		it ('deletes a PBI when DELETE to /pbi/:id', function(done) {
			// create some item
			PBI.create({ what: 'some item' }, function(error, doc){
				assert.ifError(error);
				// verify there is one PBI
				PBI.find({}).exec(function(error, res) {
					assert.ifError(error);
					assert.equal(res.length, 1);
					// delete the PBI
					var url = URL_ROOT + '/pbi/' + doc._id;
					superagent.del(url, function(error, res){
						assert.ifError(error);
						assert.equal(res.status, 200);
						// verify there is no PBI left
						PBI.find({}).exec(function(error, res) {
							assert.ifError(error);
							assert.equal(res.length, 0);
							done();
						});
					});
				});
			});
		});
		
	});	
	
});