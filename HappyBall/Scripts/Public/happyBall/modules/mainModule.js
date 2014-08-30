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
                this.userTeamName = options.config.userTeamName;
                this.userId = 3; //switch to user auth
                this.resultId = options.config.resultId;

                //Prop Bet Entities
                //-----------------------------------------
                this.propModel = new ffa.App.PropModel({ id: 2 });
                this.propCollection = new ffa.App.PropCollection();


                this.propResultModel = new ffa.App.PropResultModel();
                


                // log it
                console.log('Home controller initialized...');

                //Does not sync with server, so we can show template instantly.
                ffa.App.vent.on('show:home', this.showHomeView);

                //We have to fetch from server first.
                ffa.App.vent.on('show:prop', this.fetchBets);
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

            //go get bets from database
            fetchBets: function () {
                var self = this;

                this.propResultModel.fetch({
                    success: function (results) {
                        console.log('yess');
                        console.dir(results);
                    },
                    error: function () {
                        console.log('noo');
                    }
                });


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
            }

        });
    }, ffa);
})();