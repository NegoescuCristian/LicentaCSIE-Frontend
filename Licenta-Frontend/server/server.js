/**
 * Created by root on 3/9/15.
 */
var http = require('http');
var router = require('./lib/viewHandler');
var conf = require('../conf/licenta.json');

function start() {
    http.createServer(function(request, response) {
        handleRequest(request, response);
        //router.route(request,response);
    }).listen(8081);
    console.log('Server has started');
}

function handleRequest(request, response) {
    //regexp on request route to figure out if it's resource/view/js/controller-rest
    var isCss = request.url.indexOf('.css') !== -1;
    var isJs = request.url.indexOf('.js') !== -1;
    var isController = request.url.indexOf('/controller') !== -1;
    var isResource = request.url.indexOf('/resources') !== -1;

    if(isCss) {
        handling['css'].route(request,response);
    } else if(isJs) {
        handling['js'].route(request, response);
    } else if(isResource) {
        handling['resources'].route(request, response);
    } else if(isController) {
        handling['controller'].route(request, response);
    } else {
        handling['html'].route(request, response);
    }

}

var handling = {
    'css': require('./lib/cssHandler'),
    'js': require('./lib/jsHandler'),
    'html': require('./lib/viewHandler'),
    'resources': require('./lib/resourceHandler'),
    'controller': require('./lib/controllerHandler')
};


start();