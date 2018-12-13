var express = require('express');
var router = express.Router();
var mongoclient = require('mongodb').MongoClient;
var randomstring = require("randomstring");
var Q = require("q");
var app = express();

// ========= GET the list of all available tickets

router.get('/', function(req, res) {

	// mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
	conn('Tickets').then(function(collection) {

		// if (err) {
		// 	// throw err;
		// 	res.status(500).send({ err: err });
		// 	return;
		// }

		//Write databse Insert/Update/Query code here..

		collection.find({}).toArray(function(err, docs) {
			res.status(200).send({ data: docs, count: docs.length });
		});

	}).fail(function(err) {
		// If Error accrued. 
		console.log("Create connection error: " + err);
	});

});

router.get('/:id', function(req, res) {
	// mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
	conn('Tickets').then(function(collection) {
		// if (err) {
		// 	// throw err;
		// 	res.status(500).send({ err: err });
		// 	return;
		// }

		collection.find({ id: req.params.id }).toArray(function(err, docs) {
			if (err) res.status(400).send({ err: err });
			else res.status(200).send({ data: docs, count: docs.length });
		});
	});

});

// ========== Create a new ticket objet ========
router.post('/', function(req, res) {
	var reporter = req.body['reporter'];
	var title = req.body['title'];
	var description = req.body['description'];
	var category = req.body['category'];
	var relatedFeature = req.body['feature'];
	var department = req.body['department'];
	var ticketId = randomstring.generate({
		length: 6,
		charset: 'abcdefghijklmnopqrstuvxyz1234567890'
	});

	// mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
	conn('Tickets').then(function(collection) {
		// if (err) {
		// 	res.status(500).send({ err: err });
		// 	return;
		// }

		// db.collection('Tickets', function(err, collection) {
		collection.insert({
			id: ticketId,
			reporter: reporter,
			title: title,
			description: description,
			category: category,
			relatedFeature: relatedFeature,
			department: department,
			createdAt: new Date
		}, function(err, result) {
			if (err) res.status(500).send({ err: err });
			else res.status(200).send({ result: result.result, ops: result.ops, count: result.result.length });
		});
		// });
	});
});


router.get('/search/:term', function(req, res) {
	// mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
	conn('Tickets').then(function(collection) {
		// if (err) throw err;
		var query = {
			$or: [
				{ title: { $regex: ".*" + req.params.term + ".*" } },
				{ description: { $regex: ".*" + req.params.term + ".*" } }
			]
		};

		// db.collection('Tickets')

		collection.find(query).toArray(function(err, docs) {
			if (err) res.status(400).send({ data: err });
			else res.status(200).send({ data: docs, count: docs.length });
		});

	}).fail(function(err) {
		// If Error accrued. 
		console.log("Create connection error: " + err);
	});

});

function conn(collectionName) {
	var deferred = Q.defer();
	var collection = app.get(collectionName);
	var db = app.get("dbConn");

	if (!db) {
		mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
			if (err) {
				deferred.reject(new Error(err));
			} else {
				collection = db.collection(collectionName);
				app.set("dbConn", db);
				app.set(collectionName, collection);
	            deferred.resolve(collection);

				// deferred.resolve(db.collection(collectionName));
			}
		});
	} else {
		// var collection = db.collection(collectionName);
		deferred.resolve(collection);
	}

	return deferred.promise;
}

module.exports = router;
