/*
 * @Author: Wjh
 * @Date: 2023-04-22 19:56:41
 * @LastEditors: Wjh
 * @LastEditTime: 2023-05-02 17:18:15
 * @FilePath: \howfar\src\shaders\vertex-15.js
 * @Description: 
 * 
 */
const shader = /**glsl */`
attribute vec4 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main(){
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`
export default shader;