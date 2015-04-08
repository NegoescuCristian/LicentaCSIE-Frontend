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

    //var redirection = fromPage.query.split('=')[1];
    ;//you can take this from request
    //user , pass - check them

    console.log("Received content:", request.body);
    request.session.role = request.body.userRole;
    request.session.user = request.body.userName;
    request.session.password = request.body.password;

    //SessionStore.update(request.sessionId, request.session).then(function () {
    //    if (!response.finished) {
    //        response.writeHead(200, {"Content-Type": "application/json"});
    //        response.end(JSON.stringify({'redirect': true, 'toPage': fromPage, 'details': 'failedToLogin'}));
    //    }
    //});

    httpHelper.post('localhost','8083','/licenta-capi/user/login',{},request.body). then(
        function(data) {
            if(!response.finished) {
                console.log("Response from licenta-capi:",data);
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