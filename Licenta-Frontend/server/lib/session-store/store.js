/**
 * Created by root on 3/24/15.
 */

var crypto = require('crypto'),
    Promise = require('promised-io/promise');


function SessionStore() {
    this._data = {};
}

SessionStore._instance = null;

SessionStore.prototype.createSession = function (sessionId) {
    console.log("store.js : Session started");
    var deferred = Promise.defer();
    var self = this;
    this._data[sessionId] = {};
    process.nextTick(function() {
        deferred.resolve(self._data[sessionId]);
    });
    return deferred.promise;
}

SessionStore.prototype.getSession = function (sessionId) {
    var deferred = Promise.defer();
    var self = this;
    process.nextTick(function() {
        deferred.resolve(self._data[sessionId]);
    });
    return deferred.promise;
}

SessionStore.prototype.update = function (sessionId, sessionObject) {
    var deferred = Promise.defer();
    var self = this;
    this._data[sessionId] = sessionObject;
    process.nextTick(function() {
        deferred.resolve(self._data[sessionId]);
    });
    return deferred.promise;
}

SessionStore.prototype.delete = function (sessionId) {
    var deferred = Promise.defer();
    var self = this;
    delete this._data[sessionId];
    process.nextTick(function() {
        deferred.resolve();
    });
    return deferred.promise;
}

SessionStore.get = function () {
    return SessionStore._instance ||
        (SessionStore._instance = new SessionStore());
}

SessionStore.prototype.generateSessionId = function () {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = SessionStore.get()