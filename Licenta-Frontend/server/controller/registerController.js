/**
 * Created by root on 3/10/15.
 */

var configuration = require('../../conf/licenta.json').views,
    httpHelper = require('../lib/httpHelper'),
    fileUtil = require('../lib/util/readFileUtil');

/**
 * Get method to load the register page.
 * @param request
 * @param response
 */
function doGet(request, response) {
    console.log("inside register controller ");
    var path = request.filePath+"/register.html";
    var file = fileUtil.readFile(path,'utf8').then(function(data) {
        console.log("DATA:",data);
    }, function(err) {

    });

    if(!response.finished) {
        response.writeHead(200,"text/html");
        response.end(file);
    }
}

/**
 *
 * @param request
 * @param response
 */
function doPost(request, response) {
    console.log('Inside register controller POST method');
    var path = request.filePath+"/register.html";
    console.log("body"+ JSON.stringify(request.body));
    httpHelper.post('localhost','8083','/licenta-capi/user/register', request.headers,request.body).then(function(data){

        if (response.finished) {
            console.log('RESPONSE FORM CAPI:',data);
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({'redirect': true, 'toPage': '/home', 'details': 'failedToLogin'}));
            //console.log("response",response['toPage']);
        }
    }, function(err) {
        console.log('RESPONSE ERROR FORM CAPI:',err);
        if (response.finished) {
            response.writeHead(500, {"Content-Type": "application/json"});
            response.end(JSON.stringify({'redirect': true, 'toPage': '/login', 'details': 'failedToLogin'}));
        }
    });
}

function doDelete() {}

function doPut() {}

module.exports = {
    get: doGet,
    post: doPost
};
