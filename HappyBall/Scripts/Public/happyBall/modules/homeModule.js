/* global ffa */
(function () {
    'use strict';
    ffa.App.module('HomeModule', function (Mod, App, Backbone, Marionette, $, _) {

        //==================================
        //initializer called on App.start(options)
        //==================================
        Mod.addInitializer(function (options) {
            Mod.controller = new HomeController({
                region: App.MainRegion
            });
        });

        //==================================
        //Home Controller
        //==================================
        var HomeController = Backbone.Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll.apply(_, [this].concat(_.functions(this)));
                this.region = options.region;

                this.HomeItemView = new ffa.App.HomeItemView({});

                // log it
                console.log('Home controller initialized...');

                ffa.App.vent.on('show:home', this.showView);
            },

            //Render the View
            showView: function () {

                this.region.show(this.HomeItemView);
            }

        });
    }, ffa);
})();