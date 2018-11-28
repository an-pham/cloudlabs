var express = require('express');
var AWS = require('aws-sdk');
var uuid = require('uuid');

var app = express();
app.set('globalRegion', 'eu-central-1');

AWS.config.apiVersions = { ec2: '2016-11-15' };
AWS.config.update({ region: app.get('globalRegion') });
console.log('=======global region: ' + app.get('globalRegion'));

var ec2 = new AWS.EC2();

// To list region names and their endpoints
exports.getRegions = function(req, res) {
  var data = {};

  ec2.describeRegions({}, function(err, data) {
    if (err) res.status(400).send({ data: err });
    else res.json({ data: data });
    /*data = {
  Regions: [{
      Endpoint: "ec2.ap-south-1.amazonaws.com",
      RegionName: "ap-south-1"
    },
    {
      Endpoint: "ec2.eu-west-1.amazonaws.com",
      RegionName: "eu-west-1"
    },
    {
      Endpoint: "ec2.ap-southeast-1.amazonaws.com",
      RegionName: "ap-southeast-1"
    },
    {
      Endpoint: "ec2.ap-southeast-2.amazonaws.com",
      RegionName: "ap-southeast-2"
    },
    {
      Endpoint: "ec2.eu-central-1.amazonaws.com",
      RegionName: "eu-central-1"
    },
    {
      Endpoint: "ec2.ap-northeast-2.amazonaws.com",
      RegionName: "ap-northeast-2"
    },
    {
      Endpoint: "ec2.ap-northeast-1.amazonaws.com",
      RegionName: "ap-northeast-1"
    },
    {
      Endpoint: "ec2.us-east-1.amazonaws.com",
      RegionName: "us-east-1"
    },
    {
      Endpoint: "ec2.sa-east-1.amazonaws.com",
      RegionName: "sa-east-1"
    },
    {
      Endpoint: "ec2.us-west-1.amazonaws.com",
      RegionName: "us-west-1"
    },
    {
      Endpoint: "ec2.us-west-2.amazonaws.com",
      RegionName: "us-west-2"
    }
  ]}*/

  });
};

// To list Ubuntu AMI which can be used for running instance
exports.getAMIs = function(req, res) {
  var params = {
    ExecutableUsers: [
      'all'
    ],
    Filters: [
      { Name: 'name', Values: ['*ubuntu*'] },
      { Name: 'owner-alias', Values: ['amazon', 'aws-marketplace'] },
      // { Name: 'image-id', Values: ['ami-1111ec7e'] }
      // { Name: 'owner-id', Values: ['851601128636'] }
    ]

  };
  ec2.describeImages(params, function(err, data) {
    if (err) res.status(400).send({ data: err });
    else res.json({
      count: data.Images.length,
      data: data,
    });
  });
};

//POST: To run an instance
exports.startInstance = function(req, res) {
  res.status(200).send({ data: {} });
};

//GET: To list all instances and their status
exports.getInstances = function(req, res) {
  var params = {
    // InstanceIds: [
    //   "i-1234567890abcdef0"
    // ]
  };
  ec2.describeInstances(params, function(err, data) {
    if (err) {
     	console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else res.status(200).send({ data: data });
  });

};

//GET: To stop an instance
exports.stopInstance = function(req, res) {
  res.status(200).send({ data: {} });
};

// To update the global region
exports.changeRegion = function(req, res) {
  var region = req.params.region;
  app.set('globalRegion', region);
  setRegion();
  res.status(200).send({ currentRegion: app.get('globalRegion') });
};

exports.list = function(req, res) {
  res.send("hi from ec2 controller list");
};

function setRegion() {
  AWS.config.update({ region: app.get('globalRegion') });
  ec2 = new AWS.EC2();
}
