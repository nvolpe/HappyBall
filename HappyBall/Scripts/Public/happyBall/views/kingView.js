/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.KingModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init King Model');
        },
        idAttribute: "id",
        restAction: 'GET',

        url: function () {

            var resultUrl = null;

            if (this.restAction === 'POST') {
                resultUrl = ffa.siteRoot + '/api/kingresult';
            }

            if (this.restAction === 'PUT') {
                resultUrl = ffa.siteRoot + '/api/kingresult/' + this.id;
            }

            if (this.restAction === 'GET') {
                resultUrl = ffa.siteRoot + '/api/kingresult/week';
            }

            return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.KingCollection = Backbone.Collection.extend({

        url: function () {
            return ffa.siteRoot + '/api/king';
        },

    });


    //===============
    //VIEWS
    //===============

    //Item View
    ffa.App.KingItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },
        //tagName: 'li',
        //className: "list-group-item king-item",
        template: '#king-template'
    });

    //Collection View
    ffa.App.KingCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init King Composite View');

            this.userSelectionArray = options.userSelectionArray;
            this.hasAlreadySelected = options.hasAlreadySelected;

            this.fetchKingResultsModel();

            var eventType = ffa.isMobile ? 'touchend' : 'click';
            this.events[eventType + ' #submitKing'] = 'submiKingClickHandler';


        },
        childView: ffa.App.KingItemView,
        childViewContainer: "#king-bet-container",
        template: "#king-container-template",

        ui: {
            submitKingBtn: '#submitKing'
        },

        events: {
            //'click #submitKing': 'submiKingClickHandler'
        },

        onShow: function () {

            console.log('King View OnShow');

            //set question ghetto ajax way
            var question, team;

            $.getJSON(ffa.siteRoot + "/api/king", function (json) {

                _.each(json, function (item) {
                    console.log('king get!');

                    question = item.question;
                    team = item.teamName;
                });


                var questionString = String.format('<strong>{0}</strong> asks: {1}', team, question)

                $('#kingQuestionContainer').html(questionString);


            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log('Shits fucked bro');
            });

            var kingContainer = document.getElementById('king-bet-container');
            this.sorter = new Sortable(kingContainer, {
                onEnd: this.dragEnd
            });

            var pick1 = $.trim($('#king1').text());
            var pick2 = $.trim($('#king2').text());
            var pick3 = $.trim($('#king3').text());

            _.each(this.userSelectionArray, function (id) {

                pick1 = $.trim($('#king' + id).text());
                pick2 = $.trim($('#king' + id).text());
                pick3 = $.trim($('#king' + id).text());

                $('#king' + id).addClass('text-success');
                $('#king' + id).addClass('text-success');
                $('#king' + id).addClass('text-success');

            });

            if (this.hasAlreadySelected) {

                var counter = 1;
                $('#king-bet-container').find("li").each(function () {

                    if (counter > 3) {
                        $(this).removeClass("text-success");
                        $(this).addClass("text-danger");
                    }
                    counter++
                });

            }
            

            this.model.set({
                pick1: pick1,
                pick2: pick2,
                pick3: pick3
            })

            this.ui.submitKingBtn.removeClass('disabled');

        },

        dragEnd: function (evt) {

            var self = this;
            var pick1, pick2, pick3;

            console.log('Shit is done dragging');

            var idsInOrder = [];
            $("ul#king-bet-container li").each(function () { idsInOrder.push($(this).attr('id')) }); //gets the element id
            //$("ul#king-bet-container li").each(function () { idsInOrder.push($(this)) }); //gets the element

            var counter = 0;

            _.each(idsInOrder, function (kingId) {
                console.log(kingId);

                counter++;

                $('#' + kingId).removeClass('text-danger');
                $('#' + kingId).removeClass('text-success');

                if (counter == 1) {
                    //set pick1
                    $('#' + kingId).addClass('text-success');
                    pick1 = $.trim($('#' + kingId).text());
                    self.model.set('pick1', pick1);

                } else if (counter == 2) {
                    //set pick2
                    $('#' + kingId).addClass('text-success');
                    pick2 = $.trim($('#' + kingId).text());
                    self.model.set('pick2', pick2);

                } else if (counter == 3) {
                    //set pick3
                    $('#' + kingId).addClass('text-success');
                    pick3 = $.trim($('#' + kingId).text());
                    self.model.set('pick3', pick3);

                } else {
                    $('#' + kingId).addClass('text-danger');
                }

            });

        },

        submiKingClickHandler: function (evt) {

            this.submitKingBtn = Ladda.create($(this.ui.submitKingBtn)[0]);
            this.submitKingBtn.start();


            if (this.model.restAction === 'POST') {
                this.model.save({}, {
                    type: 'POST',
                    success: this.saveCallback,
                    error: this.saveErrback
                });
            } else {
                this.model.save({}, {
                    success: this.saveCallback,
                    error: this.saveErrback
                });
            }
        },

        saveCallback: function (obj, xhr) {
            this.submitKingBtn.stop();

            //make sure the next time the user submits, if they do, that it is a put instead
            this.model.restAction = 'PUT';

            //display success message to the user
            $('#modalSuccess').modal();

            console.log('Save Success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save Error');
        },

        fetchKingResultsModel: function () {
            var self = this;

            //set url to get url
            this.model.restAction = 'GET';

            this.model.fetch({
                success: function (results) {
                    console.log('yes got results model ya dig');
                    console.dir(results);

                    //get the unique Id in the prop table and set it as the id, so we can PUT! instead of post
                    //self.model.id = results.get('id');

                    self.initView();

                },
                error: function () {
                    console.log('noo');
                }
            });
        },

        initView: function () {

            //TODO: maybe use backbone.model.validate or something
            //Need a way to set flag between post and put
            this.model.restAction = 'POST';

            var pick1 = this.model.get("pick1");

            // dont remove default button icons if no data defined
            if (pick1) {

                this.model.restAction = 'PUT';
                console.log("TODO: INIT KING VIEW DIFFERENTLY IF USER HAS ALREADY ENTERED")
                console.dir(this.collection);
                //this.ui.submitKingBtn.addClass('disabled');

            }

        }






    });

}(jQuery, Backbone, _));