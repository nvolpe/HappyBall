/* global ffa */
(function () {
    'use strict';
    ffa.App.module('MainModule', function (Mod, App, Backbone, Marionette, $, _) {

        //==================================
        //initializer called on App.start(options)
        //==================================
        Mod.addInitializer(function (options) {
            Mod.controller = new MainController({
                config: options
            });
        });

        //==================================
        //Home Controller
        //==================================
        var MainController = Backbone.Marionette.Controller.extend({
            initialize: function (options) {
                _.bindAll.apply(_, [this].concat(_.functions(this)));

                this.region = App.MainRegion;

                this.modalRegion = App.modal;

                this.userTeamName = options.config.userTeamName;
                this.userId = 3; //switch to user auth
                this.resultId = options.config.resultId;

                //Prop Bet Entities
                //-----------------------------------------
                this.propModel = new ffa.App.PropModel();
                this.propCollection = new ffa.App.PropCollection();


                //Geo Results Entities
                //-----------------------------------------
                this.geoModel = new ffa.App.GeoModel();
                this.geoCollection = new ffa.App.GeoCollection();


                // log it
                console.log('Home controller initialized...');

                //Does not sync with server, so we can show template instantly.
                ffa.App.vent.on('show:home', this.showHomeView);

                //We have to fetch from server first.
                ffa.App.vent.on('show:prop', this.fetchBets);

                //Does not sync with server, so we can show template instantly.
                ffa.App.vent.on('show:map', this.showMapView);

                //Pop the modal, somehow
                ffa.App.vent.on('show:geoResults', this.fetchGeoResults);
            },

            //Render the Home View
            showHomeView: function () {
                this.HomeItemView = new ffa.App.HomeItemView({});
                this.region.show(this.HomeItemView);
            },

            //Render the Prop View
            showPropView: function () {
                this.HomeItemView = new ffa.App.HomeItemView({});
                this.region.show(this.HomeItemView);
            },

            //Render the Home View
            showMapView: function () {
                this.MapItemView = new ffa.App.MapItemView({});
                //this.MapItemView.render();

                this.region.show(this.MapItemView);
            },

            //go get bets from database
            fetchBets: function () {
                var self = this;

                this.propCollection.fetch({
                    success: this.fetchBetsCallback,
                    error: this.fetchBetsErrback
                });
            },

            //fetch bets success
            fetchBetsCallback: function (result) {
                console.log('fetch complete');

                this.PropCompositeView = new ffa.App.PropCompositeView({
                    model: this.propModel,
                    collection: this.propCollection
                });

                this.region.show(this.PropCompositeView);
            },

            //fetch bets error
            fetchBetsErrback: function (obj, xhr) {
                alert('Error ' + xhr.statusText);
            },


            //go get bets from database
            fetchGeoResults: function () {

                this.geoCollection.set([
                    {
                        teamName: 'greg',
                        distance: 50
                    },
                    {
                        teamName: 'tom',
                        distance: 20
                    }
                ])

                this.GeoResultsCompositeView = new ffa.App.GeoResultCompositeView({
                    model: this.geoModel,
                    collection: this.geoCollection
                });

                var modalRegion = new ffa.App.ModalRegion({ el: '#modal' });

                modalRegion.show(this.GeoResultsCompositeView);


                //this.GeoResultsCompositeView.render();
                //$('#geoResultsModal').modal('show');


                //var self = this;

                //this.propCollection.fetch({
                //    success: this.fetchGeoResultsCallBack,
                //    error: this.fetchGeoResultsErrback
                //});
            },

            //fetch bets success
            fetchGeoResultsCallBack: function (result) {
                console.log('fetch geo results complete');

                //this.PropCompositeView = new ffa.App.PropCompositeView({
                //    model: this.propModel,
                //    collection: this.propCollection
                //});

                //this.region.show(this.PropCompositeView);
            },

            //fetch bets error
            fetchGeoResultsErrback: function (obj, xhr) {
                alert('Error ' + xhr.statusText);
            }


        });
    }, ffa);
})();