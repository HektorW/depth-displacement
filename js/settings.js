define([
  'underscore',
  'events',

  'dat.gui'
], function(
  _,
  Events,

  dat
) {


  var Settings = {
    values: {
      height: 0.0,
      cameraMove: 0.5,
      filter: 'none'
    },

    init: function() {
      window.Settings = Settings;

      _.bindAll(Settings, 'valuesChanged');

      var gui = Settings.gui = new dat.GUI();

      gui.add(Settings.values, 'height').min(-2.0).max(2.0).step(0.1).onChange(Settings.valuesChanged);
      gui.add(Settings.values, 'cameraMove').min(0.0).max(1.0).step(0.1).onChange(Settings.valuesChanged);
      gui.add(Settings.values, 'filter', [
        'none',
        'grayscale',
        'luminosity',
        'edge',
        'emboss'
      ]).onChange(Settings.valuesChanged);

      Settings.valuesChanged();
    },

    valuesChanged: function(value) {
      Settings.trigger('values.updated');
    }
  };


  _.extend(Settings, Events);

  return Settings;
});