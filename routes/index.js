/*
  Reference: https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region
*/

var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var app = express();

var s3 = new AWS.S3();

// default region: us-east-2 when no region specified
var REGION_LIST = {
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

/* GET home page. */
router.get('/', function(req, res, next) {
    var params = {};

    var promisses = [];
    var bucketList = [];

    s3.listBuckets(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            bucketList = data.Buckets;

            completed = 0;

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
        // console.log(bucketList);
        app.set('bucketList', bucketList);

        res.render('index', {
            title: 'Express',
            bucketList: bucketList,
            regionList: REGION_LIST
        });
    }
});

// GET bucket detail page
router.get('/buckets/:bucketName', function(req, res, next) {
    var bucketName = req.params.bucketName;

    s3.listBuckets(function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var bucket = getBucket(bucketName, data.Buckets);
            console.log(bucket);

            res.render('bucket-detail', {
                bucket: bucket
            })
        }
    });

    function getBucket(bucketName, bucketList) {
        return bucketList.filter(function(b) {
            if (b.Name == bucketName) {
                return b;
            }
        })[0];
    }
});

module.exports = router;
