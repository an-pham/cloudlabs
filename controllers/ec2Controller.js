var express = require('express');
var AWS = require('aws-sdk');
var uuid = require('uuid');

// var app = express();

exports.getRegions = function(req, res) {
	var data = {};
	res.json({data: data});
};

exports.list = function(req, res) {
	res.send("hi from ec2 controller list");
};
