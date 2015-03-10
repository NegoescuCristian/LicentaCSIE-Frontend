/**
 * Created by root on 3/10/15.
 */

var configuration = require('../../conf/licenta.json').views;

/**
 * Get method to treat the register page
 * @param request
 * @param response
 */
function doGet(request, response) {
    if(!response.finished) {
        response.writeHead(200,"text/html");
        response.end();
    }
}

function doPost(request, response) {

}

function doDelete() {}

function doPut() {}

module.exports = {
    get: doGet
}
