/*
 * @Author: Wjh
 * @Date: 2023-02-21 16:03:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-22 15:14:45
 * @FilePath: \howfar\src\shaders\vertex-4.js
 * @Description: 
 * 
 */
/*
 * @Author: Wjh
 * @Date: 2023-02-21 16:03:12
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-22 13:51:07
 * @FilePath: \howfar\src\shaders\vertex-4.js
 * @Description: 
 * 
 */
const vertexShader =  /*glsl*/ `
// attribute vec4 a_position;
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main(){
  // 缩放
  vec2 scaledPosition = a_position * u_scale;

  // 旋转位置
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // 加上平移量
  vec2 position = rotatedPosition + u_translation;

  // 从像素坐标转换到 0.0 到 1.0
  vec2 zeroToOne = position / u_resolution;

  // 再把 0->1 转换 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
 
  // 把 0->2 转换到 -1->+1 (裁剪空间)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`
export default vertexShader;