var express = require('express');
var router = express.Router();

var ec2 = require("../../controllers/ec2Controller");


// ========= GET
// router.get('/', ec2.list);
// router.get('/regions', ec2.getRegions);
// router.get('/amis', ec2.getAMIs);
router.get('/instances', ec2.getInstances);
router.get('/instances/:instanceId/stop', ec2.stopInstance);
router.get('/instances/:instanceId/start', ec2.startInstance);

// ======= POST
router.post('/set/:region', ec2.changeRegion);
router.post('/instances/run', ec2.runInstance);

module.exports = router;
