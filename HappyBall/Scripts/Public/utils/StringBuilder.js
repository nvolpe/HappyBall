/*
NOTE: Requires String.js
j.germain
*/

// TODO: Roll into a proper class so IDE will have knowledge of it

var StringBuilder = function (/*optional*/value) {
    // initialize
    var length = 0;
    var _strings = [],
        stringBuilder = {};

    if (value) {
        _strings.push(value);
    }

    this.append = function (value) {
        _strings.push(value);
        return stringBuilder;
    };

    this.appendLine = function (value) {
        _strings.push('\n' + value);
        return stringBuilder;
    };

    this.appendFormat = function (format, args) {
        /// <summary>Replaces the format items in a specified String with the text equivalents of the values of corresponding object instances. The invariant culture will be used to format dates and numbers.</summary>
        /// <param name='format' type='String'>A format string.</param>
        /// <param name='args' parameterArray='true' mayBeNull='true'>The objects to format.</param>
        /// <returns type='String'>A copy of format in which the format items have been replaced by the string equivalent of the corresponding instances of object arguments.</returns>
        for (var i = 0, args = Array.prototype.slice.call(arguments, 1); i < args.length; i++)
            format = format.replace('{' + i + '}', args[i]);
        _strings.push(format);
    };

    this.toString = function (value) {
        value = _.isString(value) ? value : '';
        return _strings.join(value);
    };

    // overriding length getter so we can return the length of strings
    Object.defineProperty(this, 'length', {
        get: function () {
            return _strings.join('').length;
        }
    });

    return this;
};