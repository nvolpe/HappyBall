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

                this.PropCollectionView = new ffa.App.PropCollectionView({
                    collection: this.collection
                });

                // log it
                console.log('Prop controller initialized...');

                this.fetchBets()
            },

            //go get bets from database
            fetchBets: function () {

                this.collection.fetch({
                    success: this.fetchCallback,
                    error: this.fetchErrback
                });
            },

            //fetch success
            fetchCallback: function (result) {

                this.region.show(this.PropCollectionView);
            },

            //fetch error
            fetchErrback: function (obj, xhr) {
                alert('Error ' + xhr.statusText);
            }


        });
    }, ffa);
})();