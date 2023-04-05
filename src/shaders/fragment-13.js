/*
 * @Author: Wjh
 * @Date: 2023-04-05 23:26:38
 * @LastEditors: Wjh
 * @LastEditTime: 2023-04-05 23:27:06
 * @FilePath: \howfar\src\shaders\fragment-13.js
 * @Description: 
 * 
 */
const shader = /* glsl */ `
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`
export default shader;