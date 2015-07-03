/**
 * Created by root on 6/26/15.
 */
define([], function () {

    function BidController() {

    }

    BidController.prototype.start = function () {
        this._context = window.contextData;
        delete window.contextData;
        $('#contextData').remove();
        $('#errorMessage').remove();

        this._handleRefs();
        var self = this;

        var bidders = this._context.bidders;
        var startSum = this._context.startSum;
        var founderUserName = $('.settings').attr('data-founderUser');
        var userName = $('.settings').attr('data-userName');
        if (founderUserName == userName) {
            //disable bid button
            $('#bidButton').remove();
            $('.settings').append('<p id="errorMessage" style="border: 2px solid red">Nu puteti sa biduiti pe propriul anunt</p>');
            var bidDiv = $('#explicit-bidders');
            var list = '<ul style="list-style-type:none">';
            if (bidders != undefined) {
                for (var i = 0; i < bidders.length; i++) {
                    var currentBidder = bidders[i];
                    list += '<li>' + currentBidder.userName + ' a biduit ' + currentBidder.biddedSum + ' RON</li>';
                }
                list += '</ul>';
                bidDiv.append(list);
            } else {
                $('#explicit-bidders').append('<p id = "errorMessage" style="border: 2px solid red">Nu exista niciun bidder</p>');
            }
        } else {
            var alreadyBidded = false;
            var bidDiv = $('#explicit-bidders');
            var list = '<ul style="list-style-type:none">';
            if (bidders != undefined) {
                for (var i = 0; i < bidders.length; i++) {
                    var currentBidder = bidders[i];
                    list += '<li>' + currentBidder.userName + ' a biduit ' + currentBidder.biddedSum + ' RON</li>';
                    if(currentBidder.userName == userName) {
                        alreadyBidded = true;
                    }
                }
                list += '</ul>';
                bidDiv.append(list);
                if(alreadyBidded == true) {
                    $('.settings').append('<p id = "errorMessageBid" style="border: 2px solid red">Deja ati biduit!</p>');
                    $('#bidButton').remove();
                }
            } else {
                console.log('BIDDERS');
                $('#explicit-bidders').append('<p id = "errorMessage" style="border: 2px solid red">Nu exista niciun bidder</p>');
            }
            //$('#errorMessage').remove();

            $('#bidButton').on('click', function () {
                var biddedSum = $('#suma-text').val();
                var bidderModel = {};
                if (biddedSum < startSum) {
                    $('.settings').append('<p id = "errorMessage" style="border: 2px solid red">Suma biduita este mai mica decat suma minima</p>');
                } else {
                    $('#errorMessage').remove();

                    //make ajax call to the backend
                    bidderModel["userName"] = userName;
                    bidderModel["announceId"] = $('.settings').attr('data-announceId');
                    bidderModel["bidSum"] = biddedSum;

                    $.ajax({
                        url: '/controller/bid',
                        type: 'POST',
                        data: JSON.stringify(bidderModel),
                        dataType: "json",
                        success: function (data) {

                            var newBidder = {
                                userName: userName,
                                biddedSum: biddedSum
                            };
                            self._handleBid(newBidder);
                        },
                        error: function (data) {

                        }
                    });
                }
            });
        }
    };

    BidController.prototype._handleBid = function (contextData) {
        $('#errorMessage').remove();
        if ($('#explicit-bidders ul')) {
            $('#explicit-bidders ul').append('<li>' + contextData.userName + ' a biduit ' + contextData.biddedSum + ' RON</li>');
        }else {
            var list = '<ul style="list-style-type:none">';
            list += '<li>' + contextData.userName + ' a biduit ' + contextData.biddedSum + ' RON</li>';
            list += '</ul>';
            $('#explicit-bidders ul').append(list);
        }
    };

    /**
     * Function used to initialize events for external refs.
     * @private
     */
    BidController.prototype._handleRefs = function () {
        $('#toAccount').on('click', function () {
            window.location = "/account";
        });

        $('#toForm').on('click', function () {
            window.location = '/form';
        });

        $('#titlu').on('click', function () {
            window.location = "/home";
        });
    };

    return BidController;
});