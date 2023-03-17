/*
 * @Author: Wjh
 * @Date: 2023-03-13 10:58:35
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-17 09:42:46
 * @FilePath: \howfar\src\shaders\vertex-8.js
 * @Description: 
 * 
 */
const shader =  /*glsl*/ `

  attribute vec3 a_position;
  uniform mat4 u_worldViewProjection;

  void main(){

    gl_Position = u_worldViewProjection * a_position;

  }
`
export default shader