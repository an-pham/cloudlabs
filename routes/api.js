var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var uuid = require('uuid');

var _ = require('underscore');

// var s3 = new AWS.S3();

router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });

});

router.get('/buckets/:bname/:region', function(req, res) {
    // list all bucket within region
    var region = req.params.region;
    var bucketName = (req.params.bname || "some-bucket-name") + uuid.v4();

    // var data = [];
    var s3 = new AWS.S3({
        region: region
    });

    var params = {
        Bucket: bucketName,
        // CreateBucketConfiguration: {
        //     LocationConstraint: region
        // }
    };
    s3.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data); // successful response
            res.json({ data: data });
        }
        /*
        data = {
         Location: "http://examplebucket.s3.amazonaws.com/"
        }
        */
    });
});

router.delete('/buckets/:bucketName', function(req, res) {
    var s3 = new AWS.S3();
    var bucketName = req.params.bucketName;

    s3.deleteBucket({ Bucket: bucketName }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data); // successful response
            res.json({ data: "Bucket deleted successfully!" });
        }
    });
});

module.exports = router;
