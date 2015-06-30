/**
 * Created by root on 3/10/15.
 */
var url = require('url'),
    path = require('path'),
    configuration = require('../../conf/licenta.json').controller;

var routingsCache = {};

function route(request, response) {
    var method = request.method.toLowerCase(),
        controllerPath = url.parse(request.url).pathname.replace('/controller', '');

    var jsFunctionPath = path.join(process.cwd(), './server/controller', configuration[controllerPath]);
    handle(jsFunctionPath, method, request, response);
}

function handle(controllerPath, method, request, response) {
    if(!routingsCache[controllerPath]) {
        var myControllerFunction = require(controllerPath);
        routingsCache[controllerPath] = myControllerFunction;
    }

    var body = '';
    request.on('data', function(chunk) {
        body += chunk;
    });
    request.on('end',function(data) {

        if(typeof data !== 'undefined') {
            body += data;
        }

        try {
            data = JSON.parse(body);
        } catch (ex) {
            data = {};
        }
        request.body = data;
        var myFunction = routingsCache[controllerPath];

        request.filePath = controllerPath;
        myFunction[method](request, response);
    });

}


module.exports = {
    route: route
};