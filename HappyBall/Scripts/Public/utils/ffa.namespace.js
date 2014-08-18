/*
 * Dependencies
 * - underscore.js
 */

var ffa = {
    /* common configuration */
    config: {},
    /* common utility functions */
    utils: {},
    /* common ui functions */
    ui: {}
};

// Usage: String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

isNumeric = function (value) {
    //    return !isNaN(parseFloat(value)) && isFinite(value);
    return _.isNumber(value) || (_.isString(value) && value.match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/));
}

numberZeroReplace = function (x) {
    if (typeof x === "undefined")
        return "";
    switch (x) {
        case 0:
        case "0":
        case 0.0:
        case "0.0":
            return "";
        default:
            return x;
    }
}

numberWithCommasBase = function (x, isEmpty) {
    if (typeof x === "undefined" || x == 0 || x == 0.0)
        return isEmpty ? "" : 0;
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

numberWithCommas = function (x) {
    return numberWithCommasBase(x, false);
}

numberWithCommas_Empty = function (x) {
    return numberWithCommasBase(x, true);
}

numberToDollerTextWithSign = function (x) {
    if (x === '0') {
        return '$0';
    }

    return (x > 0.0) ? "$" + numberWithCommas_Empty(parseFloat(x).toFixed(2)) : "$0";
}

numberToDollerText = function (x) {
    return (x > 0.0) ? numberWithCommas_Empty(parseFloat(x).toFixed(2)) : "";
}

dollerTextToNumber = function (x) {
    var returnVal = x;
    returnVal = returnVal.replace(/\$/g, '')
    returnVal = returnVal.replace(/\,/g, '');
    return returnVal
}

/***** Percent Handling *********/

standardizePercent = function (x) {
    var returnVal = parseFloat(x);
    if (!isNumeric(returnVal))
        return x;
    switch (true) {
        case (returnVal == 0):
            return 0;
        case (returnVal > 0 && returnVal < 1):
            return returnVal;
        case (returnVal >= 1):
            return returnVal / 100;
        default:
            return returnVal;
    }
}

numberToPercent = function (x, withSign, isEmpty) {
    if (isEmpty && x == 0)
        return "";

    var midVal = x > 1 ? x.toFixed(2) : x.toFixed(4);

    var returnVal = midVal % 1 == 0 ? parseFloat(midVal).toFixed(0) : midVal;

    returnVal = numberWithCommas(returnVal);

    return withSign ? returnVal + "%" : returnVal;
}

floatToPercent = function (x, withSign, isEmpty) {
    if (isEmpty && x == 0)
        return "";
    else
        x = x * 100;

    var midVal = x.toFixed(2); //x > 1 ? x.toFixed(2) : x.toFixed(4);

    var returnVal = midVal % 1 == 0 ? parseFloat(midVal).toFixed(0) : midVal;

    returnVal = numberWithCommas(returnVal);

    return withSign ? returnVal + "%" : returnVal;
}

//_.mixin({
//    delayUntil: function (func, condition) {
//        var args = Array.prototype.slice.call(arguments, 2);
//        function check() {
//            if (condition) {
//                console.log("End delayUntil");
//                func.apply(null, args);
//            } else {
//                setTimeout(check, 0);
//            }
//        };
//        return setTimeout(check, 0);
//    }
//});

/***** String Extensions *********/

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
};

String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
};

// removes any instances of 2 or more spaces and replaces them with one single space
String.prototype.removeMultiSpaces = function () {
    return this.trim().replace(/\s{2,}/g, ' ');
};

// To Camel Case from Dashed : "test-case-string" => "testCaseString"
String.prototype.dashedToCamel = function () {
    return this.trim().replace(/(\-[a-z])/g, function ($1) { return $1.toUpperCase().replace('-', ''); });
};

// To Dashed from Camel Case : "testCaseString" => "test-case-string"
String.prototype.camelToDash = function () {
    return this.trim().replace(/([A-Z])/g, function ($1) { return "-" + $1.toLowerCase(); });
};

// To Camel Case from Underscore : "test_case_string" => "testCaseString"
String.prototype.underscoreToCamel = function () {
    return this.trim().replace(/(\-[a-z])/g, function ($1) { return $1.toUpperCase().replace('_', ''); });
};

// To Underscore from Camel Case : "testCaseString" => "test_case_string"
String.prototype.camelToUnderscore = function () {
    return this.trim().replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
};

// To Camel Case from Spaced : "test case string" => "testCaseString"
String.prototype.spacedToCamel = function () {
    return this.removeMultiSpaces().replace(/\s{1}([a-z]{1})/g, function ($1) { return $1.toUpperCase().replace(/\s*/g, '') });
};

// To Spaced from Camel Case : "testCaseString" => "test case string"
String.prototype.camelToSpaced = function () {
    return this.trim().replace(/([A-Z])/g, function ($1) { return " " + $1.toLowerCase(); });
};

Array.prototype.formatMessages = function () {
    if (this.length > 0)
        return String.format("<ul><li>{0}</li></ul>", this.join("</li><li>"))
    return "";
};

(function ($) {
    $.fn.toggleDisabled = function () {
        //return this.prop("disabled", !this.prop("disabled"));
        return this.attr('disabled', !this.attr('disabled'));
    };
})(jQuery);

$.fn.serializeObject = function () {
    "use strict";
    var a = {}, b = function (b, c) {
        var d = a[c.name];
        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
    };
    return $.each(this.serializeArray(), b), a
};