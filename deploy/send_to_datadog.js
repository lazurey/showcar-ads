var fs = require('fs');
var metrics = require('datadog-metrics');

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats["size"];
    return fileSizeInBytes
}

var js_bytes = getFilesizeInBytes('dist/index.js');

metrics.init({ prefix: 'showcar.ads.' });
metrics.gauge('js_bytes', js_bytes, ['showcar']);
metrics.flush();
