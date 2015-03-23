/**
 * Created by root on 3/10/15.
 */

var configuration = require('../../conf/licenta.json').views,
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
        console.log('######:',typeof file);
        response.end(file);
    }
}

function doPost(request, response) {
    //TODO
    console.log('Inside register controller POST method');
    console.log(JSON.stringify(request.body));
}

function doDelete() {}

function doPut() {}

module.exports = {
    get: doGet,
    post: doPost
};
