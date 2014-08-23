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
            'click .edit-by-docket': 'editResult'
        }
    });


}(jQuery, Backbone, _));