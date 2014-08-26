﻿/*global ffa */
if (!this.ffa || typeof this.ffa !== 'object') {
    this.ffa = {};
}
(function () {
    'use strict';

    // auto render on change
    //Backbone.Marionette.ItemView.prototype["modelEvents"] = { "change": "render" };

    ffa.App = new Backbone.Marionette.Application();

    //Add an initializer to the app to expose a property
    //we can check in the rest of the code to decide if
    //we are in the Mobile app or not.
    ffa.App.addInitializer(function (options) {
        options = options || {};
        var regions = options.regions || {};

        ffa.App.addRegions(regions);
    });

    //navigate to route
    ffa.App.navigate = function (route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    //get current route
    ffa.App.getCurrentRoute = function () {
        return Backbone.history.fragment
    };


    // fires before ALL addInitializers have been run!
    ffa.App.on("initialize:before", function (options) {
        // none added thus far
    });

    // fires after ALL addInitializers have been run!
    ffa.App.on('start', function (options) {
        // function receives the options passed into Application.start() method.

        //start listening to the router
        if (Backbone.history) {
            Backbone.history.start();

            if (this.getCurrentRoute() === "") {
                ffa.App.trigger("route:home");
            }
        }
    });

    //debugging so we can see events flying around
    ffa.App.vent.on('all', function (evt, model) {
        console.log('APP:DEBUG: Event Caught: ' + evt, model);
    });

})();