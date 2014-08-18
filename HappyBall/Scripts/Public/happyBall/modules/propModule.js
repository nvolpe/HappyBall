/* global ffa */
(function () {
    'use strict';
    ffa.App.module('PropModule', function (Mod, App, Backbone, Marionette, $, _) {

        //==================================
        //initializer called on App.start(options)
        //==================================
        Mod.addInitializer(function (options) {
            Mod.controller = new PropController({
                region: App.MainRegion
            });
        });

        //==================================
        //Controller for the Search
        //==================================
        var PropController = Backbone.Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll.apply(_, [this].concat(_.functions(this)));
                this.region = options.region;

                //this.collection = new ffa.App.SearchResultCollection({
                //    baseUrl: options.config.docketApiUrl,
                //});

                this.propView = new ffa.App.PropItemView({
                    conifg: options
                });

                // log it
                console.log('Prop controller initialized...');

                this.init()
            },

            init: function () {
                this.region.show(this.propView);
            }
        });
    }, ffa);
})();