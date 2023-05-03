const shader = /**glsl */`
precision mediump float;
varying vec4 v_color;
uniform vec4 u_colorMult;
void main(){
  gl_FragColor = v_color * u_colorMult;
}
`
export default shader;