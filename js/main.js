require.config({
  paths: {
    'three': '../node_modules/three/three',
    'jquery': '../node_modules/jquery/dist/jquery'
  }
});


require(['app'], function(App) {
  App.run();
});