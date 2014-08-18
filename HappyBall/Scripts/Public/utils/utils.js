/* Namespace */
if (!this.ffa || typeof this.ffa !== 'object') {
    this.ffa = {};
}

ffa.utils = {};

ffa.utils = (function ($) {

    //var _somePrivateVariable = '',
    //    _pngTemplate = '{0}_maps.png',
    //    _geoUrliOSAppleMapsPrefix = 'maps://',
    //    _geoUrliOSGoogleMapsPrefix = 'comgooglemaps://',
    //    _geoUrlAndroidGoogleMapsPrefix = 'geo:{0},{1}',
    //    _geoUrlQueryTemplate = 'z={3}&q={0},{1}({2})';

    // Bootstrap RGB colors: primary-66,139,202 | success-92,184,92 | warning-240,173,78 | danger-217,83,79

    var foo,

     //-----------------------------------
     // Math methods
     //-----------------------------------

        _bytesToMegabytes = function (bytes) {
            if (_.isNumber && !_.isNaN(bytes)) {
                var mb = bytes / 1024 / 1024;
                return mb;
            }
            return 0;
        },

        _megabytesToBytes = function (megabytes) {
            if (_.isNumber && !_.isNaN(megabytes)) {
                var b = megabytes * 1024 * 1024;
                return b;
            }
            return 0;
        },

         _bytesToSize = function (bytes) {
             if (bytes == 0) return '0 Byte';
             var k = 1000;
             var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
             var i = Math.floor(Math.log(bytes) / Math.log(k));
             return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
         },

    //-----------------------------------
    // Color methods
    //-----------------------------------

         _getRandomHexColor = function () {
             // replaces each of six 0s with a random hex digit, so it's sure to end up with a full six-digit valid color value
             var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
             return randomColor;
         },

         _hexToRgb = function (hex) {
             // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
             var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
             hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                 return r + r + g + g + b + b;
             });

             var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
             return result ? {
                 r: parseInt(result[1], 16),
                 g: parseInt(result[2], 16),
                 b: parseInt(result[3], 16)
             } : null;
         };

    return {
        color: {
            // Returns a random color as a hex value
            randomColor: function () { return _getRandomHexColor(); },
            // Converts a hex color value to RGB color value
            hexToRgb: function (hexColor) { return _hexToRgb(hexColor); }
        },
        math: {
            // Converts megabytes to bytes
            megabytesToBytes: function (megabytes) { return _megabytesToBytes(megabytes); },
            // Converts bytes to megabytes 
            bytesToMegabytes: function (bytes) { return _bytesToMegabytes(bytes); },
            // Returns a string. For example "1.2 MB"
            bytesToSize: function (bytes) { return _bytesToSize(bytes); }
        }
    };
}($));