﻿/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.UserLocationModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init Geo Model');
        },
        idAttribute: "id",
        restAction: 'GET',
        url: function () {

            var resultUrl;

            resultUrl = ffa.siteRoot + 'api/UserLocation';

            if (this.restAction === 'POST') {
                resultUrl = ffa.siteRoot + 'api/UserLocation'
            }

            if (this.restAction === 'PUT') {
                resultUrl = ffa.siteRoot + 'api/UserLocation/' + this.id;
            }

            if (this.restAction === 'GET') {
                resultUrl = ffa.siteRoot + 'api/userlocation/team'
            }

            return resultUrl;
        }
    });

    //===============
    //COLLECTIONS
    //===============

    ffa.App.UserLocationCollection = Backbone.Collection.extend({

        url: function () {
            return ffa.siteRoot + 'api/UserLocation';
        },
    });


    //===============
    //MODELS
    //===============
    ffa.App.GeoModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init Geo Model');
        },
        idAttribute: "id",
        restAction: 'GET',
        url: function () {

            var resultUrl = null;

            if (this.restAction === 'POST') {
                resultUrl = ffa.siteRoot + '/api/georesult'
            }

            if (this.restAction === 'PUT') {
                resultUrl = ffa.siteRoot + '/api/georesult/' + this.id;
            }

            if (this.restAction === 'GET') {
                resultUrl = ffa.siteRoot + '/api/georesult/week'
            }

            return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.GeoCollection = Backbone.Collection.extend({

        url: function () {
            return ffa.siteRoot + '/api/allgeoresult/week';
        },
    });




    //===============
    //VIEWS
    //===============

    //Item View
    ffa.App.GeoResultItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },

        tagName: 'tr',
        template: '#geo-results-template'
    });

    //Collection View
    ffa.App.GeoResultCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init Prop Composite View');

        },
        childView: ffa.App.GeoResultItemView,
        childViewContainer: "#geo-results-container",
        template: "#geo-results-modal-container-template"

        //ui: {
        //    //submitPropBtn: '#submitProp'
        //},

        //events: {
        //    //'click .yesBtn': 'yesBtnClick',
        //    //'click .noBtn': 'noBtnClick',
        //    //'click #submitProp': 'submiPropClickHandler'
        //}


    });

}(jQuery, Backbone, _));