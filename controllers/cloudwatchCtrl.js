var express = require('express');
var AWS = require('aws-sdk');
var randomstring = require("randomstring");

// var app = express();
var cloudwatch = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
const DEFAULT_INSTANCE = 'i-09f6ae8a8482bc4f1';

// To get list of all available metrics
exports.listMetrics = function(req, res) {
  var params = {
    Dimensions: [{
      Name: 'InstanceId',
      Value: 'i-09f6ae8a8482bc4f1'
      // i-06092806e9029b778
      // i-0e3ca7d6613a1609a
    }],
    // MetricName: 'STRING_VALUE',
    Namespace: 'AWS/EC2',
    // NextToken: 'STRING_VALUE' // receive from last call
  };
  cloudwatch.listMetrics(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else {
      // console.log(data); // successful response
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

// To get metric data of specific metrics and instance
exports.getMetricData = function(req, res) {
  var instances = req.body.instanceIds || [DEFAULT_INSTANCE];
  var metrics = req.body.metrics || ['NetworkIn'];
  // var label = req.body.label || 'Default';

  var dimensionArr = instances.map(function(value, i) { return { Name: "InstanceId", Value: value }; });
  var metricDataQueries = metrics.map(function(value, i) {
    return {
      Id: randomstring.generate({
        length: 8,
        charset: 'abcdefghijklmnopqrstuvxyz'
      }),
      // Label: label,
      MetricStat: {
        Metric: { /* required */
          Dimensions: dimensionArr,
          MetricName: value,
          Namespace: 'AWS/EC2'
        },
        Period: 5,
        /* required */
        Stat: 'Average',
        /* required */
        // Unit: 'None'//Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes / Second | Kilobytes / Second | Megabytes / Second | Gigabytes / Second | Terabytes / Second | Bits / Second | Kilobits / Second | Megabits / Second | Gigabits / Second | Terabits / Second | Count / Second | None
      },
      ReturnData: true
    };
  });

  var params = {
    EndTime: new Date,
    /* required */
    MetricDataQueries: metricDataQueries,
    StartTime: new Date('January 2018'),
    ScanBy: 'TimestampDescending'//| TimestampAscending
  };
  cloudwatch.getMetricData(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else {
      console.log(data); // successful response
      res.status(200).send({ data: data });
    }
  });
};
