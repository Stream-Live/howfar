const shader =  /*glsl*/ `

  uniform vec3 uColor;

  void main(){

    gl_FragColor = vec3(uColor, 1.);
  }
`
export default shader