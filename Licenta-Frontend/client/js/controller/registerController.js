/**
 * Created by ciprian on 21.03.2015.
 */
define(['/js/controller/validateUser.js'], function (Validation) {

    function RegisterController() {

    }

    RegisterController.prototype.start = function(){

        this._root = $($('#app-container')[0]);
        this._formTable = this._root.find('#registerForm');

        var self = this;
        $('#loginB').on('click', function(){
            var userName = $('#userName').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();

            var validUsername = Validation.isValidUserName(userName);
            if(!validUsername){
                self._treatMissingFields();
                $('#userNameTable').css({"border-style": "solid", "border-color": "#FF0000"});
                return;
            } else {
                $('#userNameTable').css({"border-style": "", "border-color": ""});
            }
            var validPassword = Validation.isValidPassword(password);
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
            if(validUsername && validPassword){
                $.ajax({
                    url: '/controller/register',
                    type: 'POST',
                    data: JSON.stringify({
                        'userName': userName,
                        'password': password,
                        'role': role
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
    }

    RegisterController.prototype._handleResponse = function(data){
            if(data['redirect'] == true){
                window.location = data['toPage'];
            }

    }

    return RegisterController;
});