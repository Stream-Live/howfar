const shader =  /*glsl*/ `
// 片段着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;

uniform vec4 u_color;
varying vec3 v_normal;
// uniform vec3 u_reverseLightDirection;
varying vec3 v_surfaceToLight;

void main() {

  vec3 n = normalize(v_normal);

  // float light = dot(n, u_reverseLightDirection);
  float light = dot(n, normalize(v_surfaceToLight));

  gl_FragColor = u_color;

  gl_FragColor.rgb *= light; 
  
}
`
export default shader;