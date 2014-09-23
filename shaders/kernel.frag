
const int maxsize = 121;

varying vec2 vUV;

uniform sampler2D tDiffuse;

/* uniform vec2 u_textureresolution;
uniform float u_kernel[maxsize];
uniform int u_kernelsize; */



void main(void) {
  vec4 totalColor = vec4(0.0, 0.0, 0.0, 0.0);
  float totalValue = 0.0;

  // vec2 onePixel = vec2(1, 1) / u_textureresolution;
  vec2 onePixel = vec2(1, 1) / vec2(1024, 512);

  int mean = (u_kernelsize-1) / 2;

  int size = u_kernelsize * u_kernelsize;

  float sample_i = 0.0;
  float sample_j = 0.0;
  for (int i = 0; i < maxsize; i++) {
    if (i > size) {
      break;
    }

    if (int(mod(float(i), float(u_kernelsize))) == 0) {
      sample_i = float((i / u_kernelsize) - mean);
    }

    sample_j = float(mod(float(i), float(u_kernelsize)) - float(mean));
    
    vec4 col = texture2D(u_texture, texcoord + (onePixel * vec2(sample_i, sample_j)));
    float value = u_kernel[i];
    totalColor += col * value;

    totalValue += value;
  }

  totalColor /= totalValue;

  vec4 color = vec4((totalColor).rgb, 1.0);
  gl_FragColor = color;
}

/* uniform sampler2D texture;

varying vec2 vUv;

void main() {
  float values[9];
  values[0] = +1.0;
  values[1] = +1.0;
  values[2] = +1.0;

  values[3] = +1.0;
  values[4] = -8.0;
  values[5] = +1.0;

  values[6] = +1.0;
  values[7] = +1.0;
  values[8] = +1.0;


  vec4 color =
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(-1, -1)) * values[0]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+0, -1)) * values[1]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+1, -1)) * values[2]) +

    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(-1, +0)) * values[3]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+0, +0)) * values[4]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+1, +0)) * values[5]) +

    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(-1, +1)) * values[6]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+0, +1)) * values[7]) +
    (texture2D(texture, vUv + (vec2(1, 1) / vec2(1024, 512)) * vec2(+1, +1)) * values[8]);

  float total = (values[0] + values[1] + values[2] + values[3] + values[4] + values[5] + values[6] + values[7] + values[8]);
  if (total == 0.0) {
    total = 1.0;
  }
  color = vec4(color.xyz / total, 1.0);

  gl_FragColor = color;
} */