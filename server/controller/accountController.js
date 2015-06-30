/**
 * Created by root on 4/24/15.
 */

var httpHelper = require('../lib/httpHelper'),
    configuration = require('../../conf/licenta.json'),
    requestEndpoints = require('../../conf/licenta.json').capiEndpoints,
    profile = process.env.NODE_ENV || 'openshift';


function doGet(request, response) {

    var hostName = requestEndpoints[profile].host,
        port = requestEndpoints[profile].port,
        path = requestEndpoints[profile].uri.accountDetails.replace("%s",request.session.authorization);
    console.log(hostName,port,path);
    httpHelper.get(hostName,port,path,{}).then(
        function (data) {
            if(!response.finished) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(data));
            }
        },
        function(err) {
            if(!response.finished) {
                console.log(err);
                response.writeHead(500, {"Content-Type": "application/json"});
                response.end();
            }
        }
    );
}



module.exports = {
    get: doGet
}