import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { PMREMGenerator, sRGBEncoding } from "three";
import { TextureLoader } from "three";
import { EquirectangularReflectionMapping } from "three";


import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader'
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import gsap from 'gsap'
// import TWEEN from "tween.js";
import * as d3 from 'd3'
import * as TWEEN from '@tweenjs/tween.js';

export default class EditPage extends React.Component {
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


    // this.perspectiveCamera(renderer, canvas)
    // this.tankMove(renderer, canvas)
    // this.shadow(renderer, canvas)
    this.fog(renderer, canvas)
    // this.raycaster(renderer, canvas)
    // this.webglRenderTarget(renderer, canvas)
    // this.load_gltf(renderer, canvas)
    // this.outline(renderer, canvas)
    // this.shape(renderer, canvas)
    // this.light(renderer, canvas)

    // this.raycasting_poingts(renderer, canvas)
    // this.study_raycasting_poingts(renderer, canvas)
    // this.points(renderer, canvas)

    // this.draw_map(renderer, canvas)
    // this.shader_change_color(renderer, canvas)
    // this.shader_particle(renderer, canvas)
    // this.curve_camera(renderer, canvas)
    // this.shader_fly_line(renderer, canvas);

  }
  shader_fly_line(renderer, canvas){
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

  curve_camera(renderer, canvas){
    // 相机公用方法
    function makeCamera(fov = 40) {

      const aspect = 2;
      const zNear = 0.1;
      const zFar = 1000;
      return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar)
    }

    const camera = makeCamera();

    camera.position.set(82,72,226);
    camera.lookAt(0, 0, 0);

    window.camera = camera

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const scene = new THREE.Scene();

    // 方向光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 30);
    scene.add(light)

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(-20, -20, -9);
    scene.add(light1)

    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色


    const curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3(-50, 20, 90),
      new THREE.Vector3(-10, 40, 40),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(60, -60, 0),
      new THREE.Vector3(70, 0, 80)
    ] );
    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject)

    const axis = new THREE.AxesHelper(100)
    scene.add(axis)

    const box = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), new THREE.MeshLambertMaterial({color: 0x00ff00}))
    box.position.set(30,10,40)
    scene.add(box)

    // 获取目标全局坐标
    const targetPosition = new THREE.Vector3()

    const cameraPosition = new THREE.Vector3(); 
    
    const num = 1000;
    let iArray = [];
    for(let i=0;i<num;i++){
      // 在0-1之间取num个数
      let index = i / (num-1);
      iArray.push(index)
    }

    let index = 0;
    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)

      if(index < iArray.length){
        curve.getPointAt(iArray[index], cameraPosition)
        // 位移
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        // 获取目标全局坐标
        box.getWorldPosition(targetPosition)
        // 炮台瞄准目标
        camera.lookAt(targetPosition);
        index++;
      }else{
        index = 0;
      }
    }
    render();
  }
  shader_particle(renderer, canvas){
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
    const attrCindex = [];
    const source = -500;
    const target = 500;
    const number = 100;
    const total = target - source;

    for(let i=0; i<number; i++){
      // 在0-1之间取100个值
      const index = i / (number-1);
      // 在-500-500之间取100个x坐标
      const x = total * index - total / 2;
      attrCindex.push(index);
      positions.push({
        x,
        y: 0,
        z: 0
      })
    }

    const geometry = new THREE.BufferGeometry();

    // 传递当前所在位置
    geometry.setAttribute('cindex', new THREE.Float32BufferAttribute(attrCindex, 1));
    const attrPositions = [];

    positions.forEach((p) => {
        attrPositions.push(p.x, p.y, p.z);
    })
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));

    const shader = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Color('#FF0000')
        },
        uColor1: {
          value: new THREE.Color('#FFFFFF')
        },
        uSize: {
          value: 20
        }
      },
      vertexShader: `
        attribute float cindex;
        uniform float uSize;
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vColor;
        void main(){
          // 顶点着色器计算后的Position
          // mix 混淆颜色
          vColor = mix(uColor, uColor1, cindex);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // 与模型矩阵相乘。可以随着空间的远近而变化
          gl_PointSize = uSize * 300.0 / (-mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vColor;
        void main(){
          gl_FragColor = vec4(vColor, 1.0);
        }
      `
    });

    const point = new THREE.Points(geometry, shader);
    scene.add(point)

    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
  }

  shader_change_color(renderer, canvas){

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

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/bali_small.jpeg')

    // 场景
    const scene = new THREE.Scene()

    const geometry = new THREE.PlaneGeometry(100, 100);

    const shader = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Color('#FFFF00')
        },
        uColor1: {
          value: new THREE.Color('#FFFFFF')
        },
        uRadius: {
          value: 0
        },
        uTexture: {
          value: texture
        }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 uUV;
        void main(){
          vPosition = position;
          // 把uv数据传递给片元
          uUV = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uRadius;
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying vec3 vPosition;
        varying vec2 uUV;
        uniform sampler2D uTexture;
        void main(){
          // 材质和uv计算为当前位置颜色
          vec4 mapColor = texture2D(uTexture, uUV);
          // 中心点
          vec3 vCenter = vec3(.0, .0, .0);
          // 计算定点离中心点的距离
          float len = distance(vCenter, vPosition);

          if(len < uRadius){
            gl_FragColor = mapColor;
          }else{
            gl_FragColor = vec4(uColor, 1.0);
          }
          
        }
      `
    });
    const plane = new THREE.Mesh(geometry, shader);

    scene.add(plane);

    let radius = 1;
    setInterval(() => {
      const color = `rgb(${(Math.random() * 255).toFixed(0)},${(Math.random() * 255).toFixed(0)},${(Math.random() * 255).toFixed(0)})`

      // shader.uniforms.uColor.value.setStyle(color);

      shader.uniforms.uRadius.value = radius % 50;
      radius++;
    }, 50)

    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()
  }

  draw_map(renderer, canvas){

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

    {
      const color = 0xffffff
      const intensity = 1
      // 环境光
      const light = new THREE.AmbientLight(color, intensity)
      // 加入场景
      scene.add(light)
    }

    const group = new THREE.Group()
    scene.add(group)
    {
      const loader = new THREE.FileLoader()
      loader.load('./100000_full.json', data => {
        const jsonData = JSON.parse(data)
        console.log(jsonData);
        operationData(jsonData)
      })
    }

    const projection = d3.geoMercator().center([116.412318, 39.909843]).translate([0,0])
    function drawExtrudeMesh(polygon, color){
      const shape = new THREE.Shape()
      polygon.forEach((row, i) => {
        const [x, y] = projection(row)

        if(i === 0){
          shape.moveTo(x, -y)
        }
        shape.lineTo(x, -y)
      })

      // 拉伸
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 10,
        bevelEnabled: false
      })
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5
      })
      return new THREE.Mesh(geometry, material)
    }

    function lineDraw(polygon, color){

      const lineGeometry = new THREE.BufferGeometry()
      const pointsArray = new Array()
      polygon.forEach(row => {
        const [x, y] = projection(row)

        pointsArray.push(new THREE.Vector3(x, -y, 9))
      })
      lineGeometry.setFromPoints(pointsArray)

      const lineMaterial = new THREE.LineBasicMaterial({
        color
      })
      return new THREE.Line(lineGeometry, lineMaterial)
    }

    let axis = new THREE.AxesHelper(700)
    scene.add(axis)

    const map = new THREE.Object3D()
    // 解析数据
    function operationData(jsonData){

      // 全国信息
      const features = jsonData.features

      features.forEach(feature => {
        // 单个省份
        const province = new THREE.Object3D()
        // 地址
        province.properties = feature.properties.name
        const coordinates = feature.geometry.coordinates
        const color = 'yellow'

        if(feature.geometry.type === 'MultiPolygon'){

          // 多个 多边形
          coordinates.forEach(coordinate => {
            coordinate.forEach(rows => {
              const mesh = drawExtrudeMesh(rows, color)
              const line = lineDraw(rows, color)
              province.add(line)
              province.add(mesh)
            })
          })
        }
        if(feature.geometry.type === 'Polygon'){
          coordinates.forEach(coordinate => {
            const mesh = drawExtrudeMesh(coordinate, color)
            province.add(mesh)
          })
        }
        group.add(province)
      })
    }


    // 渲染
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }


  study_raycasting_poingts(renderer, canvas){
    let scene, camera, stats;
    let pointclouds;
    let raycaster;
    let intersection = null;
    let spheresIndex = 0;
    let clock;
    let toggle = 0;

    const pointer = new THREE.Vector2();
    const spheres = [];

    const threshold = 0.1;
    const pointSize = 0.05;
    const width = 80;
    const length = 160;
    const rotateY = new THREE.Matrix4().makeRotationY(0.005);

    init();

    animate();

    function animate(){

      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }


    function init(){

      scene = new THREE.Scene();

      clock = new THREE.Clock();

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.set(10,10,10)
      camera.lookAt(scene.position)
      camera.updateMatrix()

      // 控制相机
      const controls = new OrbitControls(camera, canvas)
      controls.update()

      const pcBuffer = generatePointcloud(new THREE.Color(1,0,0), width, length);
      pcBuffer.scale.set(5, 10, 10)
      pcBuffer.position.set(-5, 0, 0)
      scene.add(pcBuffer)

      const pcIndexed = generateIndexedPointcloud(new THREE.Color(0,1,0))
      pcIndexed.scale.set(5, 10, 10)
      pcIndexed.position.set(0, 0, 0)
      scene.add(pcIndexed);

      const pcIndexedOffset = generateIndexedWithOffsetPointcloud(new THREE.Color(0,1,1), width, length)
      pcIndexedOffset.scale.set(5, 10, 10)
      pcIndexedOffset.position.set(5,0,0)
      scene.add(pcIndexedOffset)

      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
      const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})

      for(let i=0;i<40;i++){
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        scene.add(sphere)
        spheres.push(sphere)
      }

      renderer = new THREE.WebGLRenderer({antialias: true})
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      raycaster = new THREE.Raycaster();

      window.addEventListener('pointmove', onPointerMove)

    }


    function onPointerMove(event){

      pointer.x = (event.clientX / window.innerHeight)
      pointer.y = -(event.clientX / window.innerHeight)

    }

    function generateIndexedWithOffsetPointcloud(color, width, length){

      const geometry = generatePointCloudGeometry(color, width, length);

      const numPoints = width * length;
      const indices = new Uint16Array(numPoints)

      let k=0;

      for(let i=0;i<width;i++){
        for(let j=0;j<length;j++){
          indices[k] = k;
          k++;
        }
      }

      geometry.setIndex(new THREE.BufferAttribute(indices, 1))
      geometry.addGroup(0, indices.length)
      const material = new THREE.PointsMaterial({size: pointSize, vertexColors: true})

      return new THREE.Points(geometry, material)
    }

    function generateIndexedPointcloud(color, width, length){

      const geometry = generatePointCloudGeometry(color, width, length)
      const numPoints = width * length;
      const indices = new Uint16Array(numPoints)

      let k=0;

      for(let i=0;i<width;i++){
        for(let j=0;j<length;j++){
          indices[k] = k;
          k++;
        }
      }
      geometry.setIndex(new THREE.BufferAttribute(indices, 1))
      const material = new THREE.PointsMaterial({size: pointSize, vertexColors: true})
      return new THREE.Points(geometry, material)
    }

    function generatePointcloud(color, width, length){

      const geometry = generatePointCloudGeometry(color, width, length)
      const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true})
      return new THREE.Points(geometry, material)
    }
    function generatePointCloudGeometry(color, width, length){

      const geometry = new THREE.BufferGeometry();
      const numPoints = width * length;

      const positions = new Float32Array(numPoints * 3)
      const colors = new Float32Array(numPoints * 3)

      let k = 0;

      for(let i=0; i< width; i++){

        for(let j=0; j< length; j++){

          const u = i / width;
          const v = j / length;
          const x = u - 0.5;
          const y = ( Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
          const z = v-0.5;

          positions[3 * k] = x
          positions[3 * k + 1] = y
          positions[3 * k + 2] = z

          const intensity = (y + 0.1) * 5;
          colors[3 * k] = color.r * intensity;
          colors[3 * k + 1] = color.g * intensity;
          colors[3 * k + 2] = color.b * intensity;

          k++;
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.computeBoundingBox();

      return geometry;
    }
  } 
  points(renderer, canvas){
    
    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 1000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(30, 30, 30)
    camera.lookAt(30, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    renderer.shadowMap.enabled = true;  // 1、开启阴影渲染

    // 灯光
    const color = 0xffffff
    const intensity = 2
    const light = new THREE.PointLight(color, intensity)
    light.position.set(0, 10, 10)
    scene.add(light)

    const light1 = new THREE.DirectionalLight(color, intensity)
    light1.position.set(-10, -10, -10)
    scene.add(light1)


    const axis = new THREE.AxesHelper(30, 30, 30)
    scene.add(axis)

    {
      // 平面几何
      const groundGeometry = new THREE.PlaneGeometry(50, 50)
      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
      groundMesh.rotation.x = Math.PI * -0.5
      groundMesh.receiveShadow = true // 3、接受阴影
      // scene.add(groundMesh)
    }

    {
      function createPointsPlane({ width, length, density=1, position=[0,0,0], pointColor=0xcc8866}){

        let group = new THREE.Group()
        const rot = Math.PI/2;

        {
          // 1、创建平面点
          const w = width / density + 1;
          const l = length / density + 1;

          for(let i=0; i < w; i++){

            for(let j=0; j < l; j++){

              const geometry = new THREE.CircleGeometry(0.05, 50);

              const material = new THREE.MeshPhongMaterial( { 
                color: pointColor, 
                side: THREE.DoubleSide,
                polygonOffset: true 
              } );
              const mesh = new THREE.Mesh( geometry, material );

              mesh.position.set(i * density, j * density)
              
              group.add(mesh);

            }
          }
        }
        {
          // 2、创建网格
          const axis = new THREE.GridHelper(width, length)
          
          console.log(axis.material);
          axis.material.transparent = true;
          axis.material.opacity = 0.4
          axis.rotation.x = -Math.PI / 2
    
          axis.position.set(width / 2, length / 2, 0)
          group.add(axis)
        }
        {
          // 3、创建平面
          let planeGeometry = new THREE.PlaneGeometry(width, length)
          let planeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
          })

          let mesh = new THREE.Mesh(planeGeometry, planeMaterial)
          group.add(mesh)

          mesh.position.set(width / 2, length / 2, 0)
        }

        group.rotation.x = rot

        group.position.set.apply(group.position, position)


        return group
      }
      let group = createPointsPlane({ 
        width: 30, 
        length: 30, 
        density: 1,
        position:[-2,-2,-2],
        pointColor: 0xffffff
      })
      scene.add(group)

    }


    // 渲染
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
    


  }
  raycasting_poingts(renderer, canvas) {

    let scene, camera, stats;
    let pointclouds;
    let raycaster;
    let intersection = null;
    let spheresIndex = 0;
    let clock;
    let toggle = 0;

    const pointer = new THREE.Vector2();
    const spheres = [];

    const threshold = 0.1;
    const pointSize = 0.05;
    const width = 80;
    const length = 160;
    const rotateY = new THREE.Matrix4().makeRotationY(0.005);

    init();
    animate();

    function generatePointCloudGeometry(color, width, length) {

      const geometry = new THREE.BufferGeometry();
      const numPoints = width * length;

      const positions = new Float32Array(numPoints * 3);
      const colors = new Float32Array(numPoints * 3);

      let k = 0;

      for (let i = 0; i < width; i++) {

        for (let j = 0; j < length; j++) {

          const u = i / width;
          const v = j / length;
          const x = u - 0.5;
          const y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
          const z = v - 0.5;

          positions[3 * k] = x;
          positions[3 * k + 1] = y;
          positions[3 * k + 2] = z;

          const intensity = (y + 0.1) * 5;
          colors[3 * k] = color.r * intensity;
          colors[3 * k + 1] = color.g * intensity;
          colors[3 * k + 2] = color.b * intensity;

          k++;

        }

      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.computeBoundingBox();

      return geometry;

    }

    function generatePointcloud(color, width, length) {

      const geometry = generatePointCloudGeometry(color, width, length);
      const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true });

      return new THREE.Points(geometry, material);

    }

    function generateIndexedPointcloud(color, width, length) {

      const geometry = generatePointCloudGeometry(color, width, length);
      const numPoints = width * length;
      const indices = new Uint16Array(numPoints);

      let k = 0;

      for (let i = 0; i < width; i++) {

        for (let j = 0; j < length; j++) {

          indices[k] = k;
          k++;

        }

      }

      geometry.setIndex(new THREE.BufferAttribute(indices, 1));

      const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true });

      return new THREE.Points(geometry, material);

    }

    function generateIndexedWithOffsetPointcloud(color, width, length) {

      const geometry = generatePointCloudGeometry(color, width, length);
      const numPoints = width * length;
      const indices = new Uint16Array(numPoints);

      let k = 0;

      for (let i = 0; i < width; i++) {

        for (let j = 0; j < length; j++) {

          indices[k] = k;
          k++;

        }

      }

      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.addGroup(0, indices.length);

      const material = new THREE.PointsMaterial({ size: pointSize, vertexColors: true });

      return new THREE.Points(geometry, material);

    }

    function init() {

      const container = document.getElementById('container');

      scene = new THREE.Scene();

      clock = new THREE.Clock();

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(10, 10, 10);
      camera.lookAt(scene.position);
      camera.updateMatrix();

      //

      const pcBuffer = generatePointcloud(new THREE.Color(1, 0, 0), width, length);
      pcBuffer.scale.set(5, 10, 10);
      pcBuffer.position.set(- 5, 0, 0);
      scene.add(pcBuffer);

      const pcIndexed = generateIndexedPointcloud(new THREE.Color(0, 1, 0), width, length);
      pcIndexed.scale.set(5, 10, 10);
      pcIndexed.position.set(0, 0, 0);
      scene.add(pcIndexed);

      const pcIndexedOffset = generateIndexedWithOffsetPointcloud(new THREE.Color(0, 1, 1), width, length);
      pcIndexedOffset.scale.set(5, 10, 10);
      pcIndexedOffset.position.set(5, 0, 0);
      scene.add(pcIndexedOffset);

      pointclouds = [pcBuffer, pcIndexed, pcIndexedOffset];

      //

      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

      for (let i = 0; i < 40; i++) {

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        spheres.push(sphere);

      }

      //

      // renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // container.appendChild(renderer.domElement);

      //

      raycaster = new THREE.Raycaster();
      raycaster.params.Points.threshold = threshold;

      //

      stats = new Stats();
      canvas.appendChild(stats.dom);

      //

      window.addEventListener('resize', onWindowResize);
      document.addEventListener('pointermove', onPointerMove);

    }

    function onPointerMove(event) {

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

      requestAnimationFrame(animate);

      render();
      stats.update();

    }

    function render() {

      camera.applyMatrix4(rotateY);
      camera.updateMatrixWorld();

      raycaster.setFromCamera(pointer, camera);

      const intersections = raycaster.intersectObjects(pointclouds, false);
      intersection = (intersections.length) > 0 ? intersections[0] : null;

      if (toggle > 0.02 && intersection !== null) {

        spheres[spheresIndex].position.copy(intersection.point);
        spheres[spheresIndex].scale.set(1, 1, 1);
        spheresIndex = (spheresIndex + 1) % spheres.length;

        toggle = 0;

      }

      for (let i = 0; i < spheres.length; i++) {

        const sphere = spheres[i];
        sphere.scale.multiplyScalar(0.98);
        sphere.scale.clampScalar(0.01, 1);

      }

      toggle += clock.getDelta();

      renderer.render(scene, camera);

    }
  }

  light(renderer, canvas) {

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 10)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    renderer.setClearColor(0xffffff)
    // 场景
    const scene = new THREE.Scene()

    let ambiColor = '#ff0000'
    let ambientLight = new THREE.AmbientLight(ambiColor)

    scene.add(ambientLight)

    // 对于0x00ff00的物体，红色通道是0，而环境光是完全的红光，因此该长方体不能反射任何光线，最终的渲染颜色就是黑色；
    let greenCube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshLambertMaterial({ color: 0xf00ff00 })
    )

    greenCube.position.x = 3;
    scene.add(greenCube)

    // 而对于0xffffff的白色长方体，红色通道是0xff，因而能反射所有红光，渲染的颜色就是红色
    let whiteCube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    )
    whiteCube.position.x = -3
    scene.add(whiteCube)

    const axis = new THREE.AxesHelper(5)
    scene.add(axis)

    function render() {

      renderer.render(scene, camera)
    }
    requestAnimationFrame(render)
  }

  shape(renderer, canvas) {

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 10)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    // 创建心形 路径
    const heartShape = new THREE.Shape()
    heartShape.moveTo(0, 1.5)
    heartShape.bezierCurveTo(2, 3.5, 4, 1.5, 2, -0.5)
    heartShape.lineTo(0, -2.5)
    heartShape.lineTo(-2, -0.5)
    heartShape.bezierCurveTo(-4, 1.5, -2, 3.5, 0, 1.5)


    const axis = new THREE.AxesHelper(10, 10, 10)
    // scene.add(axis)

    {
      // 灯光
      const color = 0xffffff
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, 10, 4)
      scene.add(light)
    }

    {
      // 灯光
      const color = 0xffffff
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, -10, -4)
      scene.add(light)
    }

    const extrudeSettings = {
      steps: 2,
      depth: 3
    }

    // 心形平面
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide  // 平面两面都渲染
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const mesh1 = mesh.clone()
    mesh1.position.x = 10
    mesh1.name = 'mesh1'
    scene.add(mesh1)

    // 效果合成器
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass); // 将传入的过程添加到过程链

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.visibleEdgeColor.set(0xffff00)
    outlinePass.edgeStrength = 3;
    outlinePass.edgeGlow = 0.3;
    outlinePass.edgeThickness = 3;
    outlinePass.pulsePeriod = 2.5;
    composer.addPass(outlinePass);

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);

    window.addEventListener('resize', onWindowResize);

    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const mouse = new THREE.Vector2();

    function onPointerMove(event) {

      if (event.isPrimary === false) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      checkIntersection();

    }

    let selectedObjects;

    const raycaster = new THREE.Raycaster();

    function addSelectedObject(object) {

      selectedObjects = [];
      selectedObjects.push(object);

    }

    function checkIntersection() {

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(scene, true);

      if (intersects.length > 0) {

        const selectedObject = intersects[0].object;
        addSelectedObject(selectedObject);
        // if (selectedObject.name === 'mesh1') {
          outlinePass.visibleEdgeColor.set(0xffff00);
        // } else {
        //   outlinePass.visibleEdgeColor.set(0xffffff)
        // }
        outlinePass.selectedObjects = selectedObjects;


      } else {

        outlinePass.selectedObjects = [];

      }

    }
    function onWindowResize() {

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);

      effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

    }
    function animate() {

      requestAnimationFrame(animate);

      controls.update();

      composer.render();


    }
    animate()


    // 渲染
    // function render() {
    //   renderer.render(scene, camera)
    //   requestAnimationFrame(render)
    // }
    // requestAnimationFrame(render)
  }

  outline(renderer) {
    let container, stats;
    let camera, scene, controls;
    let composer, effectFXAA, outlinePass;

    let selectedObjects = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const obj3d = new THREE.Object3D();
    const group = new THREE.Group();

    const params = {
      edgeStrength: 3.0,
      edgeGlow: 0.0,
      edgeThickness: 1.0,
      pulsePeriod: 0,
      rotate: false,
      usePatternTexture: false
    };

    // Init gui

    const gui = new GUI({ width: 280 });

    gui.add(params, 'edgeStrength', 0.01, 10).onChange(function (value) {

      outlinePass.edgeStrength = Number(value);

    });

    gui.add(params, 'edgeGlow', 0.0, 1).onChange(function (value) {

      outlinePass.edgeGlow = Number(value);

    });

    gui.add(params, 'edgeThickness', 1, 4).onChange(function (value) {

      outlinePass.edgeThickness = Number(value);

    });

    gui.add(params, 'pulsePeriod', 0.0, 5).onChange(function (value) {

      outlinePass.pulsePeriod = Number(value);

    });

    gui.add(params, 'rotate');

    gui.add(params, 'usePatternTexture').onChange(function (value) {

      outlinePass.usePatternTexture = value;

    });

    function Configuration() {

      this.visibleEdgeColor = '#ffffff';
      this.hiddenEdgeColor = '#190a05';

    }

    const conf = new Configuration();

    gui.addColor(conf, 'visibleEdgeColor').onChange(function (value) {

      outlinePass.visibleEdgeColor.set(value);

    });

    gui.addColor(conf, 'hiddenEdgeColor').onChange(function (value) {

      outlinePass.hiddenEdgeColor.set(value);

    });

    init();
    animate();

    function init() {

      container = document.createElement('div');
      document.body.appendChild(container);

      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.shadowMap.enabled = true;
      // todo - support pixelRatio in this demo
      renderer.setSize(width, height);
      document.body.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 8);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 5;
      controls.maxDistance = 20;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      //

      scene.add(new THREE.AmbientLight(0xaaaaaa, 0.2));

      const light = new THREE.DirectionalLight(0xddffdd, 0.6);
      light.position.set(1, 1, 1);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      const d = 10;

      light.shadow.camera.left = - d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = - d;
      light.shadow.camera.far = 1000;

      scene.add(light);

      // model

      const loader = new OBJLoader();
      loader.load('models/obj/tree.obj', function (object) {

        let scale = 1.0;

        object.traverse(function (child) {

          if (child instanceof THREE.Mesh) {

            child.geometry.center();
            child.geometry.computeBoundingSphere();
            scale = 0.2 * child.geometry.boundingSphere.radius;

            const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 5 });
            child.material = phongMaterial;
            child.receiveShadow = true;
            child.castShadow = true;

          }

        });

        object.position.y = 1;
        object.scale.divideScalar(scale);
        obj3d.add(object);

      });

      scene.add(group);

      group.add(obj3d);

      //

      const geometry = new THREE.SphereGeometry(3, 48, 24);

      for (let i = 0; i < 20; i++) {

        const material = new THREE.MeshLambertMaterial();
        material.color.setHSL(Math.random(), 1.0, 0.3);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 4 - 2;
        mesh.position.y = Math.random() * 4 - 2;
        mesh.position.z = Math.random() * 4 - 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        group.add(mesh);

      }

      const floorMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });

      const floorGeometry = new THREE.PlaneGeometry(12, 12);
      const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
      floorMesh.rotation.x -= Math.PI * 0.5;
      floorMesh.position.y -= 1.5;
      group.add(floorMesh);
      floorMesh.receiveShadow = true;

      const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
      const torusMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaff });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.z = - 4;
      group.add(torus);
      torus.receiveShadow = true;
      torus.castShadow = true;

      //

      stats = new Stats();
      container.appendChild(stats.dom);

      // postprocessing

      composer = new EffectComposer(renderer);

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
      composer.addPass(outlinePass);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('textures/tri_pattern.jpg', function (texture) {

        outlinePass.patternTexture = texture;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

      });

      effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
      composer.addPass(effectFXAA);

      window.addEventListener('resize', onWindowResize);

      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.addEventListener('pointermove', onPointerMove);

      function onPointerMove(event) {

        if (event.isPrimary === false) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        checkIntersection();

      }

      function addSelectedObject(object) {

        selectedObjects = [];
        selectedObjects.push(object);

      }

      function checkIntersection() {

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(scene, true);

        if (intersects.length > 0) {

          const selectedObject = intersects[0].object;
          addSelectedObject(selectedObject);
          outlinePass.selectedObjects = selectedObjects;

        } else {

          // outlinePass.selectedObjects = [];

        }

      }

    }

    function onWindowResize() {

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);

      effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

    }

    function animate() {

      requestAnimationFrame(animate);

      stats.begin();

      const timer = performance.now();

      if (params.rotate) {

        group.rotation.y = timer * 0.0001;

      }

      controls.update();

      composer.render();

      stats.end();

    }
  }


  load_gltf(renderer, canvas) {

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 1000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(80, 80, 80)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    const axis = new THREE.AxesHelper(100)
    scene.add(axis)


    let ambiColor = '#ffffff'
    let ambientLight = new THREE.AmbientLight(ambiColor)

    scene.add(ambientLight)

    // 1、加载gltf文件
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/model.gltf',
      function (gltf) {
        scene.add(gltf.scene)
        
        setTimeout(function(){

          
          const obj = scene.getObjectByName('ROV402');
          console.log('time!', obj);

          let d = 10; // 距离
          // let line1 = new THREE.Vector3(camera.position.x, obj.position.y, camera.position.z)
          // let line2 = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
          // let seta = line1.angleTo(line2);

          gsap
          .to(camera.position,{
            x: obj.position.x+d,
            y: obj.position.y+d,
            z: obj.position.z+d,
            duration: 3
          })
          gsap
          .to(controls.target,{
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z,
            duration: 3
          })

        }, 3000)
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    )

    // 2、通过hdr文件添加环境光
    const pmremGenerator = new PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader();


    const skyTexture = new TextureLoader().load('/4.jpg', texture => {
      scene.background = skyTexture
      skyTexture.mapping = EquirectangularReflectionMapping;
    })

    // 添加光
    let pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(camera.position.x, camera.position.y, camera.position.z )
    scene.add(pointLight)
    
    
    let stats = new Stats()
    document.body.appendChild(stats.domElement)


    // 渲染
    function render() {

      renderer.render(scene, camera)

      requestAnimationFrame(render)
      stats.update()
      // if(pipeline){
      //   pipeline.material.map.offset.x += 0.01
      // }

      // pointLight.position.set(camera.position.x, camera.position.y, camera.position.z )
    }
    requestAnimationFrame(render)

  }

  webglRenderTarget(renderer, canvas) {

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 1000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 20, 20)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()
    {
      // 光源
      const color = 0xffffff
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, 2, 4)
      scene.add(light)
    }

    // 创建渲染器
    const rtWidth = 512;
    const rtHeight = 512;
    const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

    // 创建相机和场景
    const rtFov = 75
    const rtAspect = rtWidth / rtHeight
    const rtNear = 0.1
    const rtFar = 5
    const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar)
    rtCamera.position.z = 2
    const rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color('white')

    // 几何体
    const rtBox = 1
    const rtGeometry = new THREE.BoxGeometry(rtBox, rtBox, rtBox)
    const rtMaterial = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
    const rtCube = new THREE.Mesh(rtGeometry, rtMaterial)
    rtScene.add(rtCube)

    // 立体
    const boxWidth = 6
    const boxHeight = 6
    const boxDepth = 6
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    // 材质
    const material = new THREE.MeshPhongMaterial({
      // color: 0x00ff00 
      map: renderTarget.texture
    })
    const mesh = new THREE.Mesh(boxGeometry, material)
    scene.add(mesh)

    // 渲染
    function render(time) {
      time *= 0.001

      mesh.rotation.y = time
      mesh.rotation.x = time

      renderer.render(scene, camera)

      renderer.setRenderTarget(renderTarget)
      renderer.render(rtScene, rtCamera)
      renderer.setRenderTarget(null)
      rtCube.rotation.x = time
      rtCube.rotation.y = time

      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)


  }

  raycaster(renderer, canvas) {

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 6, 5)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    const axis = new THREE.AxesHelper(10, 10, 10)
    scene.add(axis)

    {
      // 灯光
      const color = 0xffffff
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(3, 10, 4)
      scene.add(light)
    }

    {
      // 立方体
      const boxWidth = 1
      const boxHeight = 1
      const boxDepth = 1
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

      const material = new THREE.MeshPhongMaterial({
        color: 0x6688aa
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.x = -1
      scene.add(cube)
      const axis = new THREE.AxesHelper(1.5, 1.5, 1.5)
      cube.add(axis)

      const material2 = new THREE.MeshPhongMaterial({
        color: 0x6688aa
      })
      const cube2 = new THREE.Mesh(geometry, material2)
      cube2.position.x = 1
      scene.add(cube2)
      const axis2 = new THREE.AxesHelper(1.5, 1.5, 1.5)
      cube2.add(axis2)

      cube.rotateY(Math.PI / 3);
      cube.rotateX(Math.PI / 3)

      cube2.rotation.y = Math.PI / 3
      cube2.rotation.x = Math.PI / 3
    }


    function getCanvasRelativePosition(event) {

      const rect = canvas.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      }
    }

    // 归一化鼠标坐标   
    // 归一化就是要把需要处理的数据经过处理后（通过某种算法）限制在你需要的一定范围内
    // 例如，假设我们把训练数据的第一个属性从[-10,+10]缩放到[-1, +1]，那么如果测试数据的第一个属性属于区间[-11, +8]，我们必须将测试数据转变成[-1.1, +0.8]
    function setPickPosition(event) {

      let pickPosition = { x: 0, y: 0 }

      // 计算后 以画布 开始为 （0，0）点
      const pos = getCanvasRelativePosition(event)

      // 数据归一化
      pickPosition.x = (pos.x / canvas.width) * 2 - 1
      pickPosition.y = (pos.y / canvas.height) * -2 + 1

      return pickPosition
    }
    // 监听鼠标
    // window.addEventListener('mousemove', onRay)
    // 全局对象
    let lastPick = null
    function onRay(event) {

      let pickPosition = setPickPosition(event)

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(pickPosition, camera)

      // 计算物体和射线的交点
      const intersects = raycaster.intersectObjects(scene.children, true)

      // 数组大于 0 表示有相交对象
      if (intersects.length > 0) {
        if (lastPick) {
          lastPick.object.material.color.set('yellow')
        }
        lastPick = intersects[0]
      } else {
        if (lastPick) {
          // 复原
          lastPick.object.material.color.set(0x6688aa)
          lastPick = null
        }
      }
    }

    // 渲染
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }

  fog(renderer, canvas) {

    const fov = 75 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    {
      const near = 1
      const far = 11
      const color = 'lightblue'
      scene.fog = new THREE.Fog(color, near, far)
      scene.background = new THREE.Color(color)
    }

    {
      const color = 0xffffff
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, 2, 4)
      scene.add(light)

      const helper = new THREE.DirectionalLightHelper(light)
      scene.add(helper)
    }
    const box = 3
    const geometry = new THREE.BoxGeometry(box, box, box)
    const material = new THREE.MeshPhongMaterial({ color: 0x8844aa })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)


    // 设置材质是否会受到雾的影响。默认是true
    // material.fog = false  


    // 渲染
    function render(time) {
      time *= 0.001

      const rot = time
      cube.rotation.x = rot
      cube.rotation.y = rot

      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }

  shadow(renderer, canvas) {
    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 1000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 50, 50)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene()

    renderer.shadowMap.enabled = true;  // 1、开启阴影渲染

    // 灯光
    const color = 0xffffff
    const intensity = 2
    const light = new THREE.DirectionalLight(color, intensity)
    light.castShadow = true   // 2、投射阴影
    light.position.set(10, 10, 10)
    light.target.position.set(-4, 0, -4)
    scene.add(light)
    scene.add(light.target)

    const helper = new THREE.DirectionalLightHelper(light)
    scene.add(helper)

    const axis = new THREE.AxesHelper(20, 20, 20)
    scene.add(axis)

    {
      // 平面几何
      const groundGeometry = new THREE.PlaneGeometry(50, 50)
      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866, side: THREE.DoubleSide })
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
      groundMesh.rotation.x = Math.PI * -0.5
      groundMesh.receiveShadow = true // 3、接受阴影
      scene.add(groundMesh)
    }
    {
      // 几何体
      const cubeSize = 4
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
      const mesh = new THREE.Mesh(cubeGeo, cubeMat)
      mesh.castShadow = true // 4、投射阴影
      mesh.receiveShadow = true // 5、接受阴影
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
      scene.add(mesh)
    }

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(cameraHelper)

    // 设置阴影相机
    const d = 20
    light.shadow.camera.left = -d
    light.shadow.camera.right = d
    light.shadow.camera.top = d
    light.shadow.camera.bottom = -d
    light.shadow.camera.near = 1
    light.shadow.camera.far = 60



    // 渲染
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }

  tankMove(renderer, canvas) {

    // 相机公用方法
    function makeCamera(fov = 40) {

      const aspect = 2;
      const zNear = 0.1;
      const zFar = 1000;
      return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar)
    }

    const camera = makeCamera();

    camera.position.set(24, 12, 30);
    camera.lookAt(0, 0, 0);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const scene = new THREE.Scene();

    // 方向光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 20, 0);
    scene.add(light)

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 2, 4);
    scene.add(light1)

    // 绘制地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50)
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 })
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
    groundMesh.rotation.x = Math.PI * -0.5
    // groundMesh.position.z = 2
    scene.add(groundMesh)

    const axis = new THREE.AxesHelper(30, 30, 30)
    scene.add(axis)

    // 绘制坦克
    const tank = new THREE.Object3D();
    scene.add(tank)

    // 创建底盘
    const carWidth = 4
    const carHeight = 1
    const carLength = 8

    // 几何体
    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa })
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
    bodyMesh.position.y = 1.4
    tank.add(bodyMesh)

    const wheelRadius = 1
    const wheelThickness = 0.5
    const wheelSegments = 36
    // 圆柱体
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius,  //  圆柱底部圆的半径
      wheelRadius,  //  圆柱底部圆的半径
      wheelThickness, // 高度
      wheelSegments // x轴分成多少段
    )
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
    // 根据底盘 定位轮胎位置
    const wheelPositions = [
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3]
    ]
    const wheelMeshes = wheelPositions.map(position => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
      mesh.position.set(...position)
      mesh.rotation.z = Math.PI * 0.5
      bodyMesh.add(mesh)
      return mesh
    })
    // 底盘局部相机
    const tankCameraFov = 75;
    const tankCamera = makeCamera(tankCameraFov)
    tankCamera.position.y = 3
    tankCamera.position.z = -6
    tankCamera.rotation.y = Math.PI
    bodyMesh.add(tankCamera)

    // 绘制坦克头
    const domeRadius = 2
    const domeWidthSubdivisions = 12
    const domeHeightSubdivisions = 12
    const domePhiStart = 0
    const domePhiEnd = Math.PI * 2
    const domeThetaStart = 0
    const domeThetaEnd = Math.PI * 0.5
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius,
      domeWidthSubdivisions,
      domeHeightSubdivisions,
      domePhiStart,
      domePhiEnd,
      domeThetaStart,
      domeThetaEnd,
    )
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial)
    bodyMesh.add(domeMesh)
    domeMesh.position.y = 0.5

    // 炮干
    const turretWidth = 0.5
    const turretHeight = 0.5
    const turretLength = 5
    const turretGeometry = new THREE.BoxGeometry(turretWidth, turretHeight, turretLength)
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial)
    const turretPivot = new THREE.Object3D()
    turretPivot.position.y = 1.5
    turretMesh.position.z = turretLength * 0.5
    turretPivot.add(turretMesh)
    bodyMesh.add(turretPivot)

    // 绘制目标
    const targetGeometry = new THREE.SphereGeometry(0.5, 36, 36)
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true })
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial)
    const targetElevation = new THREE.Object3D()
    const targetBob = new THREE.Object3D()
    scene.add(targetElevation)
    targetElevation.position.z = carLength * 2
    targetElevation.position.y = 8
    targetElevation.add(targetBob)
    targetBob.add(targetMesh)

    // 获取目标全局坐标
    const targetPosition = new THREE.Vector3()
    targetMesh.getWorldPosition(targetPosition)
    // 炮台瞄准目标
    turretPivot.lookAt(targetPosition)

    // 目标上的相机
    const targetCamera = makeCamera()
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI
    targetBob.add(targetCamera)

    // 绘制移动路径
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-10, 20),
      new THREE.Vector2(-5, 5),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(5, -5),
      new THREE.Vector2(10, 0),
      new THREE.Vector2(5, 10),
      new THREE.Vector2(-5, 10),
      new THREE.Vector2(-10, -10),
      new THREE.Vector2(-15, -8),
      new THREE.Vector2(-10, 20)
    ])

    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const splineObject = new THREE.Line(geometry, material)
    splineObject.rotation.x = Math.PI * 0.5
    splineObject.position.y = 0.05
    scene.add(splineObject)

    // 移动坦克
    const targetPosition2 = new THREE.Vector3()
    const tankPosition = new THREE.Vector2()
    const tankTarget = new THREE.Vector2()

    const cameras = [
      { cam: camera, desc: '全局相机' },
      { cam: targetCamera, desc: '目标上的相机' },
      { cam: tankCamera, desc: '底盘 局部相机' }
    ]

    // 渲染
    function render(time) {

      time *= 0.001;

      requestAnimationFrame(render)

      // 上下移动目标
      targetBob.position.y = Math.sin(time * 2) * 4
      targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25)
      targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25)
      // 获取目标全局坐标
      targetMesh.getWorldPosition(targetPosition2)
      // 炮台瞄准目标
      turretPivot.lookAt(targetPosition2)

      // 根据路线移动坦克
      const tankTime = time * 0.05
      curve.getPointAt(tankTime % 1, tankPosition)
      // 获取 路径 坦克前一点坐标 用于坦克头 向前
      curve.getPointAt((tankTime + 0.01) % 1, tankTarget)
      // 位移
      tank.position.set(tankPosition.x, 0, tankPosition.y)
      tank.lookAt(tankTarget.x, 0, tankTarget.y)

      // 切换相机
      const camera1 = cameras[time % cameras.length | 0]
      tank.getWorldPosition(targetPosition2)

      renderer.render(scene, tankCamera)
    }
    render(50)
  }

  perspectiveCamera(renderer, canvas) {


    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black')

    const fov = 40  // 视野范围
    const aspect = 2  // 相机默认值 画布的宽高比
    const near = 0.1  //近平面
    const far = 1000  // 远平面

    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20)
    camera.lookAt(0, 0, 0)

    const cameraHelper = new THREE.CameraHelper(camera)
    scene.add(cameraHelper)

    let controls = new OrbitControls(camera, canvas)


    // 地面 平铺
    const planeSize = 20;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -0.5
    scene.add(planeMesh)

    // 方块
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8f4b2e' })
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat)
    scene.add(cubeMesh)
    cubeMesh.position.y = 2
    cubeMesh.name = 'cubeMesh'

    console.log(scene.getObjectByName('cubeMesh'));

    // 灯光
    const color = 0xffffff
    const intensity = 1
    // 方向光
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)

    // 渲染
    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)

      controls.update()
      cameraHelper.update()
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