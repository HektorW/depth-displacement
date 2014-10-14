
const int maxsize = 25;

varying vec2 vUv;

uniform sampler2D texture;
uniform vec2 textureResolution;

uniform float kernel[maxsize];
uniform int kernelSize;


vec4 grayscale(vec4 color) {
  float val = (color.r + color.g + color.b) / 3.0;
  return vec4(val, val, val, color.a);
}


vec4 luminosity(vec4 color) {
  float v = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 3.0;
  return vec4(v, v, v, color.a);
}

void main(void) {
  vec4 totalColor = vec4(0.0, 0.0, 0.0, 0.0);
  float totalValue = 0.0;

  vec2 onePixel = vec2(1, 1) / vec2(1024, 512);

  int mean = (kernelSize-1) / 2;
  int size = kernelSize * kernelSize;

  float sampleX = 0.0;
  float sampleY = 0.0;
  for (int i = 0; i < maxsize; i++) {
    if (i >= size) {
      break;
    }

    if (int(mod(float(i), float(kernelSize))) == 0) {
      sampleY = float((i / kernelSize) - mean);
    }

    sampleX = float(mod(float(i), float(kernelSize)) - float(mean));
    
    vec4 col = texture2D(texture, vUv + onePixel * vec2(sampleX, sampleY));
    float value = kernel[i];

    totalColor += col * value;
    totalValue += value;
  }

  if (totalValue == 0.0) {
    totalValue = 1.0;
  }

  vec4 color = totalColor / totalValue;

  gl_FragColor = color;
  // gl_FragColor = grayscale(color);
  // gl_FragColor = grayscale(texture2D(texture, vUv));
  gl_FragColor = luminosity(texture2D(texture, vUv));
}


