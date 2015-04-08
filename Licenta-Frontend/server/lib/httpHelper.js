
 'use strict';

 var http = require('http'),
 Promise = require('promised-io/promise'),
 seq = Promise.seq,
 defer = Promise.defer,
 buffer = require('buffer'),
 configuration = require('../../conf/licenta.json');

 function get(hostname, port, path, headers) {
    return _request('GET', hostname, port, path, headers);
}

 function post(hostname, port, path, headers, body) {
    return _request('POST', hostname, port, path, headers, body);
}

 function _request(method, hostname, port, path, headers, body) {
    var requestDescription = method + ' ' + hostname + ':' + port + path;

    var deferred = defer();

    var userName = configuration.capiAuth.user,
        password = configuration.capiAuth.password;

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
                if(!isResolved) {
                    isResolved = true;
                    deferred.reject(new Error('Failed to perform request',
                        'MAJOR', res.statusCode));
                }
            }
        });
    });

    request.on('error', function (err) {
        if(!isResolved) {
            isResolved = true;
            deferred.reject(new RainError('Failed to perform request', RainError.ERROR_HTTP));
        }
    });

    if (body) {
        console.log('HERE:',JSON.stringify(body));
        request.write(JSON.stringify(body));
    }

    request.end();

    return deferred.promise;
}

 module.exports = {
    get: get,
    post: post
};

