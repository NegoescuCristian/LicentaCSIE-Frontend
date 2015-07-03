/**
 * Created by root on 7/3/15.
 */
define([''], function() {

    function LogModule() {

    }

    LogModule.login = function(user) {
        console.log('Check login');

        $.ajax({
            url:'controller/login',
            type: 'POST',
            data: JSON.stringify(user),
            success: function(data) {

            },
            error: function(data) {

            }
        });
    };

    LogModule.logout = function() {
        $.ajax({
            url:'/controller/login',
            type:'POST',
            data: JSON.stringify({
                logout:true
            }),
            success: function(data) {
                console.log('Redirecting to ',data['toPage']);
                window.location = data['toPage'];
            },
            error: function(data) {

            }
        });
    };

    return LogModule;

});