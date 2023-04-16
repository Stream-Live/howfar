const shader = /** glsl */`
attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_textureMatrix;

varying vec2 v_texcoord;
varying vec4 v_projectedTexcoord;

void main() {
  // Multiply the position by the matrix.
  vec4 worldPosition = u_world * position;

  gl_Position = u_projection * u_view * worldPosition;

  // Pass the texture coord to the fragment shader.
  v_texcoord = texcoord;

  v_projectedTexcoord = u_textureMatrix * worldPosition;
}
`
export default shader;