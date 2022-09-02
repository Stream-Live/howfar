import React from "react";
import * as THREE from "three";
import { MeshLambertMaterial } from "three";
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import gsap from 'gsap'
import { Vector3 } from "three";
import * as _ from 'lodash'
// import {RayMarching} from './Helper'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm//renderers/CSS2DRenderer.js";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm//renderers/CSS3DRenderer";
import TWEEN from "tween.js";
import shuData from '../assets/shu'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { BoxGeometry } from "three";

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

    // this.particle_system(renderer, canvas)

    // 取代木棉树的API
    // this.fence(renderer, canvas) // 创建围栏
    // this.animationPath(renderer, canvas)  // 创建动画路径
    this.CSS2DAnd3D(renderer, canvas) // 创建dom元素标签  和镜头聚焦
    // this.axisChange(renderer, canvas) // 世界坐标转屏幕坐标
    // this.optimizeTree(renderer, canvas) 

  }

  optimizeTree(renderer, canvas){
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 30, 30)
    camera.lookAt(0, 0, 0)
    
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis)
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);

    let loader = new GLTFLoader();

    loader.load('/shu1.gltf', function(gltf){

      // 方法1
      // scene.add(gltf.scene)

      // 方法2
      // let group = gltf.scene.children[0];
      console.log(gltf.scene);

      
      // scene.add(getInsMesh(gltf.scene.children[0].children[0]));
 
      // scene.add(getInsMesh(gltf.scene.children[0].children[1]));

      // 方法3
      
      // scene.add(getMergedMesh(gltf.scene.children[0].children[0]));
      scene.add(getMergedMesh(gltf.scene.children[0].children[1]));
      // scene.add(getMergedMesh1(gltf.scene.children[0].children, 0));
      // scene.add(getMergedMesh1(gltf.scene.children[0].children, 1));

      // 方法4
      // for(let i=0;i< gltf.scene.children[0].children.length;i+=2){


      //   scene.add(gltf.scene.children[0].children[i])
      // }
      // scene.add(gltf.scene.children[1])
      // scene.add(gltf.scene)
    })

    function getLod(meshList){
      const lod = new THREE.LOD();

      for(let item of meshList){
        lod.addLevel(item)
      }
      return lod;
    }

    function getMergedMesh1(children, index){
      console.log(children)
      let transform = new THREE.Object3D();
      let geometries = [];
      let material;
      for(let i=0;i<children.length;i+=6){
        let group = children[i];

        let innerMesh = group.children[index];

        let geometry = innerMesh.geometry.clone();

        transform.position.copy(innerMesh.position);
        transform.scale.copy(innerMesh.scale);

        transform.updateMatrix();
        geometry.applyMatrix4(transform.matrix);
        material = innerMesh.material;
        geometries.push(geometry);
        
      }
      // let material = mesh.material;
      // let total = shuData.length;
      // let transform = new THREE.Object3D();
      // for (let index = 0; index < total; index++) {
      //     let geometry = mesh.geometry.clone();
      //     let translation = shuData[index].translation;
      //     let scale = shuData[index].scale;
      //     transform.position.set(translation[0], translation[1], translation[2]);
      //     transform.scale.set(scale[0], scale[1], scale[2]);
      //     // transform.position.set(Math.random() * 2000, Math.random() * 2000, Math.random() * 2000);

      //     transform.updateMatrix();
      //     geometry.applyMatrix4(transform.matrix);
      //     geometries.push(geometry);
      // }
      let mergedGeometry = mergeBufferGeometries(geometries);
      let mergedMesh = new THREE.Mesh(mergedGeometry, material);
      return mergedMesh
    }
    function getMergedMesh(mesh){
      console.log(mesh,1, window.performance.memory)
      let geometries = [];
      let material = mesh.material;
      let total = shuData.length;
      let transform = new THREE.Object3D();
      for (let index = 0; index < total; index+=10) {
          let geometry = mesh.geometry.clone();
          let translation = shuData[index].translation;
          let scale = shuData[index].scale;
          transform.position.set(translation[0], translation[1], translation[2]);
          transform.scale.set(scale[0], scale[1], scale[2]);
          // transform.position.set(Math.random() * 2000, Math.random() * 2000, Math.random() * 2000);

          transform.updateMatrix();
          geometry.applyMatrix4(transform.matrix);
          geometries.push(geometry);

      }

      let mergedGeometry = mergeBufferGeometries(geometries);
      let mergedMesh = new THREE.Mesh(mergedGeometry, material);
      console.log(2, window.performance.memory, total)
      return mergedMesh

    }

    function getInsMesh(mesh){
      let insGeometry = mesh.geometry;
      let material = mesh.material;
      let total = shuData.length;
      //创建具有多个实例的实例化几何体
      let insMesh = new THREE.InstancedMesh(insGeometry, material, total);
      //修改位置
      let transform = new THREE.Object3D();
      for (let index = 0; index < total; index+=5) {
        let translation = shuData[index].translation;
        let scale = shuData[index].scale;
        transform.position.set(translation[0], translation[1], translation[2]);
        transform.scale.set(scale[0], scale[1], scale[2]);

        transform.updateMatrix();
        //修改实例化几何体中的单个实例的矩阵以改变大小、方向、位置等
        insMesh.setMatrixAt(index, transform.matrix);
      }
      return insMesh
    }
    

    let stats = new Stats()
    document.body.appendChild(stats.domElement)
    function render(){
      requestAnimationFrame(render)

      renderer.render(scene, camera)
      
      stats.update()
    }

    render()
  }

  focusTo(controls, camera, cameraPosition, targetPosition, duration){

    let d = duration || 1;

    gsap.to(controls.target, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: d,
      onUpdate(){
        controls.update()
      },
    })
    gsap.to(camera.position, {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,

      duration: d,
      onUpdate(){
        controls.update()
      },
    })
  }

  axisChange(renderer, canvas){
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 30, 30)
    camera.lookAt(0, 0, 0)
    
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis)
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);

    let infos = [
      { 
        position: [5, 5, 5],
        dom: document.getElementById('label')
      }
    ]

    let loader = new GLTFLoader();

    loader.load('/bdzzcjgd3.gltf', function(gltf){

      scene.add(gltf.scene)

    })
  

    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    function render(){
      requestAnimationFrame(render)

      renderer.render(scene, camera)
      for(let item of infos){

        const standardVec = new THREE.Vector3(item.position[0], item.position[1], item.position[2]).project(camera)

        const screenX = Math.round(centerX * standardVec.x + centerX);
        const screenY = Math.round(-centerY * standardVec.y + centerY);

        item.dom.style.left = screenX + 'px';
        item.dom.style.top = screenY + 'px';
      }
      
    }

    render()
  }
  CSS2DAnd3D(renderer, canvas){
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 30, 30)
    camera.lookAt(0, 0, 0)
    
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis)
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);
    let _this = this;

    let infos = [
      { 
        position: [-15, 5, -15],
        dom: document.getElementsByClassName('label')[0],
        onAddObject(item){
          let label = item.object;
          item.dom.addEventListener('pointerdown', function(){
            // _this.focusTo(controls, camera, new THREE.Vector3(label.position.x,label.position.y+10,label.position.z+10), label.position)
          })
          // 设置标签不可见
          // label.visible = false; 
        }
      },
      { 
        position: [15, 7, 15],
        dom: document.getElementsByClassName('label')[1]
      },
      { 
        position: [-15, 15, 15],
        dom: document.getElementsByClassName('label')[2]
      },
    ]


    // let loader = new GLTFLoader();

    // loader.load('/bdzzcjgd3.gltf', function(gltf){

    //   scene.add(gltf.scene)

    // })
  

    let labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    canvas.parentNode.appendChild( labelRenderer.domElement );

    this.createCSS3D(scene, infos)

    let controls1;

    let controls = new OrbitControls(camera, labelRenderer.domElement)
    controls.update();

    window.Controller = {
      startDrag(){
        // 1、关闭CSS3DRenderer
        labelRenderer.domElement.style.display = 'none'

        // 2、把所有标签替换成小方块，加进DragControls
        let objects = [];
        infos.forEach(item => {

          let mesh = new THREE.Mesh(new BoxGeometry(2,2,2), new THREE.MeshLambertMaterial({color: 0x0000ff}));
          mesh.position.copy(item.object.position)
          scene.add(mesh)

          objects.push(mesh);
          
          item.mesh = mesh;

          console.log(item.object);
        })
        controls1 = new DragControls( objects, camera, renderer.domElement );
        controls1.addEventListener('drag', render1)

        // 3、把OrbitControls的dom元素替换掉
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement)
        controls.update();

        // 4、避免两个控制器冲突
        controls1.addEventListener( 'dragstart', function ( event ) {

          controls.enabled=false;
          console.log('dragstart');
        
        } );
        
        controls1.addEventListener( 'dragend', function ( event ) {
        
          controls.enabled=true;
          console.log('dragend');
        
        } );


      },
      endDrag(){
        // 1、开启CSS3DRenderer
        labelRenderer.domElement.style.display = 'block'
        controls = new OrbitControls(camera, labelRenderer.domElement)
        controls.update();

        // 2、把所有小方块替换成标签
        infos.forEach(item => {

          item.object.position.copy(item.mesh.position)

          item.mesh.removeFromParent();
          
        })

        // 3、关闭拖拽控制器
        controls1.dispose();

        // 3、还原控制器
        controls.dispose();
        controls = new OrbitControls(camera, labelRenderer.domElement)
        controls.update();
      }
    }

    function render1(){
      
      renderer.render(scene, camera)
    }

    function render(){
      requestAnimationFrame(render)

      renderer.render(scene, camera)
      labelRenderer.render( scene, camera );

      
    }

    render()
  }
  // 创建3D标签
  // infos：Array<{dom:Object, position: Array<Integer>(3), callback: Function}>
  // return：Array<{dom:Object, position: Array<Integer>(3), callback: Function, object: CSS3DObject}>
  createCSS3D(scene, infos){
    let objects = []
    for(let item of infos){

      const label = new CSS3DObject(item.dom);
      label.position.set(item.position[0], item.position[1], item.position[2]);

      scene.add(label);

      // 缩小dom元素
      label.scale.x = 0.1;
      label.scale.y = 0.1;
      label.scale.z = 0.1;

      item.object = label;

      item.onAddObject && item.onAddObject(item);

      objects.push(label)

    }
    return infos;
  }


  animationPath(renderer, canvas){
    
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 30, 30)
    camera.lookAt(0, 0, 0)
    // 控制相机
    const controls = new OrbitControls(camera, canvas)
    controls.update()
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis)
    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);

    const box = new THREE.BoxGeometry(1,1,1)
    const boxMesh = new Mesh(box, 
      [new MeshLambertMaterial({color: 0x0000ff}), 
      new MeshLambertMaterial({color: 0xff00ff}),
      new MeshLambertMaterial({color: 0xddffff}),
      new MeshLambertMaterial({color: 0xddeeff}),
      new MeshLambertMaterial({color: 0x00fdff}),
      new MeshLambertMaterial({color: 0xcc00ff}),]
      )
    scene.add(boxMesh)

    let animation = this.createAnimationPath([
      [-5, -5, -5],
      [5, -3, -5],
      // [6, -3, 5],
      // [5, 5, 10],
      // [-5, 5, 10],
      // [-5, -5, -5],
    ], {
      mesh: boxMesh,
      speed: 2.5,
      isStraight: false,
    }, 
    {
      onFinish: function(){
        console.log('跑完一圈');
        // animation.stop();
      },
      onUpdate: _.throttle((mesh) => {
        // console.log('update',position);
  
      }, 800, {leading: true})
    }
    )
    animation.start();

    scene.add(animation.line)
    
    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)
      
    }

    render()
  }

  // 创建动画路径 API
  createAnimationPath(points, paramsOption, listener){
    const defOption = {
      speedSegment: 1000,  // 速度对应的分段数，范围是大于0
      speed:  1,  // 范围在0-segment之间，实际意义是每一帧跑多远
      mesh: null,
      isStraight: false,  // 是否是直线 
      divisions: 100,   // 路径对应的分段数
    }

    const option = Object.assign(defOption, paramsOption || {})

    let vec3Points = points.map(item => new THREE.Vector3(item[0], item[1], item[2]));

    // 1、绘制三维线条
    let curvePath = new THREE.CurvePath();
    if(option.isStraight){
      vec3Points.reduce((p1, p2) => {
        const lineCurve = new THREE.LineCurve3(p1, p2);
        curvePath.add(lineCurve)
        return p2
      });
    }else{
      curvePath.add(new THREE.CatmullRomCurve3(vec3Points))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints( curvePath.getPoints(option.divisions) );
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const line = new THREE.Line( geometry, material );

    // 2、获取每个分段数对应的时间点，每个时间点之间的间距是 option.speed
    const timeArray = []
    for(let i=0;i<option.speedSegment;i+=option.speed){
      timeArray.push(i/(option.speedSegment-1));
    }
    
    const targetPosition = new THREE.Vector3(); 
    const meshPosition = new THREE.Vector3(); 

    // 3、控制动画是否开始
    const obj = {
      line,
      isStarted: false,
      start(){
        this.isStarted = true;
        render();
      },
      stop(){
        this.isStarted = false;
      },
    }
    
    let index = 0;
    function render(){
      obj.isStarted && requestAnimationFrame(render)

      // 一圈运动结束
      if(index === timeArray.length-1){
        listener?.onFinish && listener.onFinish();
      }

      // 限制 index 范围
      index = index % (timeArray.length-1);

      // 获取当前时间段的 路径 坐标
      curvePath.getPointAt(timeArray[index], meshPosition)
      option.mesh.position.set(meshPosition.x, meshPosition.y, meshPosition.z)

      // 获取 路径 前一点坐标
      curvePath.getPointAt(timeArray[index+1], targetPosition)
      option.mesh.lookAt(targetPosition.x, targetPosition.y, targetPosition.z)

      listener?.onUpdate && listener?.onUpdate(option.mesh)

      index++;
    }

    return obj;
    
  }

  // 创建围栏 API
  createFence(points, paramsOption, callback){

    const defOption = {
      height: 10,
      bgColor: '#00FF00',
      warnColor: '#FF0000',
      lineColor: '#FFFF00',
      segment: 1.5,  // 线条密度，实际意义是线条之间的间距
      maxOpacity: 1,  // 最大透明度
      meshList: [],  // 要闯入围栏的物体列表
      duration: 2000
    }

    const option = Object.assign(defOption, paramsOption)

    const height = option.height;
    const translateY = {
      value: 0
    }

    const group = new THREE.Group();
    const planeBoxMap = {};
    const meshBoxMap = {};

    // 给要闯入围栏的物体加包围盒
    for(let item of option.meshList){
      let box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      box.setFromObject(item);
      meshBoxMap[item.uuid] = {box: box, mesh: item};
    }

    let vec3Points = points.map(item => new THREE.Vector3(item[0], item[1], item[2]));

    vec3Points.reduce((p1, p2) => {

      const geometry = new THREE.BufferGeometry();
      // 创建一个简单的矩形. 在这里我们右上和左下顶点被复制了两次。
      // 因为在两个三角面片里，这两个顶点都需要被用到。
      const vertices = new Float32Array( [
        p1.x, p1.y+height, p1.z, // 左上角
        p1.x, p1.y, p1.z,  // 左下角
        p2.x, p2.y+height, p2.z,  // 右上角
      
        p2.x, p2.y+height, p2.z,  // 右上角
        p1.x, p1.y, p1.z, // 左下角
        p2.x, p2.y, p2.z  // 右下角
      ] );

      const points = new Float32Array([
        p1.x, p1.y,p1.z,
        p1.x, p1.y,p1.z,
        p2.x, p2.y,p2.z,
        p2.x, p2.y,p2.z,
        p1.x, p1.y,p1.z,
        p2.x, p2.y,p2.z,
      ])
      
      // itemSize = 3 因为每个顶点都是一个三元组。
      geometry.setAttribute( 'myposition', new THREE.BufferAttribute( points, 3 ) );
      geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
      const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

      const shader = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uColor: {
            value: new THREE.Color(option.bgColor)
          },
          uColor1: {
            value: new THREE.Color(option.lineColor)
          },
          uSize: {
            value: 10, 
          },
          maxOpacity: {
            value: +option.maxOpacity.toFixed(1)
          },
          height: {
            value: +option.height.toFixed(1)
          },
          segment: {  
            value: +option.segment.toFixed(1)
          },
          translateY
        },
        vertexShader: `
          attribute vec3 myposition;
          uniform float uSize;
          varying float positionY;
          varying float startPositionY;
          void main(){
            float size = uSize;

            startPositionY = myposition.y;
  
            positionY = position.y;
  
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            //大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
          }
          
        `,
        fragmentShader: `
          uniform float translateY;
          uniform float segment;
          uniform vec3 uColor;
          uniform vec3 uColor1;
          uniform float height; 
          uniform float maxOpacity; 
          varying float positionY;
          varying float startPositionY;
          void main(){
  
            float vOpacity = -positionY * (maxOpacity / height) + maxOpacity * (1.0+(startPositionY/height));

            float cur = mod((positionY-startPositionY+translateY) / segment, 1.0);
  
            if(cur > 0.0 && cur < 0.2){
              float opacity;
  
              if(cur < 0.1){
                opacity = 10.0 * cur;
              }else{
                opacity = -10.0 * cur + 2.0;
              }
              vec3 color = mix(uColor, uColor1, opacity);
              gl_FragColor = vec4(color, vOpacity);
            }else{
              gl_FragColor = vec4(uColor, vOpacity);
            }
          }
        `
      });
      const mesh = new THREE.Mesh( geometry, shader );
      group.add(mesh);

      let triangle1 = new THREE.Triangle(
        new THREE.Vector3(p1.x, p1.y+height, p1.z),
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y+height, p2.z),
      );
      let triangle2 = new THREE.Triangle(
        new THREE.Vector3(p2.x, p2.y+height, p2.z),
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z),
      );

      planeBoxMap[mesh.uuid] = {mesh, triangle1, triangle2};

      return p2;
    });

    // 恢复
    const reset = _.throttle((plane, mesh)=> {
      plane.mesh.material.uniforms.uColor.value = new THREE.Color(option.bgColor);
    }, option.duration, {leading: false, trailing: true})

    // 告警
    const warn = _.debounce((plane, mesh) => {
      plane.mesh.material.uniforms.uColor.value = new THREE.Color(option.warnColor);
      callback(mesh.mesh, plane.mesh)

      // plane.timer && clearTimeout(plane.timer)
      // plane.timer = setTimeout(function(){
      //   plane.mesh.material.uniforms.uColor.value = new THREE.Color(option.bgColor);
      // }, option.duration)
    }, 150, {leading: true})
    
    function animation(){
      translateY.value -= 0.02;
      requestAnimationFrame(animation);

      for(let meshKey in meshBoxMap){
        meshBoxMap[meshKey].box.setFromObject(meshBoxMap[meshKey].mesh)
      }

      for(let planeKey in planeBoxMap){
        for(let meshKey in meshBoxMap){
          const plane = planeBoxMap[planeKey],
                mesh = meshBoxMap[meshKey];
          if(plane.triangle1.intersectsBox(mesh.box) || plane.triangle2.intersectsBox(mesh.box)){
            warn(plane, mesh);
          }else{
            plane.mesh.material.uniforms.uColor.value = new THREE.Color(option.bgColor);
          }
        }
      }
    }
    animation();

    return group;

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
          height = 10;    // 圈圈之间的间隔高度

    const attrCindex = [];

    for(let i=0;i<height;i++){
      attrCindex.push(i/(height-1));
    }

    const geometry = new THREE.PlaneGeometry( width, height );
    geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1));

    const box = new THREE.BoxGeometry(1,1,1)
    const boxMesh = new Mesh(box, new MeshLambertMaterial({color: 0x0000ff}))
    scene.add(boxMesh)

    boxMesh.position.z = 8;

    gsap.to(boxMesh.position, {
      z: -1,
      duration: 5,
      repeat: -1,
      yoyo: true, 
      onUpdate: () => {
      }
    })

    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);

    let group = this.createFence([
      // [-6,-1],
      [5,-1, -1],
      [5,4, 1],
      [-6,-1,6],
    ], { 
      height: 10, 
      meshList: [boxMesh],
      startHeight: -5, 
      maxOpacity: 1, 
      
      bgColor: '#00FF00',
      warnColor: '#FF0000',
      lineColor: '#FFFF00',
      segment: 4,  // 线条密度
      duration: 1000,
    },
    function(mesh){
      // console.log('碰撞了');
    });
    scene.add(group)

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

  handleClick(){
    console.log('click 1');
  }
  render() {
    return (
      <div  style={{ width: '100%', height: '100%' }}>
        <canvas id="c2d" style={{ width: '100%', height: '100%' }}>

        </canvas>

        <div className="label" draggable={true} style={{    
          width: '100px',
          height: '50px',
          position: 'absolute',
          background: 'antiquewhite'}}
          onMouseDown={this.handleClick}>
            
          这是标签
        </div>
        <div className="label" draggable={true} style={{    
          width: '100px',
          height: '50px',
          position: 'absolute',
          background: 'antiquewhite'}}
          onMouseDown={this.handleClick}>
            
          这是标签
        </div>
        <div className="label" draggable={true} style={{    
          width: '100px',
          height: '50px',
          position: 'absolute',
          background: 'antiquewhite'}}
          onMouseDown={this.handleClick}>
            
          这是标签
        </div>

      </div>
    )
  }
}