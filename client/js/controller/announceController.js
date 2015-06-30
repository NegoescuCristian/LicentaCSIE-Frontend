/**
 * Created by root on 3/30/15.
 */
define([], function() {

    function AnnounceController() {

    }

    AnnounceController.prototype.start = function () {
        var _self = this;

        this._handleRefs();

        $('#submitButton').on('click', function() {
            var title = $('#title').val();
            var category = $("#selectCategory").val();
            var description = $('#descriptionId').val();
            var startSum = $('#startSumId').val();
            var data = {
                'title':title,
                'category':category.toUpperCase(),
                'description':description,
                'startSum':startSum
            };
            console.log(data);
            $.ajax({
                url:'/controller/announce',
                type:'POST',
                data: JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success: function(data) {
                    _self.handleResponseData(data);
                },
                error: function(error) {

                }
            });
        });
    };

    AnnounceController.prototype.handleResponseData = function(data) {
        console.log('Received data on client side:',data);
        window.location='/home';
    };

    AnnounceController.prototype._handleRefs = function() {
        $('#toAccount').on('click', function() {
            window.location = "/account";
        });

        $('#toForm').on('click', function () {
            window.location = '/form';
        });

        $('#titlu').on('click', function () {
            window.location = "/home";
        });
    };

    return AnnounceController;

});