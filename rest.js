// A simple server that exposes a list of strings through a RESTful API
// For testing, query it with curl using valide POST, GET, PUT and DELETE requests.

var http = require('http');
var parse = require('url').parse;
var items = [];

function getIndex(req) {
    var path = parse(req.url).pathname;
    var index = parseInt(path.slice(1), 10);
    if (isNaN(index)) {
        return false;
    }
    return index;
}

function create(req, res) {
    var item = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        item += chunk;
    });
    req.on('end', function() {
        items.push(item);
        console.log('data:', item);
        res.writeHead(200);
        res.end('ok\n');
    });
}

function read(res) {
    var body = items.map(function(item, i) {
        return i + '.) ' + item + '.';
    }).join('\n');
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset="utf-8"',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}

function update(req, res) {
    index = getIndex(req);
    if (index === false) {
        res.writeHead(400);
        res.end('No valid item index given.');
    } else if (!items[index]) {
        res.writeHead(404);
        res.end('No item with that index.');
    } else {
        var data = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            items[index] = data;
            res.writeHead(200);
            res.end('Item updated.');
        });
    }
}

function del(req, res) {
    index = getIndex(req);
    if (index === false) {
        res.writeHead(400);
        res.end('No valid item index given.');
    } else if (!items[index]) {
        res.writeHead(404);
        res.end('No item with that index.');
    } else {
        items.splice(index, 1);
        res.writeHead(200);
        res.end('Item deleted.');
    }
}

function error(res) {
    res.writeHead(500);
    res.end('Internal server error');
}

function main(req, res) {
    var index;
    switch (req.method) {
        case 'POST':
            create(req, res);
            break;
        case 'GET':
            read(res);
            break;
        case 'PUT':
            update(req, res);
            break;
        case 'DELETE':
            del(req, res);
            break;
        default:
            error(res);
    }
}

var server = http.createServer(main);
server.listen(3000);