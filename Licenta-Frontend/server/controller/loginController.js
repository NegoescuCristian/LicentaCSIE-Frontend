/**
 * Created by root on 3/9/15.
 */

function doGet(request, response) {

    if(!response.finished) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({"boss": "deBoss"}));
    }

}


function doPost(request, response) {
    console.log("OK!!!");
    var body="";
    request.on('data', function(chunk) {
        body+=chunk;
    });
    request.on('end',function() {
        if(!response.finished) {
            var data = JSON.parse(body);
            console.log(data);
            var stringDataResponse = JSON.stringify(data);
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(stringDataResponse);
        }
    });
}


function doDelete() {}

function doPut() {}

module.exports = {
    get: doGet,
    post: doPost,
    delete: doDelete,
    put: doPut
}