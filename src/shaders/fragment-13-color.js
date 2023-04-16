/*
 * @Author: Wjh
 * @Date: 2023-04-08 12:36:07
 * @LastEditors: Wjh
 * @LastEditTime: 2023-04-08 12:39:22
 * @FilePath: \howfar\src\shaders\fragment-13-color.js
 * @Description: 
 * 
 */
const shader = /* glsl */ ` 
precision mediump float;
uniform vec4 u_color;
void main(){
  gl_FragColor = u_color;
}
`
export default shader