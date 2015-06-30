/**
 * Created by root on 3/11/15.
 */
var fs = require('fs'),
    Promise = require('promised-io/promise');

/**
 * Function that reads from a file. If no encoding is provided then the default encoding will be utf8.
 *
 * This should be done async ???
 *
 *
 * @param fileName
 * @param encoding
 * @returns {*}
 */
function readFile(fileName,encoding) {
    if(!(typeof encoding === 'string')) {
        throw new Error('The encoding must be string');
    } else if(encoding.length == 0 || encoding === '') {
        encoding = 'utf8';
    }
    var deferred = Promise.defer();
    fs.readFile(fileName,encoding, function(err,data) {
        if(err) {
            deferred.reject("The file was not found");
        }else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}


module.exports = {
    readFile: readFile
}