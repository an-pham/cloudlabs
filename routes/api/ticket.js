var express = require('express');
var router = express.Router();
var mongoclient = require('mongodb').MongoClient;

// ========= GET the list of all available tickets

router.get('/', function(req, res) {

	mongoclient.connect("mongodb://database:27017/MyDb", function(err, db) {

		if (err) throw err;

		//Write databse Insert/Update/Query code here..


		db.collection('Tickets').find({}).toArray(function(err, docs) {
			res.status(200).send({ data: docs });
		});



		// db.collection('Tickets', function(err, collection) {

		// 	collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
		// 	collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
		// 	collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });


		// 	db.collection('Persons').count(function(err, count) {
		// 		if (err) throw err;

		// 		console.log('Total Rows: ' + count);
		// 	});
		// });
	});

});

router.get('/:id', function(req, res) {


});

// ========== Create a new ticket objet ========
router.post('/', function(req, res) {

});


router.get('/search/:term', function(req, res) {

});

module.exports = router;