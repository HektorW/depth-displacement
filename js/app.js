define([
  'jquery',
  'underscore',
  'three',

  'stats',

  'settings',

  'text!shaders/simple.vert',
  'text!shaders/displace.vert',
  'text!shaders/screen.vert',
  'text!shaders/color.frag',
  'text!shaders/filter.frag',
  'text!shaders/kernel.frag'
], function(
  $,
  _,
  THREE,

  Stats,

  Settings,

  screen_vert,
  displace_vert,
  simple_vert,
  color_frag,
  filter_frag,
  kernel_frag
) {

  var App = {
    active: true,

    scene: null,
    camera: null,
    renderer: null,

    kernels: [],

    fpsms: 1000 / 24,

    planeResolution: 512,

    run: function() {
      this.update = this.update.bind(this);
      this.resize = this.resize.bind(this);

      this.init();
      this.loadTextures();
      this.setupKernels();
      this.setupScene();
      this.lastTime = performance.now();
      this.update(performance.now());
    },


    init: function() {
      this.$el = $('#app');

      this.screenScene = new THREE.Scene();

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0xffffff, 1);
      this.$el.append(this.renderer.domElement);


      this.renderTarget = new THREE.WebGLRenderTarget(this.planeResolution, this.planeResolution);


      this.resize();
      $(window).on('resize', this.resize);
      $(window).on('blur', $.proxy(function() { this.active = false; }, this));
      $(window).on('focus', $.proxy(function() { this.active = true; }, this));

      Settings.init();

      this.stats = new Stats();
      this.stats.domElement.style.position = 'fixed';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      $('body').append(this.stats.domElement);
    },

    loadTextures: function() {
      var textures = this.textures = {};

      var names = [
        'hektor_under_crop',
        'hektor_over_crop',
        'foot_crop',
        'face',
        'flower',
        'obama',
        'house'
      ];

      Settings.values.texture = names[0];
      Settings.gui.add(Settings.values, 'texture', names);

      _.each(names, function(name) {
        textures[name] = THREE.ImageUtils.loadTexture('res/' + name + '.jpg');
      });
    },

    resize: function() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
    },


    setupKernels: function() {
      this.kernels.push([
         1,  1,  1,
         1, -8,  1,
         1,  1,  1
      ]);
      this.kernels.push([
        -2, -1,  0,
        -1,  1,  1,
         0,  1,  2
      ]);
    },


    setupScene: function() {
      this.screenPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1)
      );
      this.screenScene.add(this.screenPlane);


      var geometry = new THREE.PlaneGeometry(1,1, this.planeResolution, this.planeResolution);

      this.kernelMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texture: {
            type: 't',
            value: THREE.ImageUtils.loadTexture('res/hektor_under_crop.jpg')
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
        fragmentShader: kernel_frag,
        side: THREE.DoubleSide
      });


      this.filterMaterial = new THREE.ShaderMaterial({
        uniforms: {
          texture: {
            type: 't',
            value: this.textures[Settings.values.texture]
          },
          filterType: {
            type: 'i',
            value: 0
          }
        },
        vertexShader: simple_vert,
        fragmentShader: filter_frag,
        side: THREE.DoubleSide
      });


      this.displaceMaterial = new THREE.ShaderMaterial({
        uniforms: {
          heightTexture: {
            type: 't',
            value: this.renderTarget
          },
          heightValue: {
            type: 'f',
            value: 0.0
          },
          filterType: {
            type: 'i',
            value: 0
          }
        },
        vertexShader: displace_vert,
        fragmentShader: filter_frag,
        side: THREE.DoubleSide
      });


      this.plane = new THREE.Mesh( geometry, this.displaceMaterial );
      this.scene.add( this.plane );

      this.camera.position.z = 0.65;
    },

    update: function() {
      setTimeout(this.update, 0);

      var time = performance.now();
      if (time - this.lastTime <= this.fpsms || !this.active) {
        return;
      }
      this.lastTime = time;




      var material = this.filterMaterial;
      var kernelIndex = -1;
      switch (Settings.values.filter) {
        case 'none':
          material.uniforms.filterType.value = 0;
          break;
        case 'grayscale':
          material.uniforms.filterType.value = 1;
          break;
        case 'luminosity':
          material.uniforms.filterType.value = 2;
          break;
        case 'edge':
          material = this.kernelMaterial;
          kernelIndex = 0;
          break;
        case 'embose':
          material = this.kernelMaterial;
          kernelIndex = 1;
          break;
      }

      var uniforms = material.uniforms;
      
      // bind kernels
      if (kernelIndex !== -1) {
        var kernel = this.kernels[kernelIndex];
        var kernelValues = uniforms.kernel.value;

        for (var i = kernel.length; i--; ) {
          kernelValues[i] = kernel[i];
        }
        uniforms.kernelSize.value = Math.sqrt(kernel.length);
      }
      uniforms.texture.value = this.textures[Settings.values.texture];



      this.screenPlane.material = material;
      this.renderer.render(this.screenScene, this.camera, this.renderTarget, true);


      this.displaceMaterial.uniforms.heightValue.value = Settings.values.height;
      // this.displaceMaterial.uniforms.heightTexture.value = this.renderTarget;

      this.camera.position.x = Math.cos( time * 0.001 ) * Settings.values.cameraMove;
      this.camera.lookAt( this.scene.position );

      this.renderer.render(this.scene, this.camera);
      this.stats.update();
    }
  };

  return App;
});
