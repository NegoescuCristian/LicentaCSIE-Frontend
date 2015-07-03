/**
 * Created by root on 3/30/15.
 */

define(['../lib/LogModule.js'], function (LogModule) {

    function HomeController() {

    }

    HomeController.prototype.start = function () {

        this._handleRefs();
        this._handleIcons();
        this._handleLogout();

        this._loading = $('<div class="loading"><div class="loader"></div></div>');
        $('#myGrid').append(this._loading);
        var self = this;
        setTimeout(function () {
            self.createMockData();
        }, 1000);
        //this.createMockData();
    };

    HomeController.prototype.createMockData = function () {
        var self = this;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/controller/announce',
            success: function (data) {
                //this._createGrid(data);
                var gridData = [];
                for (var i = 0; i < data.length; i++) {
                    gridData[i] = {
                        title: data[i].title,
                        description: data[i].description,
                        category: data[i].category,
                        startDate: data[i].startDate,
                        endDate: data[i].endDate,
                        startSum: data[i].startSum,
                        announceId: data[i].announceId
                    };
                }
                self._loading.fadeOut();
                self._createGrid(gridData);
            },
            error: function (data) {
                self._loading.fadeOut();
            }
        });
    };

    HomeController.prototype._createGrid = function (data) {
        var grid;

        var options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            multiColumnSort: true
        };

        var dayFormatter = function (row, cell, value, columnDef, dataContext) {
            return value + ' days';
        };

        var htmlFormatter = function (row, cell, value, columnDef, dataContext) {
            return "<a href=/announce?announceId=" + dataContext.announceId + ">" + value + "</a>";
        };

        var dateFormatter = function (row, cell, value, columnDef, dataContext) {
            value = new Date(value);
            return value.getMonth() + '/' + value.getDate() + '/' + value.getFullYear();
        };
        var columns = [
            {
                id: "title",
                name: "Titlu Anunt",
                field: "title",
                sortable: true,
                formatter: htmlFormatter,
                width: 295,
                selectable: true
            },
            {id: "description", name: "Descriere", field: "description", sortable: true, width: 295},
            {id: "category", name: "Categorie", field: "category", sortable: true, width: 295},
            {
                id: "startDate",
                name: "Data Start",
                field: "startDate",
                formatter: dateFormatter,
                sortable: true,
                width: 295
            },
            {id: "endDate", name: "Data Final", field: "endDate", formatter: dateFormatter, sortable: true, width: 295},
            {id: "startSum", name: "Suma pornire", field: "startSum", sortable: true, width: 295}
        ];

        grid = new Slick.Grid("#myGrid", data, columns, options);
        grid.onSort.subscribe(function (e, args) {
            var cols = args.sortCols;
            data.sort(function (dataRow1, dataRow2) {
                for (var i = 0, l = cols.length; i < l; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = dataRow1[field], value2 = dataRow2[field];
                    var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result != 0) {
                        return result;
                    }
                }
                return 0;
            });
            grid.invalidate();
            grid.render();
        });
    };

    HomeController.prototype._handleRefs = function () {
        $('#toForm').on('click', function () {
            window.location = '/form';
        });

        $('#toAccount').on('click', function () {
            window.location = "/account";
        });

        $('#titlu').on('click', function () {
            window.location = '/home';
        });
    };

    HomeController.prototype._handleIcons = function () {
        var self = this;
        var icon = $('.icons');
        icon.on('click', function () {
            var attr = $(this).find('img').attr('src');
            var category;
            if (attr.indexOf('.png')) {
                category = attr.substr(attr.lastIndexOf('/') + 1, attr.indexOf('.png') - attr.lastIndexOf('/') - 1);
            } else if (attr.indexOf('.jpg')) {
                category = attr.substr(attr.lastIndexOf('/') + 1, attr.indexOf('.jpg') - attr.lastIndexOf('/') - 1);
            } else if (attr.indexOf('.jpeg')) {
                category = attr.substr(attr.lastIndexOf('/') + 1, attr.indexOf('.jpeg') - attr.lastIndexOf('/') - 1);
            } else if (attr.indexOf('.gif')) {
                category = attr.substr(attr.lastIndexOf('/') + 1, attr.indexOf('.gif') - attr.lastIndexOf('/') - 1);
            } else {
                console.log('add another else if to check that particular image type');
            }
            var realCategory;
            switch (category) {
                case 'arta' :
                    realCategory = 'ART';
                    break;
                case 'bijuteri':
                    realCategory = 'JEWELRY';
                    break;
                case 'collectables':
                    realCategory = 'COLLECTABLES';
                    break;
                case 'estate':
                    realCategory = 'ESTATE';
                    break;
                case 'fashion':
                    realCategory = 'FASHION';
                    break;
                case 'Vehicule':
                    realCategory = 'VEHICLES';
                    break;
            }

            $.ajax({
                url: '/controller/announce',
                type: 'POST',
                data: JSON.stringify({
                    category: realCategory
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    var gridData = [];
                    for (var i = 0; i < data.length; i++) {
                        gridData[i] = {
                            title: data[i].title,
                            description: data[i].description,
                            category: data[i].category,
                            startDate: data[i].startDate,
                            endDate: data[i].endDate,
                            startSum: data[i].startSum,
                            announceId: data[i].announceId
                        };
                    }
                    self._loading.fadeOut();
                    self._createGrid(gridData);
                },
                error: function (data) {
                    self._loading.fadeOut();
                }
            });

        });
    };

    HomeController.prototype._handleLogout = function() {
        $('#logoutId').on('click', function() {
            LogModule.logout();
        });
    };

    return HomeController;
});