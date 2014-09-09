/*global ffa */
if (!this.ffa || typeof this.ffa !== 'object') {
    this.ffa = {};
}
(function () {
    'use strict';


    ffa.App = new Backbone.Marionette.Application();


    ffa.App.ModalRegion = Backbone.Marionette.Region.extend({

        constructor: function () {
            Marionette.Region.prototype.constructor.apply(this, arguments);

            this._ensureElement();
            this.$el.on('hidden', { region: this }, function (event) {
                event.data.region.close();
            });
        },

        onShow: function () {
            //this.$el.modal('show');
            this.$el.children().children().modal('show'); //such a hack
        },

        onClose: function () {
            this.$el.modal('hide');
        }
    });


    //Add an initializer to the app to expose a property
    //we can check in the rest of the code to decide if
    //we are in the Mobile app or not.
    ffa.App.addInitializer(function (options) {
        options = options || {};
        //var regions = options.regions || {};

        var regions =  {
                MainRegion: '#main-content'
                //modal: ffa.App.ModalRegion
        };

        ffa.isMobile = this.checkMobile();
        ffa.siteRoot = options.siteRoot;

        ffa.App.addRegions(regions);
    });

    //navigate to route
    ffa.App.navigate = function (route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    //get current route
    ffa.App.checkMobile = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
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