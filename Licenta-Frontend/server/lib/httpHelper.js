/**
 * Created by root on 3/9/15.
 */

function request(method,headers,host,port,path,body) {
    //TODO request
    header["Authorization"] = "Basic " //encode your user and password from configuration


    switch(method) {
        case "GET":
            _get(headers, host, port, path, body);
            break;
        case "POST":
            _post(headers, host, port, path, body);
            break;
    }

}

function _get(){
    var deferred = Promise.defer();


    req = http.request('', function (req) {
        //req.on('data',
    });

    req.on('error', function () {
        deferrred.reject();
    })
    return deferred.promise;
}
function _post(){}

module.exports = {
    get: _get,
    post: _post
}
/**
 'use strict';

 var http = require('http'),
 Promise = require('promised-io/promise'),
 seq = Promise.seq,
 defer = Promise.defer,
 buffer = require('buffer'),
 configuration = require('../../../../conf/licenta.json');

 function get(hostname, port, path, headers) {
    return _request('GET', hostname, port, path, headers);
}

 function post(hostname, port, path, headers, body) {
    return _request('POST', hostname, port, path, headers, body);
}

 function _request(method, hostname, port, path, headers, body) {
    var requestDescription = method + ' ' + hostname + ':' + port + path;

    var deferred = defer();

    var userName = configuration.auth.userName,
        password = configuration.auth.password;

    var authenticationBuffer = new Buffer(userName + ":" + password, 'utf8');
    var token = authenticationBuffer.toString('base64');

    headers["Authorization"] = "Basic " + token;
    var options = {
        hostname: hostname,
        path: path,
        port: port,
        method: method,
        headers: headers
    };

    //local hack don't understand the meaning of this
    var isResolved = false;

    var request = http.request(options, function (res) {
        var chunk = '';

        res.on('data', function (buff) {
            chunk += buff.toString('utf8');
        });

        res.on('end', function (buff) {
            if (buff) {
                chunk += buff.toString('utf8');
            }

            logger.debug('http_helper: Received response for ' + requestDescription
            + ' status ' + res.statusCode + ' body ' + chunk);

            if (res.statusCode < 400) {
                var data = (chunk === '') ? {} : JSON.parse(chunk);

                if(!isResolved) {
                    isResolved = true;
                    deferred.resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            } else {
                logger.error('http_helper: unexpected status code was received for '
                + requestDescription + ' status code: ' + res.statusCode + ' body: ' + chunk);
                if(!isResolved) {
                    isResolved = true;
                    deferred.reject(new RainError('Failed to perform request',
                        RainError.ERROR_HTTP, res.statusCode));
                }
            }
        });
    });

    request.on('error', function (err) {
        logger.error('http_helper: request failed ' + requestDescription, err);
        if(!isResolved) {
            isResolved = true;
            deferred.reject(new RainError('Failed to perform request', RainError.ERROR_HTTP));
        }
    });

    if (body) {
        request.write(JSON.stringify(body));
    }

    request.end();

    return deferred.promise;
}

 module.exports = {
    get: get,
    post: post
};

 **/