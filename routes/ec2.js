var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var uuid = require('uuid');
var multer = require('multer')
var _ = require('underscore');

var app = express();


var ec2=require("../controllers/ec2Controller");


router.get('/',ec2.list);

module.exports = router;
