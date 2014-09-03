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
        //idAttribute: "id",
        //restAction: 'GET',

        url: function () {

            var resultUrl = null;

            if (this.restAction === 'POST') {
                resultUrl = '/happyball/api/result';
            }

            if (this.restAction === 'PUT') {
                resultUrl = '/happyball/api/result/';
            }

            if (this.restAction === 'GET') {
                resultUrl = '/happyball/api/result/week';
            }

            return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.KingCollection = Backbone.Collection.extend({

        url: function () {
            return '/happyball/api/prop';
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
        tagName: 'li',
        className: "list-group-item",
        template: '#king-template'
    });

    //Collection View
    ffa.App.KingCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init King Composite View');


        },
        childView: ffa.App.KingItemView,
        childViewContainer: "#king-bet-container",
        template: "#king-container-template",

        ui: {
            submitPropBtn: '#submitKing'
        },

        events: {
            'click #submitProp': 'submiKingClickHandler'
        },

        submiKingClickHandler: function (evt) {

            console.log('Shit is working');

        },


        onShow: function () {

            console.log('King View OnShow');

            var kingContainer = document.getElementById('king-bet-container');
            new Sortable(kingContainer);


        }



    });

}(jQuery, Backbone, _));