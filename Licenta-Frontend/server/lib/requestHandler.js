/**
 * Created by root on 3/9/15.
 */

var url = require('url');
var fs = require('fs'),
    path = require('path'),
    configuration = require('../../conf/licenta.json');

/**
 * Function used for handling different request path
 * @param request
 */
function route(request, response) {
    var path = url.parse(request.url).pathname,
        views = configuration["views"];


    if(views[path]) {
        handle(views[path], response);
    } else {
        serveNotFoundPage(response);
    }
}


function handle(page, response) {
    var htmlPagesDir = path.join(process.cwd(), './client/pages');

    /**test exists**/
    var pagePath = path.join(htmlPagesDir, page);
    console.log(pagePath);
    fs.exists(pagePath, function(exists) {
        if(exists) {
            fs.readFile(pagePath, 'utf8', function(err, data) {
               if(err) {
                    serveNotFoundPage(response);
               } else {
                   servePage(data, response);
               }
            });
        } else {
            serveNotFoundPage(response);
        }
    });

}

function servePage(content, response) {
    if(!response.finished) {
        response.writeHead(200, {'Content-Length': content.length, 'Content-Type': 'text/html'});
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