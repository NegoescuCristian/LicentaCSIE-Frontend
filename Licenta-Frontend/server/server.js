/**
 * Created by root on 3/9/15.
 */
var http = require('http');
var router = require('./lib/requestHandler');
var conf = require('../conf/licenta.json');

function start() {
    http.createServer(function(request, response) {
        //handleRequest(request, response);
        router.route(request,response);
    }).listen(8081);
    console.log('Server has started');
}

function handleRequest(request, response) {
    //regexp on request route to figure out if it's resource/view/js/controller-rest
    /*
    if(isHtml) {
        handling['html'].route(request, response);
    }*/


}

/*
var handling = {
    'css': require('./lib/cssHandler'),
    'js': require('./lib/jsHandler'),
    'html': require('./lib/htmlHandler')
}
*/

start();