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
                this.resultsCollection = new ffa.App.ResultsCollection();
                this.allResultsCollection = new ffa.App.AllResultsCollection();


                //Geo Results Entities
                //-----------------------------------------
                this.geoModel = new ffa.App.GeoModel();
                this.geoCollection = new ffa.App.GeoCollection();

                //User Location Entities
                //-----------------------------------------
                this.userLocationModel = new ffa.App.UserLocationModel();
                this.userLocationCollection = new ffa.App.UserLocationCollection();


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
                var self = this;

                //TODO, get from server
                this.resultsCompositeView = new ffa.App.ResultsCompositeView({
                    model: this.resultsModel,
                    collection: this.resultsCollection,
                    allResultsCollection: this.allResultsCollection
                });

                this.resultsCollection.fetch({
                    success: function (results) {
                        //init view
                        self.region.show(self.resultsCompositeView);
                    },
                    error: function () {
                        console.log('noo kingCollection results');
                    }
                });
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

            fetchKingResultsModel: function () {
                var self = this;

                //set url to get url
                this.kingModel.restAction = 'GET';

                this.kingModel.fetch({
                    success: function (results) {
                        console.log('yes got results model ya dig');
                        console.dir(results);

                        //get the unique Id in the prop table and set it as the id, so we can PUT! instead of post
                        //self.model.id = results.get('id');

                        self.sortCollectionThenRender();


                    },
                    error: function () {
                        console.log('noo');
                    }
                });
            },

            //go get bets from database
            fetchKingBets: function () {
                
                var self = this;

                this.kingCollection.fetch({
                    success: function (results) {
                        //init view
           


                        self.fetchKingResultsModel();

                        
                    },
                    error: function () {
                        console.log('noo kingCollection results');
                    }
                });
            },

            //go get bets from database
            sortCollectionThenRender: function () {
                var self = this;

                var self = this;
                var pick1 = this.kingModel.get("pick1");
                var pick2 = this.kingModel.get("pick2");
                var pick3 = this.kingModel.get("pick3");

                var hasAlreadySelected = false;

                if (pick1) {
                    var userSelection1 = this.kingCollection.findWhere({ pick: pick1 });
                    console.log('omg what it do bitch');
                    console.dir(userSelection1);
                }

                if (pick2) {
                    var userSelection2 = this.kingCollection.findWhere({ pick: pick2 });
                    console.log('omg what it do bitch');
                    console.dir(userSelection2);
                }

                if (pick3) {
                    var userSelection3 = this.kingCollection.findWhere({ pick: pick3 });
                    console.log('omg what it do bitch');
                    console.dir(userSelection3);
                }

                if (pick1 && pick2 && pick3) {
                    console.log(userSelection1.id);
                    console.log(userSelection2.id);
                    console.log(userSelection3.id);

                    var userSelectionArray = [userSelection1.id, userSelection2.id, userSelection3.id]

                    this.kingCollection.remove(userSelection1);
                    this.kingCollection.remove(userSelection2);
                    this.kingCollection.remove(userSelection3);

                    this.kingCollection.add(userSelection1, { at: 0 });
                    this.kingCollection.add(userSelection2, { at: 1 });
                    this.kingCollection.add(userSelection3, { at: 2 });

                    hasAlreadySelected = true;
                }


                self.KingCollectionView = new ffa.App.KingCompositeView({
                    model: self.kingModel,
                    collection: self.kingCollection,
                    userSelectionArray: userSelectionArray,
                    hasAlreadySelected: hasAlreadySelected
                });


                self.region.show(self.KingCollectionView);
            },


            //go get bets from database
            fetchGeoResults: function () {

                var self = this;

                this.geoCollection.fetch({
                    success: function (results) {
                        
                        self.MapItemView = new ffa.App.MapItemView({
                            model: self.geoModel,
                            collection: self.geoCollection,
                            teamName: self.userTeamName,
                            userLocationModel: self.userLocationModel,
                            userLocationCollection: self.userLocationCollection
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