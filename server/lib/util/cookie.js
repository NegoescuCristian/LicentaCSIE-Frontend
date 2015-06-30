/**
 * Created by root on 3/24/15.
 */

var secret = "my_secret_string";    //TODO refactor to read from conf
var signature = require('connect/node_modules/cookie-signature'),
    CookieModule = require('cookie'),
    cookie = require('connect/lib/middleware/session/cookie');

function Cookie() {}

Cookie.getCookie = function (request, response){
    var gotCookie = request.headers['cookie'];
    if(!gotCookie) {
        return;
    }
    var parsedCookie = CookieModule.parse(gotCookie);

    return parsedCookie[secret];
}

Cookie.setCookie = function (request,response, id) {
    var cookieInstance = new cookie(request, {});
    var signValue = Cookie.sign(id);
    var cookieValue = cookieInstance.serialize(secret,signValue);

    response.setHeader('Set-Cookie',cookieValue);
};

Cookie.sign = function (key) {
    var sign  = 's:' + signature.sign(key,secret);
    return sign;
};

Cookie.unSign = function (cookie) {
    cookie = cookie.split(':');
    return cookie[1].split('.')[0];
};

module.exports = Cookie;