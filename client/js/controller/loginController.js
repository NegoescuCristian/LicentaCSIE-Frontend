/**
 * Created by root on 3/11/15.
 */
define(['/js/controller/validateUser.js'], function (Validation) {

    function LoginController() {

    }

    LoginController.prototype.start = function () {
        this._root = $($('#app-container')[0]);
        this._formTable = this._root.find('#loginForm');

        var self = this;
        $("#loginB").on("click", function () {
            var userName = $("#userName").val();
            var password = $("#password").val();


            var validUserName = Validation.isValidUserName(userName);
            if (!validUserName) {
                self._treatMissingFields();
                //color the user name border with red and display error message
                $('#userNameTable').css({"border-style": "solid", "border-color": "#FF0000"});
            } else {
                $('#userNameTable').css({"border-style": "", "border-color": ""});
            }
            var validPassword = Validation.isValidPassword(password);
            if (!validPassword) {
                //color the password border with red and display error message
                $('#passwordTable').css({"border-style": "solid", "border-color": "#FF0000"});
            } else {
                $('#passwordTable').css({"border-style": "", "border-color": ""});
            }

            var role = $('#select').val();
            if (validUserName && validPassword) {
                $.ajax({
                    url: '/controller/login',       //jump to the server side controller
                    type: 'POST',
                    data: JSON.stringify({
                        'userName': userName,
                        "password": password,
                        "userRole": role.toUpperCase()
                    }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log("login successful");
                        self._handleResponse(data);
                    },
                    error: function (err) {
                        err = err.responseText;
                    }
                });
            }

        });

        $("#register").on("click", function () {
            window.location = '/register';
        });
    };

    LoginController.prototype._treatMissingFields = function () {
        this._insertMessage("Missing field");
    };

    LoginController.prototype._insertMessage = function (text) {
        if (this._errorMessage) {
            this._errorMessage.remove();
            this._errorMessage = null;
        }

        var toInsertRow = $('<tr id="error-message"></tr>');
        var toInsertCol = $('<td></td>');

        toInsertCol.text(text);
        toInsertRow.append(toInsertCol);

        console.log(this._formTable);
        var formBody = this._formTable.find('tbody');
        formBody.append(toInsertRow);
        this._errorMessage = toInsertRow;
    }

    LoginController.prototype._handleResponse = function (data) {
        if (data['redirect'] == true) {
            window.location.href = data['toPage'];
        }
    }

    LoginController.prototype._invalidUser = function () {

    }

    return LoginController;
});