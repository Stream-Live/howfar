/*
 * @Author: Wjh
 * @Date: 2023-03-02 09:14:52
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-09 17:16:36
 * @FilePath: \howfar\src\shaders\fragment-7.js
 * @Description: 
 * 
 */
const shader =  /*glsl*/ `
// 片段着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;

uniform vec4 u_color;
varying vec3 v_normal;
// uniform vec3 u_reverseLightDirection;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform float u_shininess;

uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

uniform vec3 u_lightDirection;
uniform float u_limit;

void main() {

  vec3 n = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  // float light = dot(n, u_reverseLightDirection);
  // float light = dot(n, normalize(v_surfaceToLight));
  // float light = dot(n, surfaceToLightDirection);
  // // float specular = dot(n, halfVector);

  // float specular = 0.0;
  // if(light > 0.0){
  //   specular = pow(dot(n, halfVector), u_shininess);
  // }

  float light = 0.0;
  float specular = 0.0;

  float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);

  // if(dotFromDirection >= u_limit){
  //   light = dot(n, surfaceToLightDirection);
  //   if(light > 0.0){
  //     specular = pow(dot(n, halfVector), u_shininess);
  //   }
  // }

  float inLight = step(u_limit, dotFromDirection);
  light = inLight * dot(n, surfaceToLightDirection);
  specular = inLight * pow(dot(n, halfVector), u_shininess);

  gl_FragColor = u_color;

  gl_FragColor.rgb *= light ; 

  // 加高光
  gl_FragColor.rgb += specular ;

}
`
export default shader;