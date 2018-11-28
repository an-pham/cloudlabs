var express = require('express');
var AWS = require('aws-sdk');
// var uuid = require('uuid');

// var app = express();
var cloudwatch = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
exports.listMetrics = function(req, res) {
  var params = {
    "Dimensions": [{
      "Name": "InstanceId",
      "Value": "i-09f6ae8a8482bc4f1"
      // i-06092806e9029b778
      // i-0e3ca7d6613a1609a
    }],
    // MetricName: 'STRING_VALUE',
    Namespace: 'AWS/EC2',
    // NextToken: 'STRING_VALUE' // receive from last call
  };
  cloudwatch.listMetrics(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      res.status(200).send({
        count: data.Metrics.length,
        // for showing on UI
        allMetrics: data.Metrics.map(function(val, i) { return val.MetricName; }),
        data: data
        /*
        "allMetrics": [
	        "DiskReadBytes",
	        "CPUUtilization",
	        "NetworkIn",
	        "NetworkPacketsOut",
	        "NetworkOut",
	        "DiskWriteBytes",
	        "DiskWriteOps",
	        "NetworkPacketsIn",
	        "DiskReadOps",
	        "StatusCheckFailed",
	        "StatusCheckFailed_System",
	        "StatusCheckFailed_Instance",
	        "CPUSurplusCreditsCharged",
	        "CPUCreditBalance",
	        "CPUCreditUsage",
	        "CPUSurplusCreditBalance"
	    ],
	    */
      });
    }
  });
};


