require.config({
  paths: {
    'three': '../node_modules/three/three',
    'jquery': '../node_modules/jquery/dist/jquery'
  }
});


require(['app'], function(App) {
  App.run();
});




// Prefixes
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
  w['r'+cAF] =
    w['r'+cAF] ||
    w['webkitR'+cAF] ||
    w['mozR'+cAF] ||
    w['msR'+cAF] ||
    function(id) {
      return clearTimeout(id);
    };

}());