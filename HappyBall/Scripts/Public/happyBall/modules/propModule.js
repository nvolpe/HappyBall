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

                this.collection = new ffa.App.PropCollection();

                var obj = [
                     {
                         Bet: 10,
                         Id: 'nick1'
                     },
                     {
                         Bet: 20,
                         Id: 'nick2'
                     },
                     {
                         Bet: 30,
                         Id: 'nick3'
                     },
                     {
                         Bet: 40,
                         Id: 'nick4'
                     }
                ];

                this.collection.set(obj);


                this.PropCollectionView = new ffa.App.PropCollectionView({
                    collection: this.collection
                });

                // log it
                console.log('Prop controller initialized...');

                //this.init()
            },

            init: function () {
                this.region.show(this.PropCollectionView);
            }
        });
    }, ffa);
})();