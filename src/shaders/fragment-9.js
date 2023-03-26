/*
 * @Author: Wjh
 * @Date: 2023-03-25 17:10:28
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-25 18:41:20
 * @FilePath: \howfar\src\shaders\fragment-9.js
 * @Description: 
 * 
 */
const shader =  /*glsl*/ `
  precision mediump float;
  varying vec4 v_color;
  uniform vec4 u_colorMult;

  void main(){
    gl_FragColor = v_color * u_colorMult;
  }
`
export default shader