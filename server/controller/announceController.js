/**
 * Created by churmuzache on 6/23/15.
 */
var configuration = require('../../conf/licenta.json').views,
    httpHelper = require('../lib/httpHelper'),
    fileUtil = require('../lib/util/readFileUtil'),
    configurationEndpoint = require('../../conf/licenta.json').capiEndpoints,
    profile = process.env.NODE_ENV || 'openshift';

function doGet(request, response) {
    var host = configurationEndpoint[profile].host,
        port = configurationEndpoint[profile].port,
        endpoint = configurationEndpoint[profile].uri.getAllAnnounce;

    httpHelper.get(host,port,endpoint,{}).then(function(data) {
        if(!response.finished) {
            console.log(JSON.stringify(data.data));
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(data.data));
        }

    }, function(err) {
        console.log('Error on announce controller ',err);
    });

}

function doPost(request, response) {
    var host= configurationEndpoint[profile].host,
        port = configurationEndpoint[profile].port,
        endpoint = configurationEndpoint[profile].uri.addAnnounce.replace("%s", request.session.authorization);
    request.body.userId = request.session.userId;
    request.body.imagePath = '/fake/image';

    var headers = {
        "Content-Type":"application/json"
    };

    httpHelper.post(host,port,endpoint,headers, request.body).then(function(data) {
        if(!response.finished) {
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify({'details':data}));
        }

    }, function(err) {
        if(!response.finished) {
            console.log('Error response form capi AnnounceController',err);
        }
    });
}

module.exports = {
    'get':doGet,
    'post':doPost
}