
varying vec2 vUv;

uniform sampler2D texture;
uniform int filterType;


vec4 grayscale(vec4 color) {
  float val = (color.r + color.g + color.b) / 3.0;
  return vec4(val, val, val, color.a);
}

vec4 luminosity(vec4 color) {
  float v = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 3.0;
  return vec4(v, v, v, color.a);
}


void main(void) {
  vec4 color = texture2D(texture, vUv);

  if (filterType == 0) { // none
    // pass
  }
  if (filterType == 1) { // grayscale
    color = grayscale(color);
  }
  if (filterType == 2) { // luminosity
    color = luminosity(color);
  }

  gl_FragColor = color;
}


