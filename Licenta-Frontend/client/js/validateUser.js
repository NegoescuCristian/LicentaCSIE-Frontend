/**
 * Created by root on 3/10/15.
 */

/**
 * Function that performs a basic validation of userName and password.
 * Maybe this should be refactored to work with JQuery
 *
 * @param userName
 * @param password
 */
function isValidUserName(userName) {

    if(!userName) {
        return false;
    }
    if(userName === '' || userName === ' '){
        return false;
    }
    if(userName.length <=1) {
        return false;
    }
    return true;
}

function isValidPassword(password) {
    if(!password) {
        return false;
    }

    if(password === '' || password === ' ') {
        return false;
    }

    if(password.length <= 1) {
        return false;
    }

    return true;
}