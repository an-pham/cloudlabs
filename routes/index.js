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
    var regions = {};

    s3.listBuckets(params, function(err, data) {
        if (err) console.log("list buckets failed: " + err, err.stack); // an error occurred
        else {
            bucketList = data.Buckets;

            completed = 0;

            bucketList.forEach(function(b) {
                var params = {
                    Bucket: b.Name /* required */
                };
                var request = s3.getBucketLocation(params);
                request.on('success', function(response) {
                    b.Region = response.data.LocationConstraint;

                }).
                on('error', function(response) {
                    console.log(response);
                    b.Region = "Missing";
                }).
                on('complete', function(response) {
                    completed++;
                    regions[b.Region] = regions[b.Region] || 0;
                    regions[b.Region]++;

                    if (completed == bucketList.length) {
                        doRender(res, regions);
                    }

                }).send();
            });
        }
    });

    function doRender(res, regions) {
        // console.log(bucketList);
        app.set('bucketList', bucketList);

        res.render('index', {
            title: 'Express',
            bucketList: bucketList,
            regionList: REGION_LIST,
            defaultRegion: "US East (N. Virginia)",
            regions: regions
        });
    }
});

// GET bucket detail page
router.get('/buckets/:bucketName', function(req, res, next) {
    var bucketName = req.params.bucketName;
    s3.listObjects({ Bucket: bucketName }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(this.request.httpRequest.endpoint);
            var protocol = this.request.httpRequest.endpoint.protocol;
            var host = this.request.httpRequest.endpoint.host;
            var bucketUrl = protocol + "//" + host + "/";
            var photos = data.Contents.map(function(img) {
                var photoKey = img.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);
                return [photoKey, photoUrl];
            });
            res.render('bucket-detail', {
                objects: photos,
                bucket: {
                    Name: bucketName
                }
            });
        }
    });
});

module.exports = router;
