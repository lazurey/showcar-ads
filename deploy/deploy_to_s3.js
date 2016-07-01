/**
 * Deploy the files from specified local dir to remote dir on S3
 *
 * node deploy_to_s3.js [local pattern] [remote dir]
 *
 * node deploy_to_s3.js ../src/html/**some.js production/html
 */

var R = require('ramda');
var Q = require('q');
var AWS = require('aws-sdk');
var H = require('./helper');

AWS.config.region = 'eu-west-1';

if (!process.argv[2]) {
    H.logRed('Please, specify the local paths which should be uploaded');
    return;
}

if (!process.argv[3]) {
    H.logRed('Please, specify the remote directory where I should put the files in');
    return;
}

var localPattern = process.argv[2];
var remoteDirName = process.argv[3];
var bucketName = process.env.BUCKETNAME;

H.logCyan('From: ' + localPattern);
H.logCyan('To: ' + remoteDirName);

Q.when(H.readPattern(localPattern))
    .then(H.doLog('Resolved files list'))
    .then(H.mapFilesToStreams)
    .then(H.doLog('Send streams to S3'))
    .then(R.forEach(H.uploadFile(bucketName, remoteDirName)))
    .catch(H.logRed);