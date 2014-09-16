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
                resultUrl = ffa.siteRoot + '/api/result'
            }

            if (this.restAction === 'PUT') {
                resultUrl = ffa.siteRoot + '/api/result/' + this.id;
            }

            if (this.restAction === 'GET') {
                resultUrl = ffa.siteRoot + '/api/result/week'
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
        //},s

        url: function () {
            return ffa.siteRoot + '/api/prop/week';
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

            console.dir(ffa.isMobile);


            var eventType = ffa.isMobile ? 'touchend' : 'click';
            this.events[eventType + ' .yesBtn'] = 'yesBtnClick';
            this.events[eventType + ' .noBtn'] = 'noBtnClick';
            this.events[eventType + ' #submitProp'] = 'submiPropClickHandler';


        },
        childView: ffa.App.PropItemView,
        childViewContainer: "#prop-bet-container",
        template: "#prop-container-template",

        ui: {
            submitPropBtn: '#submitProp'
        },

        events: {
            //'click .yesBtn': 'yesBtnClick',
            //'click .noBtn': 'noBtnClick',
            //'click #submitProp': 'submiPropClickHandler'
        },

        onShow: function () {
        
            console.log('yo man');
            var _model = this.collection.get(1);

            var team = _model.get('teamName');

            var teamString = String.format('<strong>{0}</strong> is responsible for these awesome questions...', team)
            $('#responsible-prop-team').html(teamString);

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

            var isChecked = this.checkButtons();
            if (isChecked) {
                this.ui.submitPropBtn.removeClass('disabled');
            }
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

            var isChecked = this.checkButtons();
            if (isChecked) {
                this.ui.submitPropBtn.removeClass('disabled');
            } 
        },

        checkButtons: function () {

            var btnGroup1, btnGroup2, btnGroup3;

            btnGroup1 = $('#yesBtn1').hasClass('btn-success') || $('#noBtn1').hasClass('btn-danger') ? 0 : 1;
            btnGroup2 = $('#yesBtn2').hasClass('btn-success') || $('#noBtn2').hasClass('btn-danger') ? 0 : 1;
            btnGroup3 = $('#yesBtn3').hasClass('btn-success') || $('#noBtn3').hasClass('btn-danger') ? 0 : 1;

            var sum = btnGroup1 + btnGroup2 + btnGroup3;

            if (sum > 0) {
                return false;
            } else {
                return true;
            }
        },

        submiPropClickHandler: function (evt) {
            console.log('Save Prop bets!');

            this.submitPropBtn = Ladda.create($(this.ui.submitPropBtn)[0]);
            this.submitPropBtn.start();

            //set url to post url
            //this.model.restAction = 'POST';

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

            if (this.model.restAction === 'POST') {
                this.model.save({}, {
                    type: 'POST',
                    success: this.saveCallback,
                    error: this.saveErrback
                });
            } else {
                this.model.save({}, {
                    success: this.saveCallback,
                    error: this.saveErrback
                });
            }


        },

        saveCallback: function (obj, xhr) {
            this.submitPropBtn.stop();

            //make sure the next time the user submits, if they do, that it is a put instead
            this.model.restAction = 'PUT';

            //display success message to the user
            $('#modalSuccess').modal();

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

            var isChecked = this.checkButtons();
            if (isChecked) {
                this.ui.submitPropBtn.removeClass('disabled');
            }

        }



    });

}(jQuery, Backbone, _));