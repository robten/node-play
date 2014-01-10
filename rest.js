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

function main(req, res) {
    var index;
    switch (req.method) {
        case 'POST': // ==> create
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
            break;
        case 'PUT': // ==> update
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
            break;
        case 'DELETE': // ==> delete
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
            break;
        default: // GET ==> read
            var body = items.map(function(item, i) {
                return i + '.) ' + item + '.';
            }).join('\n');
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset="utf-8"',
                'Content-Length': Buffer.byteLength(body)
            });
            res.end(body);
    }
}

var server = http.createServer(main);
server.listen(3000);