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

            this.teamName = options.teamName;
            this.userLocationModel = options.userLocationModel;
            this.userLocationCollection = options.userLocationCollection;


            this.fetchQuestion();

            var self = this;

            $('#mapModalSuccess').on('hidden.bs.modal', function (e) {

                $('#geoClock').hide();
                self.ui.quizAlert.hide();
                self.showErryBody();
            })


            //on submit, save the fucking wekk
            $("#geoMaster-start-btn").click(function () {
                self.startTheQuiz();
            });

            //Event Listeners for share location modal
            //-----------------------------------------
            $("#share-location-btn").click(function () {
                self.getUsersLocation();
            });

            $("#deny-location-btn").click(function () {
                self.denyUserLocation();
            });

            this.fetchPeoplesLocation();

            this.isPlaying = false;

            var eventType = ffa.isMobile ? 'touchend' : 'click';
            this.events[eventType + ' #quiz-results'] = 'resultsClickHandler';
            this.events[eventType + ' #quiz-start'] = 'quizStartClickHandler';
            this.events[eventType + ' #quiz-submit'] = 'quizSubmitClickHandler';
            this.events[eventType + ' #close-quiz'] = 'closeQuizClickHandler';
            this.events[eventType + ' #geo-location'] = 'showLocationModal';
            this.events[eventType + ' #geo-show-people'] = 'showPeopleClickHandler';

        },

        template: '#map-template',

        ui: {
            quizButton: '#quiz-start',
            //quizSubmitBtn: '#quiz-submit',
            quizAlert: '#geo-quiz-alert',
            quizResults: '#quiz-results',
            closeQuizBtn: '#close-quiz',
            centerPoint: '#centerpoint',
            geoLocationBtn: '#geo-location',
            geoShowPeopleBtn: '#geo-show-people'

        },

        //Built into marionette, Map DIV is not ready yet until this fires
        //TODO: Roll this into other views
        onShow: function () {

            $('.hideMe').hide();

            L.mapbox.accessToken = 'pk.eyJ1IjoibmF2b2xwZSIsImEiOiJwWXhPSjZZIn0.fiO-LWxqNxZo38G2sg02mA';  //navolpe.jda58olb
            this.map = L.mapbox.map('map', 'navolpe.jda58olb', { zoomControl: false })
                .setView([24.767, -102.656], 3);

            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);


            this.ui.quizAlert.hide();
        },

        onDestroy: function () {
            $('.hideMe').show();

            console.log('closing map view');
        },

        events: {
            //'click #quiz-results': 'resultsClickHandler',
            //'click #quiz-start': 'quizStartClickHandler',
            //'click #quiz-submit': 'quizSubmitClickHandler',
            //'click #close-quiz': 'closeQuizClickHandler'
        },

        testButtonClick: function (evt) {

            this.center = this.map.getCenter();

            this.showCenterPoint();


            this.usersAnswerMarker = L.marker([this.center.lat, this.center.lng], { icon: this.maleMarker }).addTo(this.map);
        },

        showLocationModal: function (evt) {
            var self = this;

            this.userLocationModel.restAction = 'GET';

            this.userLocationModel.fetch({
                success: function (results) {

                    $('#getUserLocation').modal('show');

                },
                error: function () {
                    console.log('noo geo user results');
                }
            });
        },


        denyUserLocation: function () {

            this.userLocationModel.set('show', false)

            if (this.usersLocationMarker) {
                this.map.removeLayer(this.usersLocationMarker)
            }

            this.userLocationModel.restAction = 'PUT';

            this.saveLocationModel();
        },

        getUsersLocation: function (evt) {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationError);
            } else {
                alert('Your browser doesn\'t support geolocation.');
            }

        },

        onLocationSuccess: function (position) {
            var lat = String(position.coords.latitude);
            var lon = String(position.coords.longitude);

            this.userLocationModel.set('lat', lat)
            this.userLocationModel.set('lon', lon)
            this.userLocationModel.set('show', true)

            this.placeIcon(lat, lon);
        },

        onLocationError: function (message) {
            console.debug("ERROR");
            console.dir(message);
        },

        placeIcon: function (lat, lon) {

            this.smileMarker = L.AwesomeMarkers.icon({
                icon: 'user',
                markerColor: 'purple',
                prefix: 'fa'
            })

            //this.usersLocationMarker = L.marker([lat, lon], { icon: this.smileMarker }).addTo(this.map);

            if (this.userLocationModel.id) {
                this.userLocationModel.restAction = 'PUT';
            } else {
                this.userLocationModel.restAction = 'POST';
            }

            this.saveLocationModel();
        },


        saveLocationModel: function () {
            this.userLocationModel.save({}, {
                success: this.saveLocCallback,
                error: this.saveLocErrback
            });
        },

        saveLocCallback: function (obj, xhr) {
            //make sure the next time the user submits, if they do, that it is a put instead
            //this.userLocationModel.restAction = 'PUT';

            console.log('Save loc Success');
        },

        saveLocErrback: function (obj, xhr) {
            console.log('Save Loc Error');
        },



        showPeopleClickHandler: function () {

            //if toggled on 

            if ($('#geo-show-icon').hasClass('loc-icon-on')) {

                this.hidePeoplesLocations()

            } else {

                this.fetchPeoplesLocation()
            }

            

            //if toggled off
            //this.hidePeoplesLocations();
        },


        fetchPeoplesLocation: function () {
            //fetch collection
            //then show markers that have their shit set to true

            var self = this;

            this.userLocationCollection.fetch({
                success: function (results) {

                    console.log('fetched user collection');
                    self.showPeople();
                    
                },
                error: function () {
                    console.log('noo geo user results');
                }
            });
        },

        showPeople: function () {

            var self = this;

            this.markerArray = [];
            var marker;

            this.smileMarker = L.AwesomeMarkers.icon({
                icon: 'user',
                markerColor: 'purple',
                prefix: 'fa'
            });

            var list = this.userLocationCollection.toJSON()

            _.each(list, function (item) {
                if (item.show === true) {
                    marker = L.marker([item.lat, item.lon], { icon: this.smileMarker }).addTo(this.map).bindPopup(item.teamName);

                    self.markerArray.push(marker);

                } else {
                    console.log(item.teamName + ' is lame');
                }

            }, this);

            $('#geo-show-icon').addClass('loc-icon-on');

        },


        hidePeoplesLocations: function () {

            if (this.markerArray.length > 0) {
                _.each(this.markerArray, function (item) {

                    this.map.removeLayer(item);

                }, this);
            }

            $('#geo-show-icon').removeClass('loc-icon-on');
        },


        resultsClickHandler: function (evt) {

            //dispatch event to show modal composite view
            ffa.App.vent.trigger("show:geoResults");
        },

        //May want to leave map click activated, so the user can
        //adjust their answer if they fat fuck finger a map click
        quizStartClickHandler: function (evt) {

            this.hidePeoplesLocations();

            if (this.isPlaying === false) {
                $('#geoMasterModal').modal('show');
            } else {
                this.stopTimerAndSubmit();
            }
        },

        startTheQuiz: function (evt) {
            var self = this;

            this.isPlaying = true;

            this.ui.quizButton.find('.glyphicon-tower').removeClass('glyphicon-tower').addClass('glyphicon-time');

            var geoMasterNerd = this.geoMaster.teamName;
            var geoMasterQuestion = this.geoMaster.question;
            this.allottedTime = this.geoMaster.allottedTime;

            var questionText = String.format('<strong style="color: blue">{0}: </strong> {1}.', geoMasterNerd, geoMasterQuestion);

            //this.ui.quizAlert.text(questionText);
            this.ui.quizAlert.append(questionText);
            this.ui.quizAlert.show();


            this.ui.quizButton.removeClass('disabled');
            this.ui.quizButton.addClass('btn-success');
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
                        self.ui.quizButton.removeClass('btn-success');
                        self.ui.quizButton.addClass('btn-warning');
                    }


                    if (currentTime.time < 5) {
                        self.ui.quizButton.removeClass('btn-warning');
                        self.ui.quizButton.addClass('btn-danger');
                    }


                    if (currentTime.time === 0) {
                        self.stopTimerAndSubmit();
                    }
                }, 1000);
            }, 1000);
        },


        //Stop Timer, lock map click, pop modal window for submission?
        stopTimerAndSubmit: function (evt) {

            this.isPlaying = false;

            clearInterval(this.clockInterval);
            this.clock.stop();

            this.ui.quizButton.removeClass('btn-warning');
            this.ui.quizButton.removeClass('btn-danger');
            this.ui.quizButton.removeClass('btn-success');

            this.ui.quizButton.addClass('btn-default');
            this.ui.quizButton.addClass('disabled');

            this.ui.quizResults.removeClass('disabled');

            this.ui.quizButton.find('.glyphicon-time').removeClass('glyphicon-time').addClass('glyphicon-tower');

            this.currentTime = this.clock.getTime()
            this.center = this.map.getCenter();

            this.showCenterPoint();


            //show guess
            var yourGuessMarker = L.AwesomeMarkers.icon({
                icon: 'question',
                markerColor: 'blue',
                prefix: 'fa'
            })

            this.usersAnswerMarker = L.marker([this.center.lat, this.center.lng], { icon: yourGuessMarker }).addTo(this.map).bindPopup('Your Guess');;


            this.timeUsed = this.allottedTime - this.currentTime.time;

            this.model.set('longitude', this.center.lng);
            this.model.set('latitude', this.center.lat);
            this.model.set('time', this.timeUsed);

            this.submitAnswer();
        },


        //quizSubmitClickHandler: function () {

        //    this.stopTimerAndSubmit();
        //},


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

            $.getJSON(ffa.siteRoot + "/api/geomaster/week", function (json) {

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
                this.ui.quizResults.removeClass('disabled');


                //show guess
                var yourGuessMarker = L.AwesomeMarkers.icon({
                    icon: 'question',
                    markerColor: 'blue',
                    prefix: 'fa'
                })

                this.usersAnswerMarker = L.marker([lat, lon], { icon: yourGuessMarker }).addTo(this.map).bindPopup('Your Guess');;


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

            this.collection.fetch({
                success: function (results) {
                    console.log('refetched geocollection because the user saved their shit');
                },
                error: function () {
                    console.log('noo geoCollection results');
                }
            });


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


            var lat = this.geoMaster.latitude;
            var lon = this.geoMaster.longitude;

            //show answer
            var answerMaker = L.AwesomeMarkers.icon({
                icon: 'tower',
                markerColor: 'green',
                prefix: 'glyphicon'
            })

            var answerMarker = L.marker([lat, lon], { icon: answerMaker }).addTo(this.map);


            //show guess
            var guessMarker = L.AwesomeMarkers.icon({
                icon: 'question',
                markerColor: 'red',
                prefix: 'fa'
            })


            var list = this.collection.toJSON()
            _.each(list, function (item) {

                if (item.latitude && item.teamName != self.teamName) {

                    L.marker([item.latitude, item.longitude], { icon: guessMarker }).addTo(self.map)
                        .bindPopup(item.teamName + "'s guess");
                }

            }, this);



        }


    });







}(jQuery, Backbone, _));