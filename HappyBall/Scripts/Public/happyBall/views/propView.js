/*global ffa, Backbone, Marionette, _*/

(function ($, Backbone, _) {
    'use strict';
    //===============
    //MODELS
    //===============
    ffa.App.PropModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});

            console.dir(options);
            console.log('Init Prop Model');
        },
        idAttribute: "id",
        restAction: 'GET',

        url: function () {

            var resultUrl = null;

            if (this.restAction === 'POST') {
                resultUrl = '/happyball/api/result'
            }

            if (this.restAction === 'PUT') {
                resultUrl = '/happyball/api/result/' + this.id;
            }

            if (this.restAction === 'GET') {
                resultUrl = '/happyball/api/result/week'
            }

            return resultUrl;
        }
    });


    //===============
    //COLLECTIONS
    //===============

    ffa.App.PropCollection = Backbone.Collection.extend({
        //model: ffa.App.PropModel,

        //initialize: function (options) {
        //    options || (options = {});//jshint ignore:line

        //    console.log('Init Prop Collection');
        //},

        url: function () {
            return '/happyball/api/prop';
        },
    });


    //===============
    //VIEWS
    //===============

    //Item View
    ffa.App.PropItemView = Marionette.ItemView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        },
        //model: ffa.PropModel,
        template: '#prop-template'
    });

    //Collection View
    ffa.App.PropCompositeView = Marionette.CompositeView.extend({
        initialize: function (options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));

            console.log('Init Prop Composite View');

            this.fetchResultsModel();

            //this.model = new ffa.App.PropModel();
        },
        childView: ffa.App.PropItemView,
        childViewContainer: "#prop-bet-container",
        template: "#prop-container-template",

        events: {
            'click .yesBtn': 'yesBtnClick',
            'click .noBtn': 'noBtnClick',
            'click #submitProp': 'submiPropClickHandler'
        },

        yesBtnClick: function (evt) {

            var btnId = evt.currentTarget.id;

            //var selectorVal = evt.currentTarget.attributes[3].value; //i remember this threw a firefox error
            var selectorVal = $('#' + btnId).data().stuff; //stuff is the number needed, could be renamed

            //add and remove red/green classes
            $('#' + btnId).removeClass('btn-default');
            $('#' + btnId).addClass('btn-success');

            $('#noBtn' + selectorVal).removeClass('btn-danger');
            $('#noBtn' + selectorVal).addClass('btn-default');
        },

        noBtnClick: function (evt) {

            //get the current button clicked
            var btnId = evt.currentTarget.id;

            //var selectorVal = evt.currentTarget.attributes[3].value; //i remember this threw a firefox error
            var selectorVal = $('#' + btnId).data().stuff; //stuff is the number needed, could be renamed

            //add and remove red/green classes
            $('#' + btnId).removeClass('btn-default');
            $('#' + btnId).addClass('btn-danger');

            $('#yesBtn' + selectorVal).removeClass('btn-success');
            $('#yesBtn' + selectorVal).addClass('btn-default');
        },


        submiPropClickHandler: function (evt) {
            console.log('Save Prop bets!');

            //set url to post url
            this.model.isPost = true;

            //TODO: Set dynamic Team and User Info
            if ($('#yesBtn1').hasClass('btn-success')) {
                this.model.set('propBet1', 'yes')
            } else {
                this.model.set('propBet1', 'no')
            }

            if ($('#yesBtn2').hasClass('btn-success')) {
                this.model.set('propBet2', 'yes')
            } else {
                this.model.set('propBet2', 'no')
            }

            if ($('#yesBtn3').hasClass('btn-success')) {
                this.model.set('propBet3', 'yes')
            } else {
                this.model.set('propBet3', 'no')
            }

            //TODO: Set dynamic Team and User Info
            //Maybe do this on initialization
            //this.model.set({
            //    TeamName: 'Touchdown Jesus', 
            //    UserId: '0c0161b3-1fd8-4433-a374-263cca41d19b'
            //});

            this.model.save({}, {
                success: this.saveCallback,
                error: this.saveErrback
            });
        },

        saveCallback: function (obj, xhr) {

            this.model.restAction = 'PUT';
            console.log('Save Success');
        },

        saveErrback: function (obj, xhr) {
            console.log('Save Error');
        },


        fetchResultsModel: function () {
            var self = this;

            //set url to get url
            this.model.restAction = 'GET';

            this.model.fetch({
                success: function (results) {
                    console.log('yes got results model ya dig');
                    console.dir(results);

                    //get the unique Id in the prop table and set it as the id, so we can PUT! instead of post
                    //self.model.id = results.get('id');

                    self.initView();

                },
                error: function () {
                    console.log('noo');
                }
            });
        },

        initView: function () {

            //TODO: maybe use backbone.model.validate or something
            //Need a way to set flag between post and put
            this.model.restAction = 'POST';

            var Bet1 = this.model.get("propBet1");
            var Bet2 = this.model.get("propBet2");
            var Bet3 = this.model.get("propBet3");

            // dont remove default button icons if no data defined
            if (Bet1 == "yes" || Bet1 == "no") {

                this.model.restAction = 'PUT';

                if (Bet1 == "yes") {
                    $('#yesBtn1').removeClass('btn-default');
                    $('#yesBtn1').addClass('btn-success');
                } else {
                    $('#noBtn1').removeClass('btn-default');
                    $('#noBtn1').addClass('btn-danger');
                }

                if (Bet2 == "yes") {
                    $('#yesBtn2').removeClass('btn-default');
                    $('#yesBtn2').addClass('btn-success');
                } else {
                    $('#noBtn2').removeClass('btn-default');
                    $('#noBtn2').addClass('btn-danger');
                }

                if (Bet3 == "yes") {
                    $('#yesBtn3').removeClass('btn-default');
                    $('#yesBtn3').addClass('btn-success');
                } else {
                    $('#noBtn3').removeClass('btn-default');
                    $('#noBtn3').addClass('btn-danger');
                }

            }
        }







    });

}(jQuery, Backbone, _));