'use strict';

function ConfirmationDao(){
	var DbResponse = require('../util/DbResponse.js');
	var Confirmation = require('../model/ConfirmationModel.js');

	/**
	* Gets a confirmation entity from the database.
	*/
	this.get = function(dbQuery, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
  			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Find Confirmation entity.
		Confirmation.findOne(dbQuery.query, function (err, confirmation) {
			var result = {};
	  		if (err){
	  			// Throw error if confirmation entity is non-existent in database.
	  			result = new DbResponse('Database query failed for query ' + dbQuery.query.toString() + '.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
		  	} 
		  	else{
		  		// Return success result if confirmation entity is found.
		  		result = new DbResponse('Confirmation found.', confirmation, DbResponse.RESPONSE_TYPE.SUCCESS);
		  	}
		  	cb(result);
		});
	}

	/**
	* Gets all confirmation entities from the database.
	*/
	this.getAll = function(cb){
		// Find all confirmation entities.
		Confirmation.find({}, function (err, confirmations) {
			var result = {}
	  		if (err){
	  			// Throw error if db communication fails.
	  			result = new DbResponse('Database connection threw error while trying to fetch all confirmation entities.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
		  	} 
		  	else{
		  		// Return success result.
		  		result = new DbResponse('All confirmation entities fetched.', confirmations, DbResponse.RESPONSE_TYPE.SUCCESS);
		  	}
		  	cb(result);
		});
	}

	/**
	* Adds a new confirmation entity to the database.
	*/
	this.add = function(confirmationData, cb){
		// If confirmation data is not provided, throw error.
		if(!confirmationData){
  			cb(new DbResponse('No confirmation data provided for add.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Create new confirmation entity.
		var confirmation = new Confirmation(confirmationData);

		// Save confirmation entity to the database.
		confirmation.save(function(err, addedConfirmation, numberAffected){
			var result = {};
			if(err){
				// Throw error if confirmation entity could not be added.
				result = new DbResponse('Could not add confirmation entity.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if confirmation entity was added to database.
				result = new DbResponse('Finished adding confirmation entity.', addedConfirmation, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}

	/**
	* Updates confirmation entity in Database.
	*/
	this.update = function(dbQuery, data, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Update confirmation entity.
		Confirmation.findOneAndUpdate(dbQuery.query, data, function(err, updatedConfirmation){
			var result = {};
			if(err){
				// Throw error is no confirmation entity was found to be update, or db communications failed.
				result = new DbResponse('Could not update confirmation entity.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if confirmation entity was updated.
				result = new DbResponse('Finished updating confirmation entity.', updatedConfirmation, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}

	/**
	* Deletes confirmation entity from Database.
	*/
	this.delete = function(dbQuery, cb){
		// If no key-value-pair is given, throw error.
		if(!dbQuery){
			cb(new DbResponse('No query parameters found.', null, DbResponse.RESPONSE_TYPE.INVALID_INPUT));
  			return;
		}

		// Remove confirmation entity.
		Confirmation.findOneAndRemove(dbQuery.query, function(err){
			var result = {};
			if(err){
				// Throw error if db communications failed.
				result = new DbResponse('Could not remove confirmation entity.', null, DbResponse.RESPONSE_TYPE.DB_CONNECTION_FAILURE);
			}
			else{
				// Return success result if confirmation entity was successfully deleted.
				result = new DbResponse('Finished deleting confirmation entity.', err, DbResponse.RESPONSE_TYPE.SUCCESS);
			}
			cb(result);
		});
	}
}

module.exports = new ConfirmationDao();