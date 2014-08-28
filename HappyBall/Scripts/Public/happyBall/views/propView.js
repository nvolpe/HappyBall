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
        url: function () {
            var resultUrl = '/happyball/api/result/' + this.id ;


            return resultUrl;
        }
    });

    //===============
    //COLLECTION
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

            //this.model = new ffa.App.PropModel();
        },
        childView: ffa.App.PropItemView,
        childViewContainer: "#prop-bet-container",
        template: "#prop-container-template",

        events: {
            'click #submitProp': 'submitProp',
        },

        submitProp: function (evt) {
            console.log('Save Prop bets!');

            this.model.set({
                PropBet1: "yes"
            });

            this.model.save({}, {
                success: this.saveCallback,
                error: this.saveErrback
            });
        },

        saveCallback: function (obj, xhr) {
            console.log('Save success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save Error');
        }



    });

}(jQuery, Backbone, _));