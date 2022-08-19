vec4 line(vec2 pos,vec2 p1,vec2 p2,float width){
    float k = (p1.y - p2.y)/(p1.x - p2.x);    
    float b = p1.y - k * p1.x;
    float t = distance(vec2(pos.x,k*pos.x+b),pos);    //带锯齿的算法，可以使用点到直线公式画出无锯齿的直线
    if(t<width)
        return vec4(0,0,0,1);
    else
        return vec4(1,1,1,1);
}
void main(){
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    gl_FragColor = line(uv,vec2(.1),vec2(.9),.01);
}