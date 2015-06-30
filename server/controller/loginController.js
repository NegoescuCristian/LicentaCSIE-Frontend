/**
 * Created by root on 3/9/15.
 */
var url = require('url'),
    httpHelper = require('../lib/httpHelper'),
    SessionStore = require('../lib/session-store/store'),
    configuration = require('../../conf/licenta.json').capiEndpoints,
    profile = process.env.NODE_ENV || 'openshift';

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

    var host = configuration[profile].host,
        port = configuration[profile].port,
        endpoint = configuration[profile].uri.login;
    console.log(host,port,endpoint);
    httpHelper.post(host, port, endpoint , headers,request.body). then(
        function(data) {
            if(!response.finished) {
                request.session.authorization = request.body.userName;
                request.session.userRole = request.body.userRole;
                request.session.userId = data.data.id;
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