const shader = /* glsl */ ` 
attribute vec4 a_position;
uniform mat4 u_matrix;

void main(){
  gl_Position = u_matrix * a_position;
}
`
export default shader