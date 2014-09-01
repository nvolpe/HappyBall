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

            this.fetchQuestion();
            this.fetchResults();
            

        },

        template: '#map-template',

        ui: {
            quizButton: '#quiz-start',
            quizSubmitBtn: '#quiz-submit',
            centerPoint: '#centerpoint'
           
        },

        //Built into marionette, Map DIV is not ready yet until this fires
        //TODO: Roll this into other views
        onShow: function () {
            L.mapbox.accessToken = 'pk.eyJ1IjoibmF2b2xwZSIsImEiOiJwWXhPSjZZIn0.fiO-LWxqNxZo38G2sg02mA';
            this.map = L.mapbox.map('map', 'navolpe.jcfnjdb9', { zoomControl: false })
                .setView([40, -74.50], 9);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);


            //$('#geo-quiz-alert').show();

        },

        events: {
            'click #quiz-results': 'resultsClickHandler',
            'click #quiz-start': 'quizStartClickHandler',
            'click #quiz-submit': 'quizSubmitClickHandler',
        },

        resultsClickHandler: function (evt) {

            //dispatch event to show modal composite view
            ffa.App.vent.trigger("show:geoResults");
        },


        //May want to leave map click activated, so the user can
        //adjust their answer if they fat fuck finger a map click
        quizStartClickHandler: function (evt) {
            var self = this;

            this.ui.quizSubmitBtn.removeClass('disabled');
            this.ui.quizSubmitBtn.addClass('btn-success');
            //=========================================
            //SHOUT OUT TO SHAERABOUTS FOR THIS CODE
            //=========================================

            this.showNewPin();
            this.map.on('movestart', this.onMapMoveStart);
            this.map.on('moveend', this.onMapMoveEnd);

            //=========================================
            //SHOUT OUT TO SHAERABOUTS FOR THIS CODE
            //=========================================

            this.clock = $('#geoClock').FlipClock({
                //countdown: true,
                autoStart: false,
                clockFace: 'Counter'
            });

            this.clock.setTime(15);

            setTimeout(function () {
                self.clockInterval = setInterval(function () {
                    self.clock.decrement();

                    var currentTime = self.clock.getTime();

                    console.log(currentTime);

                    if (currentTime.time < 10 & currentTime.time > 5) {
                        self.ui.quizSubmitBtn.removeClass('btn-success');
                        self.ui.quizSubmitBtn.addClass('btn-warning');
                    }


                    if (currentTime.time < 5) {
                        self.ui.quizSubmitBtn.removeClass('btn-warning');
                        self.ui.quizSubmitBtn.addClass('btn-danger');
                    }
                    

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

            this.ui.quizSubmitBtn.removeClass('btn-danger');
            this.ui.quizSubmitBtn.addClass('disabled');

            if (this.usersAnswerMarker) {
                //this.submitAnswer(); //remove for development
            }

        },

        onMapClick: function (evt) {

            if (this.usersAnswerMarker) {
                this.map.removeLayer(this.usersAnswerMarker);
            }

            this.model.set('latitude', evt.latlng.lat);
            this.model.set('longitude', evt.latlng.lng);

            this.usersAnswerLatLng = evt.latlng;
            this.usersAnswerMarker = L.marker([evt.latlng.lat, evt.latlng.lng]).addTo(this.map);

            this.deactivateMapClick();
        },


        showNewPin: function () {
            this.ui.centerPoint.show().addClass('newpin');
        },
        showCenterPoint: function () {
            this.ui.centerPoint.show().removeClass('newpin');
        },
        hideCenterPoint: function () {
            this.ui.centerPoint.hide();
        },
        onMapMoveStart: function (evt) {
            this.ui.centerPoint.addClass('dragging');
        },
        onMapMoveEnd: function (evt) {
            this.ui.centerPoint.removeClass('dragging');
        },


        fetchQuestion: function (vt) {
            var self = this;

            $.getJSON("/happyball/api/geomaster/week", function (json) {

                self.geoMaster = json;
                self.ui.quizButton.removeClass('disabled'); //remove for development
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.warn('Failed to get da GeoMaster')
            });
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

        initView: function () {

            var lat = this.model.get('latitude');
            var lon = this.model.get('latitude');

            if (lat && lon) {
                //might need to rename this
                this.usersAnswerMarker = L.marker([lat, lon]).addTo(this.map);

                this.addAllOtherMarkers();

                his.ui.quizButton.addClass('disabled');

            } else {

                console.log('User has not answered da GeoMaster Yet!')

                
            }

        },

        addAllOtherMarkers: function () {

            console.log('TODO: Fetch Collection of Errrybodys Results');
        },

        submitAnswer: function () {

            this.model.restAction = 'POST';

            this.model.save({}, {
                success: this.saveCallback,
                error: this.saveErrback
            });

        },

        saveCallback: function (obj, xhr) {
            //this.submitPropBtn.stop();

            ////make sure the next time the user submits, if they do, that it is a put instead
            //this.model.restAction = 'PUT';

            ////display success message to the user
            //$('#modalSuccess').modal();

            console.log('Save geo Success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save geo Error');
        },





    });







}(jQuery, Backbone, _));