/**
 * Deploy the files from specified local dir to remote dir on S3
 * 
 * node deploy_to_s3.js [local dir] [remote dir] [comma separated files list]
 * node deploy_to_s3.js ../dist production a.js,b.css
 * node deploy_to_s3.js ../src/html production/html a.html
 */

var R = require('ramda');
var Q = require('q');
var AWS = require('aws-sdk');
var H = require('./helper');

AWS.config.region = 'eu-west-1';

if (!process.argv[2]) {
    H.logRed('Please, specify the local directory where I should find the files to upload');
    return;
}

if (!process.argv[3]) {
    H.logRed('Please, specify the remote directory where I should upload files');
    return;
}

if (!process.argv[4]) {
    H.logRed('Please, specify the files to be uploaded as a comma separated list');
    return;
}

var localDirPath = H.joinPath(__dirname, process.argv[2]);
var remoteDirName = process.argv[3];
var filesList = R.split(',', process.argv[4]);
var bucketName = process.env.BUCKETNAME;

H.logCyan('Upload files: ' + filesList);
H.logCyan('... from: ' + localDirPath);
H.logCyan('... to: ' + remoteDirName);

Q.when(filesList)
    .then(H.doLog('Append "' + localDirPath + '" to files names'))
    .then(H.appendFullPathToFiles(localDirPath))
    .then(H.doLog('Map following files to streams'))
    .then(H.mapFilesToStreams)
    .then(H.doLog('Send streams to S3'))
    .then(R.forEach(H.uploadFile(bucketName, remoteDirName)))
    .catch(H.logRed);
