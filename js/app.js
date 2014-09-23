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

      this.init();
      this.setupKernels();
      this.setupScene();
      this.update(window.performance.now());
    },


    init: function() {
      this.$el = $('#app');

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.width, this.height);
      this.$el.append(this.renderer.domElement);
    },


    setupKernels: function() {
      this.kernels.push([
         1,  1,  1,
         1, -9,  1,
         1,  1,  1
      ]);
    },


    setupScene: function() {
      var geometry = new THREE.PlaneGeometry(2,1,1);


      /*var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('res/flower.jpg')
      });*/
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

          }
        },
        vertexShader: simple_vert,
        fragmentShader: kernel_frag
      });


      this.plane = new THREE.Mesh( geometry, material );
      this.scene.add(this.plane);

      this.camera.position.z = 2;
    },

    update: function(time) {
      requestAnimationFrame(this.update);

      this.renderer.render(this.scene, this.camera);
    }
  };

  return App;
});
