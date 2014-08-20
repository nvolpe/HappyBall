/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.propModel = Backbone.Model.extend({
        defaults: {
            Id: 'nicksbets',
            Bet: 20
        }
    });

    //===============
    //COLLECTION
    //===============
    ffa.App.PropCollection = Backbone.Collection.extend({
        model: ffa.App.propModel,

        initialize: function (options) {
            options || (options = {});//jshint ignore:line

            console.log('Init Prop Collection');
        }
    });


    //===============
    //VIEWS
    //===============

    ffa.App.PropItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },
        model: ffa.propModel,
        template: '#prop-template',
        events: {
            'click .edit-by-docket': 'editResult'
        }
    });


    ffa.App.PropCollectionView = Marionette.CollectionView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init Prop Composite View');
        },
        childView: ffa.App.PropItemView
    });



}(jQuery, Backbone, _));