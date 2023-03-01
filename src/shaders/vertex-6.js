/*
 * @Author: Wjh
 * @Date: 2023-02-28 17:02:55
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-01 09:05:21
 * @FilePath: \howfar\src\shaders\vertex-6.js
 * @Description: 
 * 
 */
const vertexShader = /*glsl*/ `
attribute vec4 a_position;
uniform mat4 u_matrix;
attribute vec4 a_color;
varying vec4 v_color;

uniform float u_fudgeFactor;

void main(){

  v_color = a_color;

  // // 使位置和矩阵相乘
  gl_Position = u_matrix * a_position;

  // vec4 position = u_matrix * a_position;

  // // // 调整除数
  // float zToDivideBy = 1.0 + position.z * u_fudgeFactor;

  // // // x和y除以调整后的除数
  // gl_Position = vec4(position.xyz, zToDivideBy);
}
`;
export default vertexShader;
