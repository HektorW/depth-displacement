require.config({
  paths: {
    'three': '../node_modules/three/three',
    'jquery': '../node_modules/jquery/dist/jquery',
    'text': '../node_modules/text/text',
    'underscore': '../node_modules/underscore/underscore',

    'dat.gui': 'libs/dat.gui',
    'stats': 'libs/stats',
    'events': 'libs/events',

    'shaders': '../shaders'
  },
  shim: {
    'three': {
      exports: 'THREE'
    },
    'dat.gui': {
      exports: 'dat'
    },
    'stats': {
      exports: 'Stats'
    }
  }
});


require(['app'], function(App) {
  window.App = App;
  App.run();
});




//////////////
// Prefixes //
//////////////
(function() {
  var w = window;
  
  // performance.now
  var p = w.performance = w.performance || {};
  p.now =
    p.now ||
    p.webkitNow ||
    p.mozNow ||
    p.msNow ||
    function() {
      return (new Date()).getTime();
    };

  // requestAnimationFrame
  var rAF = 'equestAnimationFrame';
  w['r'+rAF] =
    w['r'+rAF] ||
    w['webkitR'+rAF] ||
    w['mozR'+rAF] ||
    w['msR'+rAF] ||
    function(cb) {
      return setTimeout(function(){
        cb(p.now());
      }, 17);
    };

  // cancelAnimationFrame
  var cAF = 'ancelAnimationFrame';
  w['c'+cAF] =
    w['c'+cAF] ||
    w['webkitC'+cAF] ||
    w['mozC'+cAF] ||
    w['msC'+cAF] ||
    function(id) {
      return clearTimeout(id);
    };

}());


if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {

    // Steps 1-2.
    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
      O[k] = value;
      k++;
    }

    // Step 13.
    return O;
  };
}