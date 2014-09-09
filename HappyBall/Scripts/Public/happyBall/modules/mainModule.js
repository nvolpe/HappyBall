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

                this.siteRoot = options.config.siteRoot;
                this.userTeamName = options.config.userTeamName;
                this.userId = 3; //switch to user auth
                this.resultId = options.config.resultId;

                //Prop Bet Entities
                //-----------------------------------------
                this.propModel = new ffa.App.PropModel();
                this.propCollection = new ffa.App.PropCollection();

                //King Bet Entities
                //-----------------------------------------
                this.kingModel = new ffa.App.KingModel();
                this.kingCollection = new ffa.App.KingCollection();


                //TODO:  INIT result Entities
                //-----------------------------------------
                this.resultsModel = new ffa.App.ResultsModel();
                this.geoCollection = new ffa.App.ResultsCollection();


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

                //We have to fetch from server first.
                ffa.App.vent.on('show:king', this.fetchKingBets);

                //Does not sync with server, so we can show template instantly.
                ffa.App.vent.on('show:map', this.fetchGeoResults);

                //TODO, fetch results
                ffa.App.vent.on('show:result', this.showReults);

                //Pop the modal, somehow
                ffa.App.vent.on('show:geoResults', this.showGeoResults);
            },

            //Render the Home View
            showHomeView: function () {
                this.HomeItemView = new ffa.App.HomeItemView({});
                this.region.show(this.HomeItemView);
            },

            //Render the Home View
            showGeoResults: function () {

                this.GeoResultsCompositeView = new ffa.App.GeoResultCompositeView({
                    model: this.geoModel,
                    collection: this.geoCollection
                });

                var modalRegion = new ffa.App.ModalRegion({ el: '#modal' });

                modalRegion.show(this.GeoResultsCompositeView);

            },

            
            //Render the Home View
            showReults: function () {

                //TODO, get from server
                this.resultsCompositeView = new ffa.App.ResultsCompositeView({
                    model: this.resultsModel, 
                    collection: this.geoCollection
                });

                this.region.show(this.resultsCompositeView);

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
            fetchKingBets: function () {
                
                var self = this;

                this.kingCollection.fetch({
                    success: function (results) {
                        //init view
                        self.KingCollectionView = new ffa.App.KingCompositeView({
                            model: self.kingModel,
                            collection: self.kingCollection
                        });

                        self.region.show(self.KingCollectionView);
                    },
                    error: function () {
                        console.log('noo kingCollection results');
                    }
                });

            },


            //go get bets from database
            fetchGeoResults: function () {

                var self = this;

                this.geoCollection.fetch({
                    success: function (results) {
                        
                        self.MapItemView = new ffa.App.MapItemView({
                            model: self.geoModel,
                            collection: self.geoCollection,
                            teamName: self.userTeamName
                        });

                        self.region.show(self.MapItemView);
                    },
                    error: function () {
                        console.log('noo geoCollection results');
                    }

                });

            }


        });
    }, ffa);
})();