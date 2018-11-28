var express = require('express');
var router = express.Router();

var ec2 = require("../controllers/ec2Controller");

router.get('/', ec2.list);

router.get('/regions', ec2.getRegions);
router.get('/amis', ec2.getAMIs);
router.post('/set/:region', ec2.changeRegion);
module.exports = router;
