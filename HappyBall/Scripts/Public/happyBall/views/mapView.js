/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';


    //===============
    //VIEWS
    //===============

    ffa.App.MapItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));


            console.log('INIT MAP');

            this.fetchResults();

        },

        template: '#map-template',

        //Built into marionette, Map DIV is not ready yet until this fires
        //TODO: Roll this into other views
        onShow: function(){
            L.mapbox.accessToken = 'pk.eyJ1IjoibmF2b2xwZSIsImEiOiJwWXhPSjZZIn0.fiO-LWxqNxZo38G2sg02mA';
            this.map = L.mapbox.map('map', 'navolpe.jcfnjdb9')
                .setView([40, -74.50], 9);
        },

        events: {
            'click #quiz-results': 'resultsClickHandler',
            'click #quiz-start': 'quizStartClickHandler'
        },

        resultsClickHandler: function (evt) {

            //dispatch event to show modal composite view
            ffa.App.vent.trigger("show:geoResults");
        },


        //May want to leave map click activated, so the user can
        //adjust their answer if they fat fuck finger a map click
        quizStartClickHandler: function (evt) {
            var self = this;

            //activate click handler
            this.map.on('click', this.onMapClick);

            this.clock = $('#geoClock').FlipClock({
                //countdown: true,
                autoStart: false,
                clockFace: 'Counter'
            });

            this.clock.setTime(15);

            setTimeout(function() {
              self.clockInterval = setInterval(function() {
                    self.clock.decrement();

                    var currentTime = self.clock.getTime();

                    if (currentTime.time === 0) {
                        self.stopTimer();
                    }
                }, 1000);
            }, 1000);
        },

        //Stop Timer, lock map click, pop modal window for submission?
        stopTimer: function (evt) {

            clearInterval(this.clockInterval);
            this.clock.stop();
            console.log('ahh flip clock stop');

            this.constructor();

            if (this.usersAnswerMarker) {
                this.submitAnswer();
            }

        },

        onMapClick: function (evt) {

            //console.log(this.clock.getTime());

            if (this.usersAnswerMarker) {
                this.map.removeLayer(this.usersAnswerMarker);
            }

            this.usersAnswerLatLng = evt.latlng;
            this.usersAnswerMarker = L.marker([evt.latlng.lat, evt.latlng.lng]).addTo(this.map);

            this.deactivateMapClick();
        },


        deactivateMapClick: function () {
            this.map.off('click', this.onMapClick);
        },

        fetchResults: function (vt) {
            var self = this;

            //set url to get url
            this.model.restAction = 'GET';

            this.model.fetch({
                success: function (results) {
                    console.log('yes got the geo results model ya dig');
                    console.dir(results);

                    //get the unique Id in the prop table and set it as the id, so we can PUT! instead of post
                    //self.model.id = results.get('id');

                    self.initView();

                },
                error: function () {
                    console.log('noo geo results');
                }
            });


        },



        submitAnswer: function () {



        }




    });







}(jQuery, Backbone, _));