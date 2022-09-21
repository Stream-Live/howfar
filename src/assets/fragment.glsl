precision lowp float;精度
// highp  -2^16 - 2^16
// mediump -2^10 - 2^10
// lowp -2^8 - 2^8
varying vec2 vUv;
varying float vElevation;
//导入采样纹理
uniform sampler2D uTexture; 
 
 
void main(){
    // gl_FragColor = vec4(vUv, 0.0, 1.0);//由uv渲染颜色（0，1）
    // float height = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(1.0*height,0.0, 0.0, 1.0);
 
    
    float height = vElevation + 0.05 * 20.0;//0~2
    // 根据UV,取出对应的颜色
    //根据uv进行采样
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb*=height;
    gl_FragColor = textureColor;
}