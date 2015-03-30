/**
 * Created by root on 3/11/15.
 */
function Runner() {}

var configuration = {
    'login': {
        'controller': {
            'file': 'loginController.js'
        }
    },
    'register': {
        'controller': {
            'file': 'registerController.js'
        }
    }
};

Runner.run = function () {
    var appName = $('app').attr('name');


    require(['/js/controller/' + configuration[appName].controller.file], function (Controller) {
        console.log('###',configuration[appName].controller.file);
        var appController = new Controller();
        appController.start();
    });


};