var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
// var uuid = require('node-uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Load the SDK and UUID


  // import individual service
  var s3 = new AWS.S3();

  var params = {};
  var bucketList = {};
  s3.listBuckets(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      bucketList = data.Buckets;
      res.render('index', {
        title: 'Express',
        bucketList: bucketList
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
