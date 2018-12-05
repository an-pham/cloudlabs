var express = require('express');
var router = express.Router();
var mongoclient = require('mongodb').MongoClient;

// ========= GET the list of all available tickets

router.get('/', function(req, res) {

	mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {

		if (err) {
			// throw err;
			res.status(500).send({ err: err });
			return;
		}

		//Write databse Insert/Update/Query code here..

		db.collection('Tickets').find({}).toArray(function(err, docs) {
			res.status(200).send({ data: docs, count: docs.length });
		});

	});

});

router.get('/:id', function(req, res) {
	mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
		if (err) {
			// throw err;
			res.status(500).send({ err: err });
			return;
		}

		db.collection('Tickets').find({ _id: req.params.id }).toArray(function(err, docs) {
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

	mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
		if (err) {
			res.status(500).send({ err: err });
			return;
		}

		db.collection('Tickets', function(err, collection) {
			collection.insert({
				reporter: reporter,
				title: title,
				description: description,
				category: category,
				relatedFeature: relatedFeature,
				department: department
			}, function(err, result) {
				if (err) res.status(500).send({ err: err });
				else res.status(200).send({ result: result.result, ops: result.ops, count: result.result.length });
			});

		});
	});
});


router.get('/search/:term', function(req, res) {
	mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {
		if (err) throw err;
		var query = { $or: [
			{ title: { $regex: ".*" + req.params.term + ".*" } },
			{ description: { $regex: ".*" + req.params.term + ".*" } }
		]};

		db.collection('Tickets').find(query).toArray(function(err, docs) {
			if (err) res.status(400).send({ data: err });
			else res.status(200).send({ data: docs, count: docs.length });
		});
	});


});

module.exports = router;