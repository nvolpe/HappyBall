/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.ResultsModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init Results Model');

        },
        idAttribute: "id",
        restAction: 'GET',

        url: function () {

            var resultUrl = ffa.siteRoot + '/api/final/week';
            return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.ResultsCollection = Backbone.Collection.extend({

        url: function () {
            var resultUrl = ffa.siteRoot + '/api/final/week';
            return resultUrl;
        },
    });



    ffa.App.AllResultsCollection = Backbone.Collection.extend({

        url: function () {
            var resultUrl = ffa.siteRoot + '/api/final';
            return resultUrl;
        },
    });




    //===============
    //VIEWS
    //===============

    //Item View
    ffa.App.ResultsItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init result item Composite View');
        },
        //model: ffa.PropModel,
        template: '#results-template',
        tagName: 'tr'
    });

    //Collection View
    ffa.App.ResultsCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            this.allResultsCollection = options.allResultsCollection;

            console.log('Init Results Composite View');

            var eventType = ffa.isMobile ? 'touchend' : 'click';
            this.events[eventType + ' .yesBtn'] = 'yesBtnClick';
            this.events[eventType + ' .noBtn'] = 'noBtnClick';
            this.events[eventType + ' #submitProp'] = 'submiPropClickHandler';

        },
        childView: ffa.App.ResultsItemView,
        childViewContainer: "#final-results-container",
        template: "#results-container-template",


        //ui: {
        //    submitPropBtn: '#submitProp'
        //},

        events: {
            //'click .yesBtn': 'yesBtnClick',
            //'click .noBtn': 'noBtnClick',
            //'click #submitProp': 'submiPropClickHandler'
        },


        onShow: function () {

            this.mungeData();

            this.getTotalWeeks();

            //this.getYearlyData();

            //this.displayOngoingLineGraph();

            this.displayWeeklyColumnGraph();
        },


        getTotalWeeks: function () {
            var self = this;

            $.getJSON(ffa.siteRoot + "/api/week", function (json) {


                var amountOfWeeks = json[0].week_id;


                self.getYearlyData(amountOfWeeks);

            })

         .fail(function (jqXHR, textStatus, errorThrown) {
             console.warn('Didnt GET yearly data')
         });
        },


        getYearlyData: function (amountOfWeeks) {
            var self = this;

            $.getJSON(ffa.siteRoot + "/api/final/year", function (json) {

                self.displayOngoingLineGraph(json);

            })

         .fail(function (jqXHR, textStatus, errorThrown) {
             console.warn('Didnt GET yearly data')
         });
        },

        mungeData: function () {
            var self = this;
            var json = this.collection.toJSON();
            this.teamsPropData = [];
            this.teamsKingData = [];
            this.teamsArray = [];
            var data;

            _.each(json, function (item) {

                self.teamsArray.push(item.teamName);
                self.teamsPropData.push(item.propResult);
                self.teamsKingData.push(item.kingResult);

                data = _.where(json, { 'teamName': item.teamName });

                //teamsData.push(data);
                //yearTotal = item.yearTotal;
                //teamName = item.teamName;
            });

            console.log('munging data');
            //console.dir(teamsData);


            //_.each(teamsData, function (item) {
            //    console.dir(item[0].week);
            //});


        },

        displayOngoingLineGraph: function (data) {

            $('#graph-year-container').highcharts({
                title: {
                    text: 'Season Results',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Total Combined Score',
                    x: -20
                },
                xAxis: {
                    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
                },
                yAxis: {
                    title: {
                        text: 'Points'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'Points'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: data
            });
        },


        displayWeeklyColumnGraph: function () {

            console.log('displayWeeklyColumnGraph');
            console.dir(this.teamsArray);

            $('#graph-week-container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Weekly Results'
                },
                xAxis: {
                    categories: this.teamsArray
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Points'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -70,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Props',
                    data: this.teamsPropData
                }, {
                    name: 'Kings',
                    data: this.teamsKingData
                }]
            });
        }

      

    });

}(jQuery, Backbone, _));

