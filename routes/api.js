var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var uuid = require('uuid');
var multer = require('multer')
var _ = require('underscore');

var app = express();
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
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
    // first delete all of its objects
    s3.listObjects({ Bucket: bucketName }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            Promise.all(data.Contents.map(function(obj) {
                var params = {
                    Bucket: bucketName,
                    Key: obj.Key
                };
                return s3.deleteObject(params).promise();
            })).then(function(values) {
                callback(bucketName, values);
            });
        }
    });
    // then delete the bucket
    function callback(bucketName, values) {
        s3.deleteBucket({ Bucket: bucketName }, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                res.status(400).send({ data: err });
            } else {
                console.log(data); // successful response
                res.json({ data: "Bucket deleted successfully!" });
            }
        });
    }
});

router.delete('/buckets/:bucketName/:objectKey', function(req, res) {
    var s3 = new AWS.S3();
    var bucketName = req.params.bucketName;
    var objectKey = req.params.objectKey;

    var params = {
        Bucket: bucketName,
        Key: objectKey
    };
    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            res.status(400).send({ data: err });
        } else {
            console.log(data); // successful response
            res.json({ data: "Object deleted successfully!" });
        }

    });

});

router.post('/buckets/:bucketName', upload.single('uploadFile'), function(req, res) {
    var urlParams = req.params;
    var file = req.file;
    console.log(file);
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: urlParams.bucketName }
    });

    fs.readFile(file.path, function(err, data) {
        var params = {
            Body: data,
            Bucket: urlParams.bucketName,
            Key: file.originalname,
            ACL: 'public-read'
        };
        s3.upload(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data); // successful response
                // res.json({ data: "Bucket uploaded successfully!" });
                res.redirect('/buckets/' + urlParams.bucketName);
            }
            /*
            data = {
              ETag: '"563de6ee5374583e541cc5801382a612"',
              Location: 'https://amiri-test-with-content38760bd8-a3b9-49e1-89dc-39a7aa43c926.s3.ap-southeast-2.amazonaws.com/Screen%20Shot%202018-11-22%20at%203.25.04%20PM.png',
              key: 'Screen Shot 2018-11-22 at 3.25.04 PM.png',
              Key: 'Screen Shot 2018-11-22 at 3.25.04 PM.png',
              Bucket: 'amiri-test-with-content38760bd8-a3b9-49e1-89dc-39a7aa43c926'
             VersionId: "Bvq0EDKxOcXLJXNo_Lkz37eM3R4pfzyQ"
            }
            */
        });
    });


});

module.exports = router;
