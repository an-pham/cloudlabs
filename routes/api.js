var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

var _ = require('underscore');

// var s3 = new AWS.S3();

router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });

});

router.get('/region/:regionId', function(req, res) {
    // list all bucket within region
    var region = req.params.regionId;
    var data = [];
    var s3 = new AWS.S3({
        region: region
    });

    s3.buckets.limit(50).forEach (function (b) {
        if (s3.getBucketLocation(bucket: b.name).location_constraint == region) {
            data.push(b.name);
        }
    });

    s3.listBuckets(function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else  {
            console.log(data); // successful response
            data = data;
        }
    });

    res.json({
        data: data
    });
});

module.exports = router;
