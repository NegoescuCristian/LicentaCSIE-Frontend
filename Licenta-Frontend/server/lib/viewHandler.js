/**
 * Created by root on 3/9/15.
 */

var url = require('url');
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    Promise = require('promised-io/promise'),
    configuration = require('../../conf/licenta.json');

/**
 * Function used for handling different request path
 * @param request
 */
var routingsCache = {};
function route(request, response) {

    var path = url.parse(request.url).pathname,
        views = configuration["views"];
    path = path.split('.')[0];
    if(views[path]) {
        handle(request, path, response);
    } else {
        serveNotFoundPage(response);
    }
}


function handle(request, pathOfPage, response) {
    var views = configuration["views"];
    var page = views[pathOfPage];
    var htmlPagesDir = path.join(process.cwd(), './client/pages');
    //validate if view is accesible
    /**test exists**/
    if(!routingsCache[page]) {
        var pagePath = path.join(htmlPagesDir, page);
        var deferred = Promise.defer();
        routingsCache[page] = deferred.promise;
        fs.exists(pagePath, function(exists) {
            if(exists) {
                fs.readFile(pagePath, 'utf8', function(err, data) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(data);
                    }
                });
            } else {
                deferred.reject(false);
            }
        });
    }

    routingsCache[page].then(function(data) {
        console.log(pathOfPage);
        var authorization = configuration[pathOfPage] ? configuration[pathOfPage].authorization : null;
        console.log(authorization);
        if (authorization) {
            console.log(request.session);
            if (request.session.role == authorization) {
                if(configuration[pathOfPage]['customFields']) {
                    var customFields = configuration[pathOfPage]['customFields'];
                    for(var i = 0; i < customFields.length; i++) {
                        var param = customFields[i].replace('$', '');
                        data = data.replace(customFields[i], request.session[param]);
                    }

                }
                servePage(data, response);
            } else {
                redirectToLogin(page, response);
            }
        } else {
            servePage(data, response);
        }
    }, function (err) {
        serveNotFoundPage(response);
    });

}

function servePage(content, response) {
    if(!response.finished) {
        response.writeHead(200, {'Content-Length': content.length, 'Content-Type': 'text/html'});
        response.end(content);
    }
}

function redirectToLogin(page, response) {
    if(!response.finished) {
        response.writeHead(302, {'Location': '/login?fromPage=' + page});
        response.end();
    }
}


function serveNotFoundPage(response) {
    //you can define some error pages 404.html, 500.html......
    if(!response.finished) {
        var data = 'Page not found';
        response.writeHead(404, {'Content-Length': data.length, 'Content-Type': 'text/html'});
        response.end(data);
    }
}


exports.route=route;