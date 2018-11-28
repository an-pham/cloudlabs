var express = require('express');
var router = express.Router();

var ctrl = require("../../controllers/cloudwatchCtrl");

router.get('/', ctrl.listMetrics);
router.post('/metricData', ctrl.getMetricData);

module.exports = router;
