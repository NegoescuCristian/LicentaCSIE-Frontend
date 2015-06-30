/**
 * Created by root on 6/29/15.
 */

var httpHelper = require('../lib/httpHelper'),
    configuration = require('../../conf/licenta.json').capiEndpoints,
    profile = process.env.NODE_ENV || 'openshift';

function doGet(request, response) {

}


function doPost(request, response) {
    var body = request.body;
    var host = configuration[profile].host,
        port = configuration[profile].port,
        endpoint = configuration[profile].uri.bid;

    var headers = {
        "Content-Type":"application/json"
    };
    httpHelper.post(host,port,endpoint,headers,body).then(function(data) {
        if(!response.finished) {
            response.writeHead(200,{"Content-Type": "application/json"});
            response.end(JSON.stringify({
                'response':'ok',
                'redirectPage':'/home'
            }));
        }
    }, function(err) {
        console.log(err);
    });
}

module.exports = {
    get: doGet,
    post: doPost
};