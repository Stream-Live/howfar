
const vertexShader = /*glsl*/ `
attribute vec4 a_position;
// uniform mat4 u_matrix;
attribute vec3 a_normal;
varying vec3 v_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
varying vec3 v_surfaceToLight;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

varying vec3 v_surfaceToView;

void main(){

  // v_normal = a_normal;

  // 使位置和矩阵相乘
  gl_Position = u_worldViewProjection * a_position;
  
  // 重定向法向量并传递给片段着色器
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // 表面到光的方向
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // 表面到相机的方向
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
`;
export default vertexShader;
