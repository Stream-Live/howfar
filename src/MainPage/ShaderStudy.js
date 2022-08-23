import React from "react";
import * as THREE from "three";
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import {RayMarching} from './Helper'

export default class ShaderStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    const canvas = document.querySelector('#c2d');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true   // 抗锯齿
    });

    // 开启Hidpi设置
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // this.shader_fly_line(renderer, canvas)
    // this.shader_particle(renderer, canvas)

    // this.ray_marching1(renderer, canvas)
    // this.particle_system(renderer, canvas)
    this.fence(renderer, canvas)

  }

  fence(renderer, canvas){

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0, 30)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis)

    const width = 20,
          height = 10,
          bgColor = '#00FF00',
          lineColor = '#FFFF00',
          segment = 1.5;    // 圈圈之间的间隔高度

    const attrCindex = [];

    for(let i=0;i<height;i++){
      attrCindex.push(i/(height-1));
    }

    const geometry = new THREE.PlaneGeometry( width, height );
    geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1))

    const shader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new THREE.Color(bgColor)
        },
        uColor1: {
          value: new THREE.Color(lineColor)
        },
        uSize: {
          value: 10, 
        },
        height: {
          value: +height.toFixed(1)
        },
        segment: {  
          value: +segment.toFixed(1)
        }
      },
      vertexShader: `
        attribute float index;
        uniform float uSize;
        uniform float segment;
        uniform float height; 
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vColor;
        varying vec3 vColor1;
        varying float vOpacity;
        varying float positionY;
        varying float vSegment;
        void main(){
          float size = uSize;

          vOpacity = -position.y * (1.0/height)+(1.0/2.0);
          
          positionY = position.y;
          vColor = uColor;
          vColor1 = uColor1;
          vSegment = segment;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          //大小
          gl_PointSize = size * 300.0 / (-mvPosition.z);
        }
        
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying vec3 vColor1;
        varying float vOpacity;
        varying float positionY;
        varying float vSegment;
        void main(){

          float cur = mod(positionY / vSegment, 1.0);

          if(cur > 0.0 && cur < 0.2){
            float opacity;

            if(cur < 0.1){
              opacity = 10.0 * cur;
            }else{
              opacity = -10.0 * cur + 2.0;
            }
            vec3 color = mix(vColor, vColor1, opacity);
            gl_FragColor = vec4(color, vOpacity);
          }else{
            gl_FragColor = vec4(vColor, vOpacity);
          }
        }
      `
    })

    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, shader );
    scene.add( plane );

    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
  }

  particle_system(renderer, canvas){

    // renderer.setClearColor(0xb9d3ff, 1)
    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0, 300)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()
    // 场景
    const scene = new THREE.Scene()

    const vertices = [];

    for ( let i = 0; i < 10000; i ++ ) {

      const x = THREE.MathUtils.randFloatSpread( 2000 );
      const y = THREE.MathUtils.randFloatSpread( 2000 );
      const z = THREE.MathUtils.randFloatSpread( 2000 );

      vertices.push( x, y, z );

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    const material = new THREE.PointsMaterial( { color: 0x888888 } );

    const points = new THREE.Points( geometry, material );

    scene.add( points );

    
    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
  }
  // 光线步进
  ray_marching1(renderer, canvas){

    // const rayMarching = new RayMarching("#c2d", false);
    // rayMarching.init();


  }
  ray_marching(renderer, canvas){
    const left = -1,
          right = 1,
          top = 1,
          bottom = -1,
          near = 0,
          far = 1,
          zoom = 1;
    // 透视投影相机
    const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.set(5,5,5)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()
    
    let ambiColor = '#ffffff'
    let ambientLight = new THREE.AmbientLight(ambiColor)

    scene.add(ambientLight)
    
    // 添加光
    let pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(camera.position.x, camera.position.y, camera.position.z )
    scene.add(pointLight)
    

    // 创建平面
    const geometry = new THREE.PlaneBufferGeometry(2,2,100, 100);
    const material = new THREE.MeshLambertMaterial({color: 0xffff00});
    scene.add(new Mesh(geometry, material))

    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
  }
  shader_fly_line(renderer, canvas){
    // renderer.setClearColor(0xb9d3ff, 1)
    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0, 300)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()
    // 场景
    const scene = new THREE.Scene()

    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    // 粒子位置计算
    const source = -500;
    const target = 500;
    const number = 1000;
    const height = 300;
    const total = target-source;

    for(let i=0;i<number;i++){
      // 在0-1之间取1000个值
      const index = i / (number-1);
      // 在-500-500之间取1000个x坐标
      const x = total*index - total/2;
      const y = Math.sin(index * Math.PI) * height;
      positions.push({
        x,
        y,
        z: 0
      });
      attrCindex.push(index);
      attrCnumber.push(i)
    }

    positions.forEach(p => {
      attrPositions.push(p.x, p.y, p.z)
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3))
    geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1))
    geometry.setAttribute('current', new THREE.Float32BufferAttribute(attrCnumber, 1))

    const shader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new THREE.Color('#FF0000')
        },
        uColor1: {
          value: new THREE.Color('#FFFFFF')
        },
        uRange: {
          value: 100,
        },
        uSize: {
          value: 20, 
        },
        uTotal: {
          value: number
        },
        time: {
          value: 0
        }
      },
      vertexShader: `
        attribute float index;
        attribute float current;
        uniform float time;
        uniform float uSize;
        uniform float uRange; // 展示区间
        uniform float uTotal; // 粒子总数
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vColor;
        varying float vOpacity;
        void main(){
          float size = uSize;
          // 需要当前显示的索引
          float showNumber = uTotal * mod(time, 1.0);
          if(showNumber > current && showNumber < current + uRange){
            float uIndex = ((current + uRange) - showNumber) / uRange;
            size *= uIndex;
            vOpacity = 1.0;
          }else{
            vOpacity = 0.0;
          }

          // 顶点着色器计算后的Position
          vColor = mix(uColor, uColor1, index);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          //大小
          gl_PointSize = size * 300.0 / (-mvPosition.z);
        }
        
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main(){
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `
    })

    const point = new THREE.Points(geometry, shader)

    scene.add(point)

    setInterval(() => {
      shader.uniforms.time.value += 0.001
    })

    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
  }
  render() {
    return (
      <canvas id="c2d" style={{ width: '100%', height: '100%' }}>

      </canvas>
    )
  }
}