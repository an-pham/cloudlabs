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
  return ec2.describeRegions({}).promise();
};

// To list Ubuntu AMI which can be used for running instance
exports.getAMIs = function(req, res) {
  var params = {
    ExecutableUsers: [
      'all'
    ],
    Filters: [
      {
        Name: 'image-id',
        Values: [
          'ami-034fffcc6a0063961',
          'ami-07f1aa69c7c7b01c9',
          'ami-0bdf93799014acdc4',
          'ami-0405a63f383fddd6b',
          'ami-c9e6e122',
          'ami-086a09d5b9fa35dc7'
        ]
      },
    ],
  };
  return ec2.describeImages(params).promise();
  //, function(err, data) {
  //   if (err) res.status(400).send({ data: err });
  //   else res.json({
  //     count: data.Images.length,
  //     data: data,
  //   });
  // });
};


exports.describeInstances = function() {
  return ec2.describeInstances({}).promise();
  //   , function(err, data) {
  //   if (err) {
  //     console.log(err, err.stack); // an error occurred
  //     res.status(400).send({ data: err });
  //   } else res.status(200).send({ count: data.Reservations.length, data: data });
  // });
};

// ==== APIs
//GET: To list all instances and their status
exports.getInstances = function(req, res) {
  ec2.describeInstances({}, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else res.status(200).send({ count: data.Reservations.length, data: data });
  });
};

const DEFAULT_AMI = 'ami-086a09d5b9fa35dc7';
//POST: To run an instance
exports.runInstance = function(req, res) {
  var imageId = req.body.imageId || DEFAULT_AMI;
  var numOfInstance = req.body.numOfInstance || 1;
  var name = req.body.instanceName;

  // maximum is 5 instance
  var maxInstances = 5;
  numOfInstance = numOfInstance <= maxInstances ? numOfInstance : maxInstances;

  var params = {
    // BlockDeviceMappings: [{
    //   DeviceName: "/dev/sdh",
    //   Ebs: {
    //     VolumeSize: 100
    //   }
    // }],
    ImageId: imageId,
    InstanceType: "t2.micro", //Free tier
    KeyName: "anamir-frankfurt-m7024e",
    MaxCount: numOfInstance,
    MinCount: 1,
    SecurityGroupIds: [
      "sg-0b5edca016d5e0d3e"
    ],
    // SubnetId: "subnet-6e7f829e",
    TagSpecifications: [{
      ResourceType: "instance",
      Tags: [{
        Key: "Name",
        Value: name + uuid.v4(),
      }]
    }]
  };
  ec2.runInstances(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else {
      res.status(200).send({ data: data });
    }
  });
};

//GET: To stop an instance
exports.stopInstance = function(req, res) {
  var params = {
    InstanceIds: [
      req.params.instanceId
    ]
  };
  ec2.stopInstances(params, function(err, data) {
    if (err) {
    	console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else {
    	res.status(200).send({ data: data });
    }
    /*
    data = {
     StoppingInstances: [
        {
       CurrentState: {
        Code: 64, 
        Name: "stopping"
       }, 
       InstanceId: "i-1234567890abcdef0", 
       PreviousState: {
        Code: 16, 
        Name: "running"
       }
      }
     ]
    }
    */
  });
};

// To start an instance that is previously stopped
exports.startInstance = function(req, res) {
  var params = { InstanceIds: [req.params.instanceId] };
 ec2.startInstances(params, function(err, data) {
   if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(400).send({ data: err });
    } else {
      res.status(200).send({ data: data });
    }
   /*
   data = {
    StartingInstances: [
       {
      CurrentState: {
       Code: 0, 
       Name: "pending"
      }, 
      InstanceId: "i-1234567890abcdef0", 
      PreviousState: {
       Code: 80, 
       Name: "stopped"
      }
     }
    ]
   }
   */
 });
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

exports.getCurrentRegion = function () {
  return app.get('globalRegion');
}

function setRegion() {
  AWS.config.update({ region: app.get('globalRegion') });
  ec2 = new AWS.EC2();
}
