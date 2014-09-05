/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';

    //===============
    //VIEWS
    //===============

    ffa.App.HomeItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },
        template: '#home-template',
        events: {
            'click .jumbotron': 'test',
            'click .logOutModal': 'logOut'
        },

        test: function () {
            //ffa.App.trigger("route:prop");
        },

        logOut: function () {
            $('#learnMore').modal('show');
        },

    });


}(jQuery, Backbone, _));