var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.get('/', function(req, res) {
   res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = router;
