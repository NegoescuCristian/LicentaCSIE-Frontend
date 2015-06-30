/**
 * Created by root on 4/24/15.
 */
define([], function () {

    function AccountController() {

    }


    AccountController.prototype.start = function () {
        $.ajax({
            type: 'GET',
            url: '/controller/account',
            success: function (receivedData) {
                console.log('Received data:', receivedData);
                $('#userNameId').text(receivedData.data.userName);
                $('#firstNameId').text(receivedData.data.firstName);
                $('#lastNameId').text(receivedData.data.lastName);
                $('#addressId').text(receivedData.data.address);
            },
            error: function () {
                console.log('Error response from account details controller server side');
            }
        });

        $('#toAccount').on('click', function () {
            window.location = "/account";
        });

        $('#toForm').on('click', function () {
            window.location = '/form';
        });

    };

    AccountController.prototype._handleRefs = function () {

        $('#toForm').on('click', function () {
            window.location = '/form';
        });

        $('#toAccount').on('click', function () {
            window.location = "/account";
        });

        $('#titlu').on('click', function () {
            window.location = "/home";
        });

    };


    return AccountController;

});