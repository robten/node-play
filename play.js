var fs = require('fs');
var nimble = require('nimble');

function task1(callback) {
    var myblog = fs.readdirSync('../myblog');
    console.log('myblog contents:', myblog);
    callback();
}

function task2(callback) {
    var dmsProject = fs.readdirSync('../dmsProject');
    console.log('dmsProject contents:', dmsProject);
    callback();
}

function task3(callback) {
    var nanities = fs.readdirSync('../nanities');
    console.log('nanities contents:', nanities);
    callback();
}

nimble.parallel([task1, task2, task3]);