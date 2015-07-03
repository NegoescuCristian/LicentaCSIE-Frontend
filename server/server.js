/**
 * Created by root on 3/9/15.
 */
var http = require('http');
var router = require('./lib/viewHandler');
var conf = require('../conf/licenta.json');
var CookieHelper = require('./lib/util/cookie');
var Promise = require('promised-io/promise');
var SessionStore = require('./lib/session-store/store');

function start() {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;
    console.log(ipaddress, port);
    http.createServer(function(request, response) {
        handleRequest(request, response);
        //router.route(request,response);
    }).listen(port, ipaddress);
    console.log('Server has started');
}

function handleRequest(request, response) {
    var sessionId;

    Promise.seq([
        function () {
            var myCookie = CookieHelper.getCookie(request);
            if(!myCookie) {
                sessionId = SessionStore.generateSessionId();
                //create session for this id
                CookieHelper.setCookie(request, response, sessionId);
                return SessionStore.createSession(sessionId);
            } else {
                //unsign the cookie
                sessionId = CookieHelper.unSign(myCookie);
                return Promise.seq([
                    SessionStore.getSession.bind(SessionStore, sessionId),
                    function (session) {
                        if (!session) {
                            sessionId = SessionStore.generateSessionId();
                            //create session for this id
                            CookieHelper.setCookie(request, response, sessionId);
                            return SessionStore.createSession(sessionId);
                        } else {
                            return session;
                        }
                    }
                ]);
                //get session based on id
            }
        },
        function (session) {
            request.sessionId = sessionId;
            request.session = session;
        },
        function () {
            //regexp on request route to figure out if it's resource/view/js/controller-rest
            var isCss = request.url.indexOf('.css') !== -1;
            var isJs = request.url.indexOf('.js') !== -1;
            var isController = request.url.indexOf('/controller') !== -1;
            var isResource = request.url.indexOf('/resources') !== -1;
            var isDataLayer = request.url.indexOf('/data') !== -1;

            if(isCss) {
                handling['css'].route(request,response);
            } else if(isJs) {
                handling['js'].route(request, response);
            } else if(isResource) {
                handling['resources'].route(request, response);
            } else if(isController) {
                handling['controller'].route(request, response);
            } else if(isDataLayer) {
                handling['data'].route();
            }else {
                handling['html'].route(request, response);
            }
        }
    ]);

}

var handling = {
    'css': require('./lib/cssHandler'),
    'js': require('./lib/jsHandler'),
    'html': require('./lib/viewHandler'),
    'resources': require('./lib/resourceHandler'),
    'controller': require('./lib/controllerHandler'),
};


start();