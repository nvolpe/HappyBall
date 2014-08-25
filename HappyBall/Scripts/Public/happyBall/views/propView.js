/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.propModel = Backbone.Model.extend({});

    //===============
    //COLLECTION
    //===============
    ffa.App.PropCollection = Backbone.Collection.extend({
        model: ffa.App.propModel,

        initialize: function (options) {
            options || (options = {});//jshint ignore:line

            console.log('Init Prop Collection');
        },

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
        model: ffa.propModel,
        template: '#prop-template'
    });

    //Collection View
    ffa.App.PropCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init Prop Composite View');
        },
        childView: ffa.App.PropItemView,
        childViewContainer: "#prop-bet-container",
        template: "#prop-container-template"
    });

}(jQuery, Backbone, _));