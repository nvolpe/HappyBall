﻿/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';


    //===============
    //VIEWS
    //===============

    ffa.App.MapItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));


            console.log('INIT MAP');

            this.teamName = options.teamName;

            this.fetchQuestion();

            var self = this;



            $('#mapModalSuccess').on('hidden.bs.modal', function (e) {

                $('#geoClock').hide();
                self.ui.quizAlert.hide();
                self.showErryBody();
            })

        },

        template: '#map-template',

        ui: {
            quizButton: '#quiz-start',
            quizSubmitBtn: '#quiz-submit',
            quizAlert: '#geo-quiz-alert',
            closeQuizBtn: '#close-quiz',
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

            // Creates a red marker with the coffee icon
            //TODO FIGURE OUT AWESOME MARKERS OR GET RID OF IT FROM THE REPO
            //this.maleMarker = L.AwesomeMarkers.icon({
            //    icon: 'male',
            //    color: 'darkblue'
            //})

            //this.femaleMarker = L.AwesomeMarkers.icon({
            //    icon: 'female',
            //    color: 'darkred'
            //})

            this.ui.quizAlert.hide();
        },

        events: {
            'click #quiz-results': 'resultsClickHandler',
            'click #quiz-start': 'quizStartClickHandler',
            'click #quiz-submit': 'quizSubmitClickHandler',
            'click #close-quiz': 'closeQuizClickHandler'
        },

        resultsClickHandler: function (evt) {

            //dispatch event to show modal composite view
            ffa.App.vent.trigger("show:geoResults");
        },


        //May want to leave map click activated, so the user can
        //adjust their answer if they fat fuck finger a map click
        quizStartClickHandler: function (evt) {
            var self = this;

            this.ui.quizButton.addClass('disabled');

            var geoMasterNerd = this.geoMaster.teamName;
            var geoMasterQuestion = this.geoMaster.question;
            this.allottedTime = this.geoMaster.allottedTime;

            var questionText = String.format('<strong style="color: blue">{0}: </strong> {1}.', geoMasterNerd, geoMasterQuestion);

            //this.ui.quizAlert.text(questionText);
            this.ui.quizAlert.append(questionText);
            this.ui.quizAlert.show();


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


            this.clock.setTime(this.allottedTime);

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
                        self.stopTimerAndSubmit();
                    }
                }, 1000);
            }, 1000);
        },

        //Stop Timer, lock map click, pop modal window for submission?
        stopTimerAndSubmit: function (evt) {

            clearInterval(this.clockInterval);
            this.clock.stop();

            this.ui.quizSubmitBtn.removeClass('btn-warning');
            this.ui.quizSubmitBtn.removeClass('btn-danger');
            this.ui.quizSubmitBtn.removeClass('btn-success');

            this.ui.quizSubmitBtn.addClass('btn-default');
            this.ui.quizSubmitBtn.addClass('disabled');

            this.currentTime = this.clock.getTime()
            this.center = this.map.getCenter();

            this.showCenterPoint();
            this.usersAnswerMarker = L.marker([this.center.lat, this.center.lng]).addTo(this.map);


            this.timeUsed = this.allottedTime - this.currentTime.time;

            this.model.set('longitude', this.center.lng);
            this.model.set('latitude', this.center.lat);
            this.model.set('time', this.timeUsed);

            this.submitAnswer();
        },


        quizSubmitClickHandler: function () {

            this.stopTimerAndSubmit();
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
                //self.ui.quizButton.removeClass('disabled'); //remove for development

                console.log('succcessfuly fetched da geomaster');
                console.dir(json);

                self.fetchResults();
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
            var lon = this.model.get('longitude');

            if (lat && lon) {
                //might need to rename this
                this.ui.quizButton.addClass('disabled');

                this.usersAnswerMarker = L.marker([lat, lon]).addTo(this.map).bindPopup('You');

                this.showErryBody();

            } else {

                console.log('User has not answered da GeoMaster Yet!')
                this.ui.quizButton.removeClass('disabled');

            }

        },

        submitAnswer: function () {

            this.model.restAction = 'POST';

            this.model.save({}, {
                success: this.saveCallback,
                error: this.saveErrback
            });

        },

        saveCallback: function (results, xhr) {

            var distanceAway = results.get('distanceAway');
            var amountOfTime = results.get('time');
            var latitude = results.get('latitude');
            var longitude = results.get('longitude');

            var message = String.format('You submitted {0},{1} to da GeoMaster. It took you <strong>{2} seconds</strong> and you were <strong>{3} miles</strong> off target.. Now that you have submitted, da GeoMaster will place everyones results on the map', latitude, longitude, amountOfTime, distanceAway);

            if (amountOfTime === this.allottedTime) {
                message = String.format('You Sucked and were too slow... But da GeoMaster has decided to submit your lazy shit anyways. The last spot your cursor was seen at was {0},{1} which is <strong>{2} miles</strong> off target.. Now that you have submitted, da GeoMaster will place everyones results on the map', latitude, longitude, distanceAway);
            }


            $('#mapModalSuccess')
                .find('.modal-body')
                    .html(message)
                .end()
                    .modal('show');

            console.log('Save geo Success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save geo Error');

            var message = 'try and refresh your browswer or some shit, contact nick if you cant submit results to da GeoMaster';

            $('#mapModalFail')
                .find('.modal-body')
                    .html(message)
                .end()
                    .modal('show');
        },


        showErryBody: function () {

            var self = this;

            console.log('showErryBody');
            console.dir(this.collection);

            var list = this.collection.toJSON()
            _.each(list, function (item) {

                if (item.latitude && item.teamName != self.teamName) {

                    L.marker([item.latitude, item.longitude]).addTo(self.map)
                        .bindPopup(item.teamName);
                }

            }, this);



        }


    });







}(jQuery, Backbone, _));