/**
 * Created by root on 3/9/15.
 */
var url = require('url'),
    httpHelper = require('../lib/httpHelper'),
    SessionStore = require('../lib/session-store/store');

function doGet(request, response) {

    console.log("controller get");
    var body = request.body;
    var stringDataResponse = JSON.stringify(body);
    if (!response.finished) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(stringDataResponse);
    }

}

function doPost(request, response) {
    var fromPage = url.parse(request.headers.referer || request.url);

    request.session.role = request.body.userRole;
    request.session.user = request.body.userName;
    request.session.password = request.body.password;

    var headers = {
        "Content-Type":"application/json"
    };

    httpHelper.post('localhost','8083','/licenta-capi/user/login',headers,request.body). then(
        function(data) {
            if(!response.finished) {
                request.session.authorization = request.body.userName;
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify({'redirect': true, 'toPage': '/home', 'details': 'okToLogin'}));
            }
        },
        function(err) {
            if(!response.finished) {
                console.log('Error response from licenta-capi, ',err);
                response.writeHead(500, {"Content-Type": "application/json"});
                response.end(JSON.stringify({'redirect': true, 'toPage': '/login', 'details': 'failedToLogin'}));
            }
        }

    );


    //httpHelper.get('localhost','8083','/licenta-capi/user/'+request.body.userName + "/"+request.body.password,{}).then(function(data){
    //    if (!response.finished) {
    //        console.log('RESPONSE FORM CAPI:',data);
    //        response.writeHead(200, {"Content-Type": "application/json"});
    //        response.end(JSON.stringify({'redirect': true, 'toPage': '/home', 'details': 'failedToLogin'}));
    //        console.log("response",response['toPage']);
    //    }
    //}, function(err) {
    //    console.log('RESPONSE ERROR FORM CAPI:',err);
    //    if (!response.finished) {
    //    response.writeHead(500, {"Content-Type": "application/json"});
    //        response.end(JSON.stringify({'redirect': true, 'toPage': '', 'details': 'failedToLogin'}));
    //    }
    //});

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