var Promise = require('promised-io/promise'),
    url = require('url'),
    configuration=require('../../conf/licenta.json').capiEndpoints,
    httpHelper = require('../lib/httpHelper'),
    profile=process.env.NODE_ENV || 'openshift';

function searchBar(request, response, page) {
    var deferred = Promise.defer();
    //should call db or something;
    deferred.resolve();
    return deferred.promise;
}

function getAnnounces(request, response, page) {
    var deferred = Promise.defer(),
        responseBid={};

    var query = url.parse(request.url).query;
    var paramValue = query.split('=')[1];

    var host=configuration[profile].host,
        port=configuration[profile].port,
        endpoint=configuration[profile].uri.getAnnounceByAnnounceId.replace("%s",paramValue);

    httpHelper.get(host,port,endpoint,{}).then(function(data) {
        data=data.data;
        responseBid["title"] = data.title;
        responseBid["category"] = data.category;
        responseBid["bidders"] = data.bidderDetailComplexes || undefined;
        responseBid["startDate"] = data.startDate;
        responseBid["endDate"] = data.endDate;
        responseBid["description"] = data.description;
        responseBid["startSum"] = data.startSum || 1000;
        responseBid["announceId"] = data.announceId;
        responseBid["founderUserName"] = data.userNameFounder;

        deferred.resolve(responseBid);
    }, function(error) {
        deferred.reject({
            'details':'error response from licenta-capi/announce/{announce_id}'
        });
    });

    return deferred.promise;
}

module.exports = {
    searchBar: searchBar,
    getAnnounces : getAnnounces
};