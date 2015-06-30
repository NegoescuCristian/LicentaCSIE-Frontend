/**
 * Created by root on 3/10/15.
 */

var url = require('url');
var fs = require('fs'),
    path = require('path'),
    Promise = require('promised-io/promise'),
    configuration = require('../../conf/licenta.json');

/**
 * Function used for handling different request path
 * @param request
 */
var routingsCache = {};
function route(request, response) {
    var path = url.parse(request.url).pathname;

    handle(path, response);
}


function handle(page, response) {
    var htmlPagesDir = path.join(process.cwd(), './client');

    if(!routingsCache[page]) {
        var pagePath = path.join(htmlPagesDir, page);
        var deferred = Promise.defer();
        routingsCache[page] = deferred.promise;
        fs.exists(pagePath, function(exists) {
            if(exists) {
                fs.readFile(pagePath, function(err, data) {
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
        servePage(data, response);
    }, function (err) {
        serveNotFoundPage(response);
    });

}

function servePage(content, response) {
    if(!response.finished) {
        response.writeHead(200, {'Content-Length': content.length, 'Content-Type': 'image'});
        response.end(content);
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