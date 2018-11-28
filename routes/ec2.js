var express = require('express');
var router = express.Router();

var ec2 = require("../controllers/ec2Controller");

router.get('/', ec2.list);

router.get('/regions', ec2.getRegions);

module.exports = router;
