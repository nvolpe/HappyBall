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

            //var resultUrl = null;

            //if (this.restAction === 'POST') {
            //    resultUrl = ffa.siteRoot + '/api/result'
            //}

            //if (this.restAction === 'PUT') {
            //    resultUrl = ffa.siteRoot + '/api/result/' + this.id;
            //}

            //if (this.restAction === 'GET') {
            //    resultUrl = ffa.siteRoot + '/api/result/week'
            //}

            //return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.ResultsCollection = Backbone.Collection.extend({
        //model: ffa.App.PropModel,

        //initialize: function (options) {
        //    options || (options = {});//jshint ignore:line

        //    console.log('Init Prop Collection');
        //},s

        url: function () {
            //return ffa.siteRoot + '/api/prop';
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
        template: '#results-template'
    });

    //Collection View
    ffa.App.ResultsCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

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
        }



    



    });

}(jQuery, Backbone, _));