/**
 * Created by root on 3/9/15.
 */
var url = require('url'),
    httpHelper = require('../lib/httpHelper');

function doGet(request, response) {

    var body = request.body;
    var stringDataResponse = JSON.stringify(body);
    if (!response.finished) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(stringDataResponse);
    }

}

function doPost(request, response) {

    console.log("##### ", request.url);

    var fromPage = url.parse(request.headers.referer || request.url);

    //var redirection = fromPage.query.split('=')[1];
    ;//you can take this from request
    //user , pass - check them

    console.log("Received content:", request.body);
    httpHelper.get('localhost','8083','/licenta-capi/customer',{}).then(function(data){
        console.log('RESPONSE FORM CAPI:',data);
        if (!response.finished) {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({'redirect': true, 'toPage': '', 'details': 'failedToLogin'}));
        }
    }, function(err) {
        console.log('RESPONSE ERROR FORM CAPI:',err);
        if (!response.finished) {
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({'redirect': true, 'toPage': '', 'details': 'failedToLogin'}));
        }
    });

}

function doDelete() {
}

function doPut() {
}

module.exports = {
    get: doGet,
    post: doPost,
    delete: doDelete,
    put: doPut
}