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
      // this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);

      this.renderer = new THREE.WebGLRenderer();
      // this.renderer.setClearColor(0xffffff, 1);
      this.$el.append(this.renderer.domElement);

      this.resize();
      $(window).on('resize', this.resize);
    },

    resize: function() {
      // this.width = 512;
      var w = this.width = window.innerWidth;
      // this.height = 512;
      var h = this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      // this.camera.left = w / -2;
      // this.camera.right = w / 2;
      // this.camera.top = h / 2;
      // this.camera.bottom = h / -2;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
    },


    setupKernels: function() {
      /*this.kernels.push([
         1,  1,  1,
         1, -8,  1,
         1,  1,  1
      ]);*/
      this.kernels.push([
        -2, -1,  0,
        -1,  1,  1,
         0,  1,  2
      ]);
    },


    setupScene: function() {
      var geometry = new THREE.PlaneGeometry(1,1,1);

      this.material = new THREE.ShaderMaterial({
        uniforms: {
          texture: {
            type: 't',
            value: THREE.ImageUtils.loadTexture('res/flower.jpg')
          },
          kernelSize: {
            type: 'i',
            value: 0
          },
          kernel: {
            type: '1fv',
            value: Array(25).fill(0)
          }
        },
        vertexShader: simple_vert,
        fragmentShader: kernel_frag
      });


      this.plane = new THREE.Mesh( geometry, this.material );
      this.scene.add( this.plane );

      this.camera.position.z = 0.65;
    },

    update: function(time) {
      requestAnimationFrame(this.update);

      if (time - this.lastTime < 50.0) {
        return;
      }
      this.lastTime = time;

      var kernel = this.kernels[0];
      for (var i = kernel.length; i--; ) {
        this.material.uniforms.kernel.value[i] = kernel[i];
      }
      this.material.uniforms.kernelSize.value = Math.sqrt(kernel.length);

      this.renderer.render(this.scene, this.camera);
    }
  };

  return App;
});
