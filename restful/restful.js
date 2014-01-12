// A module that implements a basic RESTful API for http.

var http = require('http');

var crud = {create: badRequest,
            read: badRequest,
            update: badRequest,
            del: badRequest,
            bad: badRequest
            };

function badRequest(req, res) {
    res.writeHead(400);
    res.end('Bad request');
}


function isValidCRUD(crudObj) {
    // TODO: testing if these are actually functions
    if (crudObj.create &&
        crudObj.read &&
        crudObj.update &&
        crudObj.del) {
        return true;
    } else {
        return false;
    }
}

function main(req, res) {
    var index;
    switch (req.method) {
        case 'POST':
            crud.create(req, res);
            break;
        case 'GET':
            crud.read(req, res);
            break;
        case 'PUT':
            crud.update(req, res);
            break;
        case 'DELETE':
            crud.del(req, res);
            break;
        default:
            crud.bad(req, res);
    }
}

exports.set = function set(name, expr) {
    if (typeof name === 'string') {
        crud[name] = expr;
        return true;
    }
    if (isValidCRUD(name)) {
        crud = name;
        return true;
    }
    return false;
};

exports.createServer = function createServer(crudObj) {
    if (crudObj) { set(crudObj); }
    return http.createServer(main);
};
