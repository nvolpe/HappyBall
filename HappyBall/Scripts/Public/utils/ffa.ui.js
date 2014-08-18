(function ($) {
    /* 
        In lieu of requiring jquery.ui
        bootstrapClass options:
            - a valid color prefixed with '#'.
            - 'active' maps to color '#f5f5f5'
            - 'success' maps to color '#dff0d8'
            - 'warning' maps to color '#fcf8e3'
            - 'danger' maps to color '#f2dede'
            - 'info' maps to color '#5bc0de'
        callback:
            function to be called once the highlight has been completed
    */

    //spinner for use throughout app
    var spinnerOpts = {
        lines: 10, // The number of lines to draw
        length: 15, // The length of each line
        width: 5, // The line thickness
        radius: 15, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
    };

    ffa.ui = {
        spinner: new Spinner(spinnerOpts)
    }


    $.fn.highlight = function (colorOrBootstrapClass, callback) {
        $(this).each(function () {
            var color = '#fcf8e3';
            if (colorOrBootstrapClass && typeof colorOrBootstrapClass === 'string') {
                if (colorOrBootstrapClass.indexOf('#') == 0) {
                    color = colorOrBootstrapClass;
                }
                else {
                    if (colorOrBootstrapClass === 'active') { color = '#f5f5f5'; }
                    else if (colorOrBootstrapClass === 'success') { color = '#dff0d8'; }
                    else if (colorOrBootstrapClass === 'warning') { color = '#fcf8e3'; }
                    else if (colorOrBootstrapClass === 'danger') { color = '#f2dede'; }
                    else if (colorOrBootstrapClass === 'info') { color = '#5bc0de'; }
                }
            }
            var el = $(this);
            $('<div/>')
            .width(el.outerWidth())
            .height(el.outerHeight())
            .css({
                'position': 'absolute',
                'left': el.offset().left,
                'top': el.offset().top,
                'background-color': color,
                'opacity': '.7',
                'z-index': '9999999'
            }).appendTo('body').fadeOut(1000).queue(function () {
                $(this).remove();
                if (callback && typeof callback === 'function') { callback(); }
            });
        });
    };

    // Download a file from server using jQuery ajax
    $.fn.download = function (url, data, method) {
        //url and data options required
        if (url && data) {
            //data can be string of parameters or array/object
            data = typeof data == 'string' ? data : jQuery.param(data);
            //split params into form inputs
            var inputs = '';
            $.each(data.split('&'), function () {
                var pair = this.split('=');
                inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
            });

            //send request
            $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
                .appendTo('body')
                .submit()
                .remove();
        };
    };

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    // type example: 'has-error'
    // selector example: '.validation-group'
    $.fn.markControl = function (selector, type, message) {
        var $control, $group, position, target;
        $control = $(this);
        $group = $control.parents(selector);
        $group.addClass(type);
        if (message !== "") {
            if ($control.data('error-style') === 'tooltip') {
                position = $control.data('tooltip-position') || 'top';
                $control.tooltip({
                    placement: position,
                    trigger: 'manual',
                    title: message
                });
                return $control.tooltip('show');
            } else if ($control.data('error-style') === 'inline') {
                if ($group.find('.help-inline').length === 0) {
                    $group.find('.form-control').after('<span class=\'help-inline error-message\'></span>');
                }
                target = $group.find('.help-inline');
                return target.text(message);
            } else {
                if ($group.find('.help-block').length === 0) {
                    if ($group.find('.form-control').length > 1)
                        $group.append('<div class=\'col-sm-12 help-block error-message\'></div>');
                    else
                        $group.find('.form-control').after('<p class=\'help-block error-message\'></p>');
                }
                target = $group.find('.help-block');
                return target.html(message);
            }
        }
    };

    // type example: 'has-error'
    // selector example: '.validation-group'
    $.fn.unmarkControl = function (selector, type) {
        var $control, $group;
        $control = $(this);
        $group = $control.parents(selector);
        $group.removeClass(type);
        if ($control.data('error-style') === 'tooltip') {
            if ($control.data('tooltip')) {
                return $control.tooltip('hide');
            }
        } else if ($control.data('error-style') === 'inline' || $control.attr('error-style') === 'inline') {
            return $group.find('.help-inline.error-message').remove();
        } else {
            return $group.find('.help-block.error-message').remove();            
        }
    };

    // toggles the disable state based on element type
    $.fn.extend({
        disable: function (state) {
            return this.each(function () {
                var $this = $(this);
                if ($this.is('input, button'))
                    this.disabled = state;
                else
                    $this.toggleClass('disabled', state);
            });
        }
    });

}(jQuery));