// A module that implements a basic RESTful API for http.
// TODO: make it also posible to only implement partial CRUD and subly default functions in that case
// TODO: yet there is no possibility to hand over optional helper functions (like getIndex(req) in rest.js)

var http = require('http');

var create,
    read,
    update,
    del;

var error = function error(res) {
    res.writeHead(500);
    res.end('Internal server error');
};

function isValidCRUD(crud) {
    // TODO: testing if these are actually functions
    if (crud.create &&
        crud.read &&
        crud.update &&
        crud.delete) {
        return true;
    } else {
        return false;
    }
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

exports.setPost = function setPost(func) {
    create = func;
};

exports.setGet = function setGet(func) {
    read = func;
};

exports.setPut = function setPut(func) {
    put = func;
};

exports.setDelete = function setDelete(func) {
    del = func;
};

exports.setError = function setError(func) {
    error = func;
};

exports.setCRUD = function setCRUD(crud) {
    if (!isValidCRUD) { return false; }
    create = crud.create;
    read = crud.read;
    update = crud.update;
    del = crud.delete;
    return true;
};

exports.createServer = function createServer(crud) {
    if (crud) { setCRUD(crud); }
    return http.createServer(main);
};
