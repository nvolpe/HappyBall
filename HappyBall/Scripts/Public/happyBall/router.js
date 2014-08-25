/*global ffa.App*/


ffa.App.module('Mod', function (Mod, App, Backbone, Marionette, $, _) {
    Mod.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'home': 'home',
            'prop': 'prop'
        }
    });

    var API = {
        home: function () {
            ffa.App.vent.trigger('show:home');
            //ffa.App.Mod.Map.Controller.showMap();
        },
        prop: function () {
            ffa.App.vent.trigger('show:prop');
            //ffa.App.Mod.Create.Controller.createGameDetails();
        }
    };

    ffa.App.on("route:home", function () {
        ffa.App.navigate("home");
        API.home();
    });

    ffa.App.on("route:prop", function () {
        ffa.App.navigate("prop");
        API.prop();
    });

    ffa.App.addInitializer(function () {
        new Mod.Router({
            controller: API
        });
    });
});