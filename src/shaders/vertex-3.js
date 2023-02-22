/*
 * @Author: Wjh
 * @Date: 2023-02-21 09:09:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-22 11:24:20
 * @FilePath: \howfar\src\shaders\vertex-3.js
 * @Description: 
 * 
 */

const vertexShader =  /*glsl*/ `

attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;
uniform float u_flipY;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;

}
`
export default vertexShader;