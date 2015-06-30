/**
 * Created by ciprian on 21.03.2015.
 */
define(['/js/controller/validateUser.js'], function (Validation) {

    function RegisterController() {

    }

    RegisterController.prototype.start = function(){

        this._root = $($('#app-container')[0]);
        this._formTable = this._root.find('#registerForm');
        this._handleRefs();

        var self = this;
        $('#loginB').on('click', function(){
            var firstName = $('#firstName').val();
            var lastName = $('#lastName').val();
            var address = $('#address').val();
            var userName = $('#userName').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();


            self._checkFields(firstName, 'firstNameTable');
            self._checkFields(address, 'addressTable');
            self._checkFields(lastName, 'lastNameTable');
            self._checkFields(userName, 'userNameTable');

            var validPassword = Validation.isValidPassword(password);
            var validUserName = Validation.isValidUserName(userName);
            if(!validPassword){
                $('#passwordTable').css({"border-style": "solid", "border-color": "#FF0000"});
                return;
            } else {
                var validConfirmPassword = Validation.isValidPassword(confirmPassword);
                if(!validConfirmPassword){
                    $('#confirmPasswordTable').css({"border-style": "solid", "border-color": "#FF0000"});
                    return;
                } else {
                    $('#confirmPasswordTable').css({"border-style": "", "border-color": ""});
                    var samePassword = Validation.isSamePassword(password ,confirmPassword);
                    if(!samePassword){
                        self._errorText("Password don't match!");

                        $('#passwordTable').css({"border-style": "solid", "border-color": "#FF0000"});
                        $('#confirmPasswordTable').css({"border-style": "solid", "border-color": "#FF0000"});
                        return;
                    }
                    else{
                        $('#passwordTable').css({"border-style": "", "border-color": ""});
                        $('#confirmPasswordTable').css({"border-style": "", "border-color": ""});
                    }
                }

            }

            var role = $("#select").val();
            if(validUserName && validPassword){
                $.ajax({
                    url: '/controller/register',
                    type: 'POST',
                    data: JSON.stringify({
                        'userName': userName,
                        'firstName':firstName,
                        'lastName':lastName,
                        'address':address,
                        'password': password,
                        'userRole': role.toUpperCase()
                    }),
                    dataType: 'json',
                    contentType:'application/json',
                    success: function(data){
                        self._handleResponse(data);
                    },
                    error: function(dataError){
                        dataError = dataError.responseText;
                    }
                });
            }
        });
    }
    RegisterController.prototype._treatMissingFields = function(){
        this._insertMessage("Missing field");
    }
    RegisterController.prototype._errorText = function(message){
        this._insertMessage(message);
    }
    RegisterController.prototype._insertMessage = function(text){
        if(this._errorMessage){
            this._errorMessage.remove();
            this._errorMessage = null;
        }
        var toInsertRow = $('<tr id="errorMessage"></tr>');
        var toInsertCol = $('<td></td>');

        toInsertCol.text(text);
        toInsertRow.append(toInsertCol);

        console.log(this._formTable);
        var formBody = this._formTable.find('tbody');
        formBody.append(toInsertRow);
        this._errorMessage = toInsertRow;
    };

    RegisterController.prototype._handleResponse = function(data){
        console.log('Register -> response from register controller',data);
            if(data['redirect'] == true){
                window.location = data['toPage'];
            }

    };

    RegisterController.prototype._checkFields = function(field, fieldId) {
        var fieldValue = Validation.isValidUserName(field);
        if(!fieldValue){
            this._treatMissingFields();
            $('#'+fieldId).css({"border-style": "solid", "border-color": "#FF0000"});
            return;
        } else {
            $('#'+fieldId).css({"border-style": "", "border-color": ""});
        }
    };

    RegisterController.prototype._handleRefs = function() {
        $('#toForm').on('click', function () {
            window.location = '/form';
        });

        $('#toAccount').on('click', function () {
            window.location = "/account";
        });

        $('#titlu').on('click', function() {
            window.location = '/home';
        });
    };

    return RegisterController;
});