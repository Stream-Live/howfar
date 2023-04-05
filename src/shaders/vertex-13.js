const shader = /* glsl */ `

attribute vec4 position;
attribute vec4 color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * position;

  // Pass the vertex color to the fragment shader.
  v_color = color;
}

`
export default shader;