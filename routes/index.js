/*
  Reference: https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region
*/

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
// var uuid = require('node-uuid');
var s3 = new AWS.S3();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Load the SDK and UUID

  // import individual service
  

  var params = {};
  var bucketList = {};

  // default region: us-east-2 when no region specified
  var regionList = {
    "-": "Any",
    "us-east-2": "US East (Ohio)",
    "us-east-1": "US East (N. Virginia) ", //non location contraint required
    "us-west-1": "US West (N. California)",
    "us-west-2": "US West (Oregon)",
    "ap-south-1": "Asia Pacific (Mumbai)",
    "ap-northeast-2": "Asia Pacific (Seoul)",
    "ap-southeast-1": "Asia Pacific (Singapore)",
    "ap-southeast-2": "Asia Pacific (Sydney)",
    "ap-northeast-1": "Asia Pacific (Tokyo)",
    "ca-central-1": "Canada (Central)",
    "eu-central-1": "EU (Frankfurt)",
    "eu-west-1": "EU (Ireland)",
    "eu-west-2": "EU (London)",
    "eu-west-3": "EU (Paris)",
    "sa-east-1": "South America (São Paulo)"
  };

  s3.listBuckets(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      bucketList = data.Buckets;
      res.render('index', {
        title: 'Express',
        bucketList: bucketList,
        regionList: regionList
      });
    }
    /*
    data = {
     Buckets: [
        {
       CreationDate: <Date Representation>,
       Name: "examplebucket"
      },
        {
       CreationDate: <Date Representation>,
       Name: "examplebucket2"
      },
        {
       CreationDate: <Date Representation>,
       Name: "examplebucket3"
      }
     ],
     Owner: {
      DisplayName: "own-display-name",
      ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31"
     }
    }
    */
  });

  console.log(bucketList);
});


module.exports = router;
