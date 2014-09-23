define([
  'jquery',
  'three',

  'text!shaders/simple.vert',
  'text!shaders/color.frag',
  'text!shaders/kernel.frag'
], function(
  $,
  THREE,

  simple_vert,
  color_frag,
  kernel_frag
) {

  var App = {
    scene: null,
    camera: null,
    renderer: null,

    kernels: [],

    run: function() {
      this.update = this.update.bind(this);
      this.resize = this.resize.bind(this);

      this.init();
      this.setupKernels();
      this.setupScene();
      this.lastTime = performance.now();
      this.update(performance.now());
    },


    init: function() {
      this.$el = $('#app');

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer();
      this.$el.append(this.renderer.domElement);

      this.resize();
      $(window).on('resize', this.resize);
    },

    resize: function() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
      this.renderer.setSize(this.width, this.height);
    },


    setupKernels: function() {
      this.kernels.push([
         1,  1,  1,
         1, -8,  1,
         1,  1,  1
      ]);
    },


    setupScene: function() {
      var geometry = new THREE.PlaneGeometry(2,1,1);

      var material = new THREE.ShaderMaterial({
        uniforms: {
          texture: {
            type: 't',
            value: THREE.ImageUtils.loadTexture('res/flower.jpg')
          },
          kernelSize: {
            type: 'i',
            value: 9
          },
          kernel: {
            type: '1fv',
            value: this.kernels[0]
          }
        },
        vertexShader: simple_vert,
        fragmentShader: kernel_frag
      });


      this.plane = new THREE.Mesh( geometry, material );
      this.scene.add(this.plane);

      this.camera.position.z = 1;
    },

    update: function(time) {
      requestAnimationFrame(this.update);

      if (time - this.lastTime < 50.0) {
        return;
      }
      this.lastTime = time;

      this.renderer.render(this.scene, this.camera);
    }
  };

  return App;
});
