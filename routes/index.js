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

    var promisses = [];
    s3.listBuckets(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            bucketList = data.Buckets;
            completed = 0;

            //             var promises = [2, 3, 5, 7, 11, 13].map(function(id){
            //   return getJSON("/post/" + id + ".json");
            // });

            // RSVP.all(promises).then(function(posts) {
            //   // posts contains an array of results for the given promises
            // }).catch(function(reason){
            //   // if any of the promises fails.
            // });

            bucketList.forEach(function(b) {
                var params = {
                    Bucket: b.Name /* required */
                };
                s3.getBucketLocation(params, function(err, data) {
                    if (err) console.log(err);
                    else {
                        completed++;
                        b.Region = data.LocationConstraint;
                        if (completed == bucketList.length) {
                            doRender(res);
                        }
                    }
                });
            });
        }
    });

    function doRender(res) {
        console.log(bucketList);

        res.render('index', {
            title: 'Express',
            bucketList: bucketList,
            regionList: regionList
        });
    }

});




module.exports = router;