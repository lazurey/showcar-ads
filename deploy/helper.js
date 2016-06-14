var AWS = require('aws-sdk');
var R = require('ramda');
var Q = require('q');
var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var mime = require('mime');

Q.longStackSupport = true;

var logCyan = R.compose(console.log.bind(console), chalk.cyan.bind(chalk));
var logGreen = R.compose(console.log.bind(console), chalk.green.bind(chalk));
var logRed = R.compose(console.log.bind(console), chalk.red.bind(chalk));

var doLog = R.curry(function(msg, data) {
    logCyan(msg);
    return data;
});

/// joinPath :: String -> String -> String
var joinPath = R.curryN(2, path.join);


/// appendFullPathToFiles :: String -> [String] -> [String]
var appendFullPathToFiles = R.compose(R.map, joinPath);


/// mapFilesToStreams :: [String] -> [{stream: FileStream, fileName: String}]
var mapFilesToStreams = R.map(R.converge(R.merge, [
    R.compose(R.objOf('fileStream'), R.nAry(1, fs.createReadStream)),
    R.compose(R.objOf('fileName'), R.nAry(1, path.basename))
]));


var showUploadProgress = function(evt) {
    logGreen('File ' + evt.key + ' is ' + Math.floor(evt.loaded * 100 / evt.total) + '% loaded');
};

var uploadFinished = function(err, data) {
    if (err) return logRed(err);
    return logGreen('Uploading of ' + data.key + ' is done!\n>> It is located at ' + data.Location);
};

var getUploadParams = function(bucketName, remotePath, fileName) {
    var mimeType = mime.lookup(fileName);
    var extName = path.extname(fileName);
    var base = {Bucket: bucketName, ContentType: mimeType, Key: remotePath + '/' + fileName};
    if (extName === '.html') {
        return R.merge({CacheControl: 'max-age=60'}, base);
    }
    return base;
};

var uploadFile = R.curry(function(bucketName, remotePath, payload) {
    var S3 = new AWS.S3({params: getUploadParams(bucketName, remotePath, payload.fileName)});
    S3.upload({Body: payload.fileStream})
        .on('httpUploadProgress', showUploadProgress)
        .send(uploadFinished);
});

module.exports = {
    logCyan:logCyan,
    logGreen:logGreen,
    logRed: logRed,
    doLog: doLog,
    joinPath: joinPath,
    uploadFile: uploadFile,
    mapFilesToStreams: mapFilesToStreams,
    appendFullPathToFiles: appendFullPathToFiles
};