/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.PropModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init Prop Model');
        },
        idAttribute: "Id",

        isSaving: false,

        url: function () {

            var resultUrl = null;

            if (this.isSaving) {
                resultUrl = '/happyball/api/result'
            } else {
                resultUrl = '/happyball/api/result/week'
            }

            return resultUrl;
        }
    });


    //ffa.App.PropResultModel = Backbone.Model.extend({
    //    initialize: function (options) {
    //        options || (options = {});

    //        console.dir(options);
    //        console.log('Init Prop Result Model');
    //    },
    //    idAttribute: "id",
    //    url: function () {

    //        var resultUrl = '/happyball/api/result/week';
    //        return resultUrl;
    //    }
    //});


    //===============
    //COLLECTIONS
    //===============

    ffa.App.PropCollection = Backbone.Collection.extend({
        //model: ffa.App.PropModel,

        //initialize: function (options) {
        //    options || (options = {});//jshint ignore:line

        //    console.log('Init Prop Collection');
        //},

        url: function () {
            return '/happyball/api/prop';
        },
    });


    //===============
    //VIEWS
    //===============

    //Item View
    ffa.App.PropItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },
        //model: ffa.PropModel,
        template: '#prop-template'
    });

    //Collection View
    ffa.App.PropCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init Prop Composite View');

            this.fetchResultsModel();

            //this.model = new ffa.App.PropModel();
        },
        childView: ffa.App.PropItemView,
        childViewContainer: "#prop-bet-container",
        template: "#prop-container-template",

        events: {
            'click .yesBtn': 'yesBtnClick',
            'click .noBtn': 'noBtnClick',
            'click #submitProp': 'submitProp'
        },

        yesBtnClick: function (evt) {

            var btnId = evt.currentTarget.id;

            //var selectorVal = evt.currentTarget.attributes[3].value; //i remember this threw a firefox error
            var selectorVal = $('#' + btnId).data().stuff; //stuff is the number needed, could be renamed

            //add and remove red/green classes
            $('#' + btnId).removeClass('btn-default');
            $('#' + btnId).addClass('btn-success');

            $('#noBtn' + selectorVal).removeClass('btn-danger');
            $('#noBtn' + selectorVal).addClass('btn-default');
        },

        noBtnClick: function (evt) {

            //get the current button clicked
            var btnId = evt.currentTarget.id;

            //var selectorVal = evt.currentTarget.attributes[3].value; //i remember this threw a firefox error
            var selectorVal = $('#' + btnId).data().stuff; //stuff is the number needed, could be renamed

            //add and remove red/green classes
            $('#' + btnId).removeClass('btn-default');
            $('#' + btnId).addClass('btn-danger');

            $('#yesBtn' + selectorVal).removeClass('btn-success');
            $('#yesBtn' + selectorVal).addClass('btn-default');
        },

        submitProp: function (evt) {
            console.log('Save Prop bets!');

            this.model.isSaving = true;

            this.model.set({
                PropBet1: "yes",
                PropBet2: "yes",
                PropBet3: "no",
                LogIns: 1,
                TeamName: 'Touchdown Jesus',
                UserId: '0c0161b3-1fd8-4433-a374-263cca41d19b'
            });

            this.model.save({}, {
                success: this.saveCallback,
                error: this.saveErrback
            });
        },

        fetchResultsModel: function () {
            console.dir(this.model);

            this.model.isSaving = false;

            this.model.fetch({
                success: function (results) {
                    console.log('yes got results model ya dig');
                    console.dir(results);
                },
                error: function () {
                    console.log('noo');
                }
            });


            console.log('fetchResultsModel');
        },

        saveCallback: function (obj, xhr) {
            console.log('Save Success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save Error');
        }



    });

}(jQuery, Backbone, _));