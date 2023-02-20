const shader =  /*glsl*/ `
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`
export default shader;