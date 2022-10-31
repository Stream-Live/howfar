/*
 * @Author: Wjh
 * @Date: 2022-09-26 13:03:36
 * @LastEditors: Wjh
 * @LastEditTime: 2022-10-25 16:42:52
 * @FilePath: \howfar\src\MainPage\ShaderStudy2.js
 * @Description:
 *
 */
import React from "react";
import * as THREE from "three";
import { BufferGeometry, Mesh, Scene, ShaderMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import TWEEN from "tween.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import g, { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import * as Nodes from 'three/nodes';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';

import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';
import { MeshLambertMaterial } from "three";

export default class ShaderStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });
    document.getElementById("box").appendChild(renderer.domElement);

    // 开启Hidpi设置
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // this.loadAnimation(renderer);
    // this.cloud(renderer);
    // this.transition(renderer);

    // this.bloom(renderer)
    // this.technologe_sity(renderer)
    this.rain(renderer)
    window.THREE = THREE;

    // this.temperature(renderer); // 设置设备温度
    // this.virtual(renderer); // 虚化
    // this.mouse_bloom(renderer); // 鼠标悬浮发光
    // this.fire1(renderer); // 火1

    // this.water(renderer)
    this.computedWater(renderer)
  }

  computedWater(renderer, paramsOption){
    
    let { scene, camera, controls } = this.loadBasic(renderer);
    camera.position.set(0,4,15)
    controls.update();

    const defOption = {
      length: 8,  // 水柱的长度
      width: 3,   // 底部矩形的宽
      height: 4,  // 底部矩形的高
      widthSegment: 5,  // 底部矩形的宽度分段数
      heightSegment: 5, // 底部矩形的高度分段数
      color: 0xffffff,  // 水柱颜色
      opacity: 0.8,     // 水柱的透明度
      dashSize: 0.2,    // 每段虚线的长度
      gapSize: 0.1,     // 每段虚线的间隔
      speed: 0.02,      // 虚线移动的速度，实际意义是每一帧移动的距离
    }
  
    const option = Object.assign(defOption, paramsOption || {})

    let plane = new THREE.Mesh(
      new THREE.PlaneGeometry(option.width, option.height, option.widthSegment,option.heightSegment), 
      new MeshLambertMaterial({
        color: 0x0000ff,
        wireframe: true,
      })
    ); 
    plane.rotateX(Math.PI * 0.5);
    plane.position.x = 8;
    plane.updateMatrixWorld();

    let points = [];
    let array = plane.geometry.getAttribute('position').array
    for(let i=0; i< array.length; i+= 3){
      let p = new THREE.Vector3(array[i], array[i+1], array[i+2]);
      p.applyMatrix4(plane.matrixWorld)
      points.push(p)
    }

    scene.add(plane);

    let material = new THREE.LineDashedMaterial({
      color: option.color, 
      dashSize: option.dashSize, 
      gapSize: option.gapSize, 
      transparent: true, 
      opacity: option.opacity,
    });
    let _shader;
    material.onBeforeCompile = shader => {
      _shader = shader;

      shader.uniforms.time = {
        value: 0
      }
      const vertex = `
        uniform float time;
        void main() {
      `
      const vertexShader = `
        vLineDistance = scale * lineDistance + time;
      `
      shader.vertexShader = shader.vertexShader.replace('void main() {', vertex)
      shader.vertexShader = shader.vertexShader.replace('vLineDistance = scale * lineDistance', vertexShader)
    }

    const group = new THREE.Group();

    const start = new THREE.Vector3(0,7,0);

    for(let end of points){

      let d1 = start,
          d2 = new THREE.Vector3((start.x + end.x) / 2,start.y, (start.z + end.z) / 2),
          d3 = new THREE.Vector3(end.x, (start.y + end.y) / 2, end.z),
          d4 = end;

      let line = new THREE.CubicBezierCurve3(d1, d2, d3, d4);

      const linePoints = line.getPoints(50);
      const curveObject = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePoints),
        material
      )
      curveObject.computeLineDistances();
      group.add(curveObject)
    }
    scene.add(group);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      if(_shader)
        _shader.uniforms.time.value -= option.speed;
    }

    render();
  }

  water(renderer){

    let { scene, camera, controls } = this.loadBasic(renderer);

    let material = new THREE.LineDashedMaterial({color: 0xffffff, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.5});
    let _shader;
    material.onBeforeCompile = shader => {
      console.log(shader);
      _shader = shader;

      shader.uniforms.time = {
        value: 0
      }

      const vertex = `
        uniform float time;
        void main() {
      `
      const vertexShader = `
        vLineDistance = scale * lineDistance + time;
      `

      shader.vertexShader = shader.vertexShader.replace('void main() {', vertex)
      shader.vertexShader = shader.vertexShader.replace('vLineDistance = scale * lineDistance', vertexShader)
    }

    
    const points = [
      // 第一排
      [0, 6, 0],
      [1, 6, 0],
      [2, 5, 0],
      [2, 4, 0],

      [0, 6, 0],
      [2, 6, 0],
      [3, 5, 0],
      [3, 4, 0],
      
      [0, 6, 0],
      [1, 6, 0.2],
      [2, 5, 0.5],
      [2, 4, 0.5],
      // 第二排
      [0, 6, 0],
      [1.5, 6, 0],
      [2.5, 5, 0],
      [2.5, 4, 0],

      [0, 6, 0],
      [1.5, 6, 0.4],
      [2.5, 5, 0.6],
      [2.5, 4, 0.6],
      
      [0, 6, 0],
      [1.5, 6, 0.8],
      [2.5, 5, 1],
      [2.5, 4, 1],
      // 第三排
      [0, 6, 0],
      [2, 6, 0.3],
      [3, 5, 0.6],
      [3, 4, 0.6],

      [0, 6, 0],
      [1, 6, 0.8],
      [2, 5, 1],
      [2, 4, 1],
      
      [0, 6, 0],
      [2, 6, 1],
      [3, 5, 1.2],
      [3, 4, 1.2],
    ]

    for(let i=0; i< points.length; i+=4){

      let p1 = new THREE.Vector3(points[i][0], points[i][1], points[i][2]);
      let p2 = new THREE.Vector3(points[i+1][0], points[i+1][1], points[i+1][2]);
      let p3 = new THREE.Vector3(points[i+2][0], points[i+2][1], points[i+2][2]);
      let p4 = new THREE.Vector3(points[i+3][0], points[i+3][1], points[i+3][2]);
      const spline = new THREE.CubicBezierCurve3( p1, p2, p3, p4);
  
      const samples = spline.getPoints( 50 );
      const geometrySpline = new THREE.BufferGeometry().setFromPoints( samples );
  
      let mesh = new THREE.Line(geometrySpline, material)
      mesh.computeLineDistances();

      scene.add(mesh)
    }
   

    
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      if(_shader)
        _shader.uniforms.time.value -= 0.02
    }

    render();
  }

  fire1(renderer){

    let { scene, camera, controls } = this.loadBasic(renderer);

    let stats;

    init();
    animate();

    function init() {

      camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
      camera.position.x = 0;
      camera.position.y = 100;
      camera.position.z = - 300;

      // scene = new THREE.Scene();
      // scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

      // geometries

      const teapotGeometry = new THREE.BoxGeometry( 20,20,20, 1, 10, 10, 10 );
      const sphereGeometry = new THREE.SphereGeometry( 100, 130, 16 );

      const geometry = new THREE.BufferGeometry();

      // buffers

      const speed = [];
      const intensity = [];
      const size = [];

      const positionAttribute = teapotGeometry.getAttribute( 'position' );
      const particleCount = positionAttribute.count;

      for ( let i = 0; i < particleCount; i ++ ) {

        speed.push( 20 + Math.random() * 50 );

        intensity.push( Math.random() * .15 );

        size.push( 30 + Math.random() * 230 );

      }

      geometry.setAttribute( 'position', positionAttribute );
      geometry.setAttribute( 'targetPosition', sphereGeometry.getAttribute( 'position' ) );
      geometry.setAttribute( 'particleSpeed', new THREE.Float32BufferAttribute( speed, 1 ) );
      geometry.setAttribute( 'particleIntensity', new THREE.Float32BufferAttribute( intensity, 1 ) );
      geometry.setAttribute( 'particleSize', new THREE.Float32BufferAttribute( size, 1 ) );

      // maps

      // Forked from: https://answers.unrealengine.com/questions/143267/emergency-need-help-with-fire-fx-weird-loop.html

      const fireMap = new THREE.TextureLoader().load( 'textures/sprites/firetorch_1.jpg' );

      // nodes

      const targetPosition = new Nodes.AttributeNode( 'targetPosition', 'vec3' );
      const particleSpeed = new Nodes.AttributeNode( 'particleSpeed', 'float' );
      const particleIntensity = new Nodes.AttributeNode( 'particleIntensity', 'float' );
      const particleSize = new Nodes.AttributeNode( 'particleSize', 'float' );

      const time = new Nodes.TimerNode();

      const spriteSheetCount = new Nodes.ConstNode( new THREE.Vector2( 6, 6 ) );

      const fireUV = new Nodes.SpriteSheetUVNode(
        spriteSheetCount, // count
        new Nodes.PointUVNode(), // uv
        new Nodes.OperatorNode( '*', time, particleSpeed ) // current frame
      );

      const fireSprite = new Nodes.TextureNode( fireMap, fireUV );
      const fire = new Nodes.OperatorNode( '*', fireSprite, particleIntensity );

      const lerpPosition = new Nodes.UniformNode( 0 );

      const positionNode = new Nodes.MathNode( Nodes.MathNode.MIX, new Nodes.PositionNode( Nodes.PositionNode.LOCAL ), targetPosition, lerpPosition );

      // material

      const material = new Nodes.PointsNodeMaterial( {
        depthWrite: false,
        transparent: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      } );

      material.colorNode = fire;
      material.sizeNode = particleSize;
      material.positionNode = positionNode;

      const particles = new THREE.Points( geometry, material );
      scene.add( particles );

      // stats

      stats = new Stats();
      document.body.appendChild( stats.dom );

      // gui

      const gui = new GUI();
      const guiNode = { lerpPosition: 0 };

      gui.add( material, 'sizeAttenuation' ).onChange( function () {

        material.needsUpdate = true;

      } );

      gui.add( guiNode, 'lerpPosition', 0, 1 ).onChange( function () {

        lerpPosition.value = guiNode.lerpPosition;

      } );

      gui.open();

      // controls

      const controls = new OrbitControls( camera, renderer.domElement );
      controls.maxDistance = 1000;
      controls.update();

      // events

      window.addEventListener( 'resize', onWindowResize );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    //

    function animate() {

      requestAnimationFrame( animate );

      render();
      stats.update();

    }

    function render() {

      nodeFrame.update();

      renderer.render( scene, camera );

    }

  }

  mouse_bloom(renderer){
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(50, 50, 60);
    controls.update();
    controls.addEventListener( 'change', render );

    let light = new THREE.PointLight(0xffffff);
    light.position.y = 200;
    scene.add(light);
    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let children = [];
    loader.load(
      "/tashan.glb",
      function (gltf) {
        scene.add(gltf.scene);
        // 虚化
        // gltf.scene.children.forEach(item => {
        //   if(!['主体1', '主体2', '屋顶1', '屋顶2'].includes(item.name)){
        //     children.push(item)
        //   }
        // });

        // scene.getObjectByName('主体1').visible = false;
        // scene.getObjectByName('主体2').visible = false;
        // scene.getObjectByName('屋顶1').visible = false;
        // scene.getObjectByName('屋顶2').visible = false;

        render();

      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    // const pmremGenerator = new THREE.PMREMGenerator(renderer);
    // pmremGenerator.compileEquirectangularShader();
    // new RGBELoader().load(
    //   '/hdr/dikhololo_night_1k.hdr',
    //   (texture) => {
    //     const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    //     pmremGenerator.dispose();
    //     scene.environment = envMap;
    //   },
    //   undefined
    // );

    const params = {
      exposure: 1.2,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0.5,
      scene: 'Scene with Glow'
    };
    renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

    const ENTIRE_SCENE = 1, BLOOM_SCENE = 2;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const darkMaterial = new THREE.MeshBasicMaterial({color: 'black'})
    const materials = {};
    renderer.toneMapping = THREE.ReinhardToneMapping;

    const renderScene = new RenderPass(scene, camera)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(renderer)
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)

    const finalPass = new ShaderPass(new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null},
        bloomTexture: { value: bloomComposer.renderTarget2.texture}
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main(){
          gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
        }
      `,
    }), 'baseTexture')
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer)
    finalComposer.addPass(renderScene)
    finalComposer.addPass(finalPass)

    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2();

    // window.addEventListener('pointerdown', onPointerDown)

    setupScene();

    function onPointerDown(event){

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(children, true)
      if(intersects.length > 0){

        const object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE)
        render();
        console.log('点击了', object);
      }
    }

    function setupScene(){

      scene.traverse(disposeMaterial);
      
      render();

    }

    function render() {
      
      renderBloom(true);

      finalComposer.render();
    }

    function disposeMaterial(obj){
      if(obj.material){
        obj.material.dispose();
      }
    }

    function renderBloom(mask){

      if(mask){

        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);

      }else{

        camera.layers.set(BLOOM_SCENE);
        bloomComposer.render();
        camera.layers.set(ENTIRE_SCENE);
      }
    }

    function darkenNonBloomed(obj){

      if(obj.isMesh && bloomLayer.test(obj.layers) === false){

        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    }
    function restoreMaterial(obj){

      if(materials[obj.uuid]){
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    }

    render();
  }

  virtual(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(50, 50, 60);
    controls.update();

    let light = new THREE.PointLight(0xffffff);
    light.position.y = 200;
    scene.add(light);
    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/tashan.glb",
      function (gltf) {
        scene.add(gltf.scene);

        // scene.getObjectByName('屋顶1').visible = false;
        // scene.getObjectByName('主体1').visible = false;

        scene.getObjectByName('主体1').visible = false;
        scene.getObjectByName('主体2').visible = false;
        scene.getObjectByName('屋顶1').visible = false;
        scene.getObjectByName('屋顶2').visible = false;

        scene.getObjectByName('10kv\\35kv开关室').traverse( mesh => {

          if(mesh.isMesh){
            changeMat(mesh, true)
          }
        })
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
    // loader.load(
    //   "/tree.glb",
    //   function (gltf) {
    //     scene.add(gltf.scene);
        
    //     gltf.scene.traverse( mesh => {

    //       if(mesh.isMesh){
    //         changeMat(mesh)
    //       }
    //     })
    //   },
    //   // called while loading is progressing
    //   function (xhr) {
    //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //   },
    //   // called when loading has errors
    //   function (error) {
    //     console.log("An error happened");
    //   }
    // );
    let matObj = {};
    let lineGroup = new THREE.Group();
    scene.add(lineGroup);

    function changeMat(mesh, isVirtual, isAfter){
      // mesh.visible = false;

      mesh.geometry.computeBoundingBox();


      let { min, max } = mesh.geometry.boundingBox;
      let height = max.y - min.y;

      mesh.material.transparent = true;

      if(isAfter){

        for(let key in matObj){
          matObj[key].uniforms.isVirtual.value = isVirtual
        }
        lineGroup.visible = isVirtual;
        mesh.material.needsUpdate = true;
        return
      }
      mesh.material = mesh.material.clone();
      mesh.material.onBeforeCompile = shader => {
        matObj[mesh.material.uuid] = shader
        Object.assign(shader.uniforms, {
          uHeight: {
            value: height
          },
          uColor: {
            value: new THREE.Color('#00ffff')
          },
          maxOpacity:{
            value: 0.6
          },
          isVirtual: {
            value: true,
          },
          minY: {
            value: min.y
          },
          maxY: {
            value: max.y
          },
        }) 
        
        const vertex = `
          varying vec3 vPosition;
          void main() {
            vPosition = position;`
        const fragment = `
          uniform float uHeight;
          uniform vec3 uColor;
          uniform float maxOpacity;
          uniform float minY;
          uniform float maxY;
          uniform bool isVirtual;
          varying vec3 vPosition;
          void main() {`
        const fragmentColor = `
          float dist = 1.0 - ((vPosition.y-minY) / uHeight);
          if(isVirtual){
            gl_FragColor = vec4(uColor, dist * maxOpacity);
          }
        }`

        shader.vertexShader = shader.vertexShader.replace(`void main() {`, vertex)
        shader.fragmentShader = shader.fragmentShader.replace(`void main() {`, fragment)
        shader.fragmentShader = shader.fragmentShader.replace(`}`, fragmentColor)
       
      }
      if(!isVirtual) return
      let geometry = new THREE.EdgesGeometry(mesh.geometry);

      let shader = new THREE.ShaderMaterial({
        uniforms: {
          vColor: {
            value: new THREE.Color('#00ffff')
          }
        },
        transparent: true,
        vertexShader: `
          void main() {

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
          }
        `,
        fragmentShader: `
          uniform vec3 vColor;
          void main(){
            gl_FragColor = vec4(vColor, 0.5);
          }
        `
      })

      let seg = new THREE.LineSegments(geometry, shader);

      // 获取物体的世界坐标 旋转等
      const worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);

      seg.position.copy(worldPosition)

      lineGroup.add(seg);
    }

    window.changeMat = changeMat
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  rain(renderer) {
    // renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(50, 50, 60);
    controls.update();

    let light = new THREE.PointLight(0xffffff);
    light.position.y = 200;
    scene.add(light);

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    // scene.add(box);
    box.geometry.computeBoundingBox();

    let { min, max } = box.geometry.boundingBox;

    let d = 1;

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    const group = new THREE.Group();
    for (let i = 0; i < 1000; i++) {
      const pos = new THREE.Vector3();
      pos.x = Math.random() * (max.x - min.x + 1) + min.x;
      pos.y = Math.random() * (max.y - min.y + 1) + min.y;
      pos.z = Math.random() * (max.z - min.z + 1) + min.z;

      const points = [];
      points.push(pos);
      points.push(new THREE.Vector3(pos.x, pos.y + d, pos.z));
      let g = new THREE.BufferGeometry().setFromPoints(points);
      let mesh = new THREE.Line(g, lineMat);
      mesh.name = "line_" + i;
      // scene.add(mesh);
      group.add(mesh);
    }

    const h = new THREE.BoxHelper(group);
    scene.add(h);

    group.children.forEach(_mesh => {
      
      let delta = Math.random() * (max.y - min.y + 1) + min.y;
      if(Math.random() > 0.5) _mesh.position.y += delta;
      else _mesh.position.y -= delta;
    })
    
    console.log(group);
    // scene.add(group);

    let maxSpeed = 1, minSpeed = 0.2
    function move() {
      group.children.forEach((_mesh, index) => {

        _mesh.position.y -= Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
        if (_mesh.position.y < min.y) {
          _mesh.position.y = max.y;
        }
      });
    }

    let obj = this.createRain(100, 100, 100);

    scene.add(obj.group);
    obj.start();


    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  /**
   * @description: 创建雨
   * @param {*} width   立方体雨的宽
   * @param {*} height  立方体雨的高
   * @param {*} depth   立方体雨的深
   * @param {*} paramsOption
   * @return {*}
   */  
  createRain(width, height, depth, paramsOption){

    const defOption = {
      maxSpeed: 1.5,  // 雨滴下落最大速度
      minSpeed: 0.2,  // 雨滴下落最小速度 
      length: 1,     // 每个雨滴的长度
    }
  
    const option = Object.assign(defOption, paramsOption || {})
  
    let box = new THREE.Mesh(
      new THREE.BoxGeometry(width, height/2, depth),
      new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
  
    box.geometry.computeBoundingBox();
  
    let { min, max } = box.geometry.boundingBox;
  
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    const group = new THREE.Group();
    for (let i = 0; i < 1000; i++) {
      const pos = new THREE.Vector3();
      pos.x = Math.random() * (max.x - min.x + 1) + min.x;
      pos.y = Math.random() * (max.y - min.y + 1) + min.y;
      pos.z = Math.random() * (max.z - min.z + 1) + min.z;
  
      const points = [];
      points.push(pos);
      points.push(new THREE.Vector3(pos.x, pos.y + option.length, pos.z));
      let g = new THREE.BufferGeometry().setFromPoints(points);
      let mesh = new THREE.Line(g, lineMat);
      mesh.name = "line_" + i;
      group.add(mesh);
    }
  
    group.children.forEach(_mesh => {
      
      let delta = Math.random() * (max.y - min.y + 1) + min.y;
      if(Math.random() > 0.5) _mesh.position.y += delta;
      else _mesh.position.y -= delta;
    })
  
    const obj = {
      group,
      isStarted: false,
      start(){
        this.isStarted = true;
        render();
      },
      stop(){
        this.isStarted = false;
      },
    }
  
    function render(){
      obj.isStarted && requestAnimationFrame(render);
  
      group.children.forEach((_mesh, index) => {
  
        _mesh.position.y -= Math.random() * (option.maxSpeed - option.minSpeed + 1) + option.minSpeed;
        if (_mesh.position.y < min.y) {
          _mesh.position.y = max.y;
        }
      });
    }
    return obj;
  }

  temperature(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(50, 50, 60);
    controls.update();

    let light = new THREE.PointLight(0xffffff);
    light.position.y = 200;
    scene.add(light);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/tashan.glb",
      function (gltf) {
        scene.add(gltf.scene.getObjectByName("10kv\\35kv开关室"));

        scene.getObjectByName("#3主变10kv开关").traverse((mesh) => {
          if (mesh.material) {
            mesh.material = mesh.material.clone();
            mesh.material.onBeforeCompile = (shader) => {
              const fragmentColor = `
                gl_FragColor.x = 0.3;}
              `;
              shader.fragmentShader = shader.fragmentShader.replace(
                "}",
                fragmentColor
              );
            };
          }
          // mesh?
        });
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  technologe_sity(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(
      1864.2980461117584,
      806.6782979561754,
      -210.71294706606588
    );
    controls.update();

    let light = new THREE.PointLight(0xffffff);
    light.position.y = 800;
    scene.add(light);

    new FBXLoader().load("/shanghai.FBX", (group) => {
      scene.add(group);

      addShader();
    });

    function addShader() {
      let city = scene.getObjectByName("CITY_UNTRIANGULATED");

      city.geometry.computeBoundingBox();

      let { min, max } = city.geometry.boundingBox;
      let size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
      const material = city.material;

      material.transparent = true;
      material.color.setStyle("#1B3045");
      console.log(material);

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uSize = {
          value: size,
        };
        shader.uniforms.uTopColor = {
          value: new THREE.Color("#FFFFDC"),
        };
        const vertex = `
          varying vec3 vPosition;
          void main(){
            vPosition = position;
        `;

        const fragment = `
            varying vec3 vPosition;
            uniform vec3 uTopColor;
            uniform vec3 uSize;
            void main(){
        `;
        const fragmentColor = `
            vec3 distColor = outgoingLight;
            float indexMix = vPosition.z / (uSize.z * 0.6);
            distColor = mix(distColor, uTopColor, indexMix);
            gl_FragColor = vec4(distColor, 1.0);}
        `;

        shader.fragmentShader = shader.fragmentShader.replace(
          "void main() {",
          fragment
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "}",
          fragmentColor
        );
        shader.vertexShader = shader.vertexShader.replace(
          "void main() {",
          vertex
        );

        console.log(shader);
      };
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  bloom(renderer) {
    // renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let { scene, camera, controls } = this.loadBasic(renderer);
    camera.position.set(
      97.63992972765156,
      661.5331147526151,
      1719.1682731434032
    );
    controls.update();

    let light = new THREE.PointLight(0xffffff, 9.5);
    light.position.set(-278, 1949, -1000);
    scene.add(light);

    // 效果合成器
    const composer = new EffectComposer(renderer);

    const params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0,
    };

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/model-no-remarks.glb",
      function (gltf) {
        scene.add(gltf.scene);

        addBloom(gltf.scene);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    function addBloom(group) {
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass); // 将传入的过程添加到过程链

      const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
      );
      outlinePass.visibleEdgeColor.set(0x73d7f2);

      composer.addPass(outlinePass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      // bloomPass.threshold = params.bloomThreshold;
      // bloomPass.strength = params.bloomStrength;
      // bloomPass.radius = params.bloomRadius;
      composer.addPass(bloomPass);

      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: composer.renderTarget2.texture },
          },
          vertexShader: `varying vec2 vUv;

          void main() {
    
            vUv = uv;
    
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
          }`,
          fragmentShader: `uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
    
          varying vec2 vUv;
    
          void main() {
    
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
    
          }`,
          defines: {},
        }),
        "baseTexture"
      );
      finalPass.needsSwap = true;
      // composer.addPass(finalPass);

      const edge = scene.getObjectByName("map-材质");

      edge.material = new THREE.ShaderMaterial({
        uniforms: {
          height: {
            value: edge.position.y,
          },
          color1: {
            value: new THREE.Color("#395C6F"),
          },
          color2: {
            value: new THREE.Color("#73D7F2"),
          },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float height;
          varying vec2 vUv;
          void main(){
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            
          }
        `,
      });

      outlinePass.selectedObjects = [edge];

      const gui = new GUI();

      gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
        renderer.toneMappingExposure = Math.pow(value, 4.0);
      });

      gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
        bloomPass.threshold = Number(value);
      });

      gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
        bloomPass.strength = Number(value);
      });

      gui
        .add(params, "bloomRadius", 0.0, 1.0)
        .step(0.01)
        .onChange(function (value) {
          bloomPass.radius = Number(value);
        });
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      composer.render();
    }

    render();
  }

  transition(renderer) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let { scene, camera } = this.loadBasic(renderer);

    const transitionParams = {
      useTexture: true,
      transition: 0,
      texture: 5,
      cycle: true,
      animate: true,
      threshold: 0.3,
    };
    const clock = new THREE.Clock();

    let _this = this;

    const sceneA = new createScene(0x0000ff, 0x00ffff);
    const sceneB = new createScene(0xffff00, 0xffffff);

    console.log(sceneA, sceneB);

    const transition = new createTransition(sceneA, sceneB);

    animate();

    function animate() {
      requestAnimationFrame(animate);

      transition.render(clock.getDelta());
    }

    function createTransition(sceneA, sceneB) {
      let { scene, camera } = _this.loadBasic(renderer);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse1: {
            value: null,
          },
          tDiffuse2: {
            value: null,
          },
          mixRatio: {
            value: 0.0,
          },
          threshold: {
            value: 0.1,
          },
          useTexture: {
            value: 1,
          },
        },
        vertexShader: [
          "varying vec2 vUv;",

          "void main() {",

          "vUv = vec2( uv.x, uv.y );",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

          "}",
        ].join("\n"),
        fragmentShader: [
          "uniform float mixRatio;",

          "uniform sampler2D tDiffuse1;",
          "uniform sampler2D tDiffuse2;",

          "uniform int useTexture;",
          "uniform float threshold;",

          "varying vec2 vUv;",

          "void main() {",

          "	vec4 texel1 = texture2D( tDiffuse1, vUv );",
          "	vec4 texel2 = texture2D( tDiffuse2, vUv );",

          "	gl_FragColor = mix( texel2, texel1, mixRatio );",

          "}",
        ].join("\n"),
      });

      const geometry = new THREE.PlaneGeometry(
        window.innerWidth,
        window.innerHeight
      );
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
      material.uniforms.tDiffuse2.value = sceneB.fbo.texture;

      new TWEEN.Tween(transitionParams)
        .to({ transition: 1 }, 1500)
        .repeat(Infinity)
        .delay(2000)
        .yoyo(true)
        .start();

      this.needsTextureChange = false;

      this.render = function (delta) {
        // Transition animation
        if (transitionParams.animate) {
          TWEEN.update();

          // Change the current alpha texture after each transition
          if (transitionParams.cycle) {
            if (
              transitionParams.transition == 0 ||
              transitionParams.transition == 1
            ) {
              // if ( this.needsTextureChange ) {
              //   transitionParams.texture = ( transitionParams.texture + 1 ) % textures.length;
              //   material.uniforms.tMixTexture.value = textures[ transitionParams.texture ];
              //   this.needsTextureChange = false;
              // }
            } else {
              this.needsTextureChange = true;
            }
          } else {
            this.needsTextureChange = true;
          }
        }

        material.uniforms.mixRatio.value = transitionParams.transition;

        // Prevent render both scenes when it's not necessary
        if (transitionParams.transition == 0) {
          sceneB.render(delta, false);
        } else if (transitionParams.transition == 1) {
          sceneA.render(delta, false);
        } else {
          // When 0<transition<1 render transition between two scenes

          sceneA.render(delta, true);
          sceneB.render(delta, true);

          renderer.setRenderTarget(null);
          renderer.clear();
          renderer.render(scene, camera);
        }
      };
    }

    function createScene(boxColor, clearColor) {
      let { scene, camera } = _this.loadBasic(renderer);

      let boxes = createBoxes(boxColor);

      scene.add(boxes);

      this.fbo = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      );

      this.render = function (rtt) {
        renderer.setClearColor(clearColor);

        if (rtt) {
          renderer.setRenderTarget(this.fbo);
          renderer.clear();
          renderer.render(scene, camera);
        } else {
          renderer.setRenderTarget(null);
          renderer.render(scene, camera);
        }
      };
    }

    function createBoxes(color) {
      let group = new THREE.Group();
      let material = new THREE.MeshLambertMaterial({ color });
      for (let i = 0; i < 500; i++) {
        let mesh = new Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        group.add(mesh);

        mesh.position.x = Math.random() * 100 - 50;
        mesh.position.y = Math.random() * 60 - 30;
        mesh.position.z = Math.random() * 80 - 40;

        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
      }
      return group;
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  cloud(renderer) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let { scene, camera } = this.loadBasic(renderer);

    // 云的个数
    const cloudCount = 1000;

    // 每个云占的z轴的长度
    const perCloudz = 15;

    // 所有的云一共的z轴长度
    const cameraPositionZ = cloudCount * perCloudz;

    // x轴和y轴平移的随机参数
    const randomPositionX = 80;
    const randomPositionY = 120;

    // 背景色
    const backgroundColor = "#1e4877";

    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    camera.position.x = Math.floor(randomPositionX / 2);
    camera.position.z = cameraPositionZ;

    // 线性雾，就是说雾化效果是随着距离线性增大的
    // 可以改变雾的颜色，发现远处的云的颜色有所变化
    const fog = new THREE.Fog(backgroundColor, 1, 1000);

    const texture = new THREE.TextureLoader().load("/cloud.png");

    const geometry = new THREE.PlaneGeometry(64, 64);

    const geometries = [];

    const vShader = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fShader = `
      uniform sampler2D map;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec2 vUv;
      void main(){
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        gl_FragColor = texture2D(map, vUv);
        gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
        gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: texture,
        },
        fogColor: {
          value: fog.color,
        },
        fogNear: {
          value: fog.near,
        },
        fogFar: {
          value: fog.far,
        },
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true,
    });

    for (let i = 0; i < cloudCount; i++) {
      const instanceGeometry = geometry.clone();

      instanceGeometry.translate(
        Math.random() * randomPositionX,
        -Math.random() * randomPositionY,
        i * perCloudz
      );

      geometries.push(instanceGeometry);
    }

    const mergedGeometry = mergeBufferGeometries(geometries);

    const mesh = new THREE.Mesh(mergedGeometry, material);

    scene.add(mesh);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  loadAnimation(renderer) {
    let { scene, camera } = this.loadBasic(renderer);

    // let box = new THREE.BoxGeometry(10,10,10);
    // let mesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({
    //   color: 0x0000ff
    // }))
    // scene.add(mesh);

    // 进度条需要下面两种一起用，先加载GLTFLoader的onProgress，再加载LoadingManager的onProgress，一半一半
    let loadManager = new THREE.LoadingManager(
      () => {},
      (url, loaded, total) => {
        console.log(loaded, total);
      }
    );
    let loader = new GLTFLoader(loadManager);

    loader.load(
      // resource URL
      "bdzzcjgd3.gltf",
      // called when the resource is loaded
      function (gltf) {
        scene.add(gltf.scene);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded, xhr.total));
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  loadBasic(renderer) {
    // renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 30, 30);
    camera.lookAt(0, 0, 0);

    // 场景
    const scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // 控制相机
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    window.scene = scene;
    window.camera = camera;
    window.controls = controls;
    return {
      scene,
      camera,
      controls,
    };
  }
  render() {
    return (
      <div>
        <div id="box" style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }
}
