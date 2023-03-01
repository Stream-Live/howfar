/*
 * @Author: Wjh
 * @Date: 2023-02-28 17:02:55
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-01 08:37:15
 * @FilePath: \howfar\src\shaders\fragment-6.js
 * @Description: 
 * 
 */
const shader =  /*glsl*/ `
// 片段着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;

uniform vec4 u_color;
varying vec4 v_color;

void main() {
  // gl_FragColor是一个片段着色器主要设置的变量
  gl_FragColor = v_color;
}
`
export default shader;