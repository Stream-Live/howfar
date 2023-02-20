/*
 * @Author: Wjh
 * @Date: 2023-02-20 14:29:40
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-20 16:49:33
 * @FilePath: \howfar\src\shaders\vertex-2.js
 * @Description: 
 * 
 */


const vertexShader =  /*glsl*/ `
varying vec4 v_color;
attribute vec2 a_position;
uniform mat3 u_matrix;
attribute vec4 a_color;

void main(){

  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

  // v_color = gl_Position * 0.5 + 0.5;
  v_color = a_color;
}
`
export default vertexShader;