/*
 * @Author: Wjh
 * @Date: 2022-09-26 13:03:36
 * @LastEditors: Wjh
 * @LastEditTime: 2023-04-17 00:02:09
 * @FilePath: \howfar\src\MainPage\ShaderStudy2.js
 * @Description:
 *
 */
import React from "react";
import * as THREE from "three";
import {
  Box3,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  ObjectLoader,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
// import TWEEN from "tween.js";
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
import * as _ from "lodash";

import * as Nodes from "three/nodes";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry.js";

import { nodeFrame } from "three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { groupSort, mode, text } from "d3";
import { MeshLambertMaterial } from "three";
import h337 from "heatmapjs";
import gsap from "gsap";
import { Content } from "antd/lib/layout/layout";
import { Water } from "three/addons/objects/Water.js";
import Geometry from "../fire-libs/Geometry";
import Material from "../fire-libs/Material";
import { repeat } from "lodash";

//导入hdr图像加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"; //rebe加载器

import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

import { MyPathGeometry } from "../path-libs/MyPathGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LightningStrike } from "three/examples/jsm/geometries/LightningStrike.js";
import { LightningStorm } from "three/examples/jsm/objects/LightningStorm.js";
import TWEEN, { Easing, Tween } from "@tweenjs/tween.js";
import { FenceGeometry } from "../fence-libs/FenceGeometry";
import * as PIXI from "pixi.js";
import * as BABYLON from "babylonjs";
import { MySphereGeometry } from "../sphere-libs/MySphereGeometry";
import sky2_shader from "../sky-shaders/sky1";
import video from '../assets/motor-repeat.webm'
import vertex_14 from "../shaders/vertex-14";
import fragment_14 from "../shaders/fragment-14";
import vertex_14_color from "../shaders/vertex-14-color";
import fragment_14_color from "../shaders/fragment-14-color";
import { m4 } from "../webgl-libs/m4";
import * as twgl from 'twgl.js'
import {primitives} from 'twgl.js'

export default class ShaderStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿

      alpha: true,
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
    // this.rain(renderer)   // 下雨
    window.THREE = THREE;

    // this.temperature(renderer); // 设置设备温度
    // this.virtual(renderer); // 虚化
    // this.mouse_bloom(renderer); // 发光虚化
    // this.fire1(renderer); // 火1

    // this.computedWater(renderer)  // 喷水模拟
    // this.temperature2(renderer); // 设置设备温度

    // this.changeFog(renderer);  // js实现颜色的线性插值

    // this.ocean(renderer)  // 海洋
    // this.love(renderer)

    // this.fire(renderer)

    // this.test(renderer)

    // this.canvas(renderer) // 地板

    // this.label_move(renderer)  // 标签撞墙自动移位

    // this.practice(renderer);

    // this.new_path(renderer);

    // this.vague(renderer); // 模糊效果

    // this.blingbling(renderer); // 闪烁效果

    // this.uv_study(renderer); // uv学习

    // this.final_path(renderer); // 最终自己写的道路

    // this.play(renderer);  // 模拟发光

    // this.lightning(renderer); // 闪电

    // this.upgrade_bloom(renderer)  // 升级bloom

    // this.shine_test(renderer) // 发光效果测试

    // this.tweened_animation(renderer) // 渐变动画

    // this.move_camera(renderer) // 相机移动

    // this.floor(renderer)  // 封装的地板

    // this.not_light(renderer)  // 让物体不受光源的影响

    // this.camera_layers(renderer)  // 设置照相机和要凸显的物体的layers

    // this.line_glare(renderer)  // 线条炫光

    // this.shaking_snow(renderer) // 颤抖的雪

    // this.snow(renderer) // 下雪

    // this.new_path_animation(renderer) // 新的运动路径

    // this.new_virtual_tree(renderer) // 发光虚化树

    // this.new_fence(renderer)  // 新的围栏

    // this.add_flywire(renderer)  // 添加飞线

    // this.dynamic_sky(renderer)    // 动态天空

    // this.video_test(renderer); // 视频融合

    this.video_test2(renderer); // 视频融合2
  }

  async video_test2(renderer){
    let { scene, camera, controls } = this.loadBasic(renderer);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let gltf1 = await loader.loadAsync("/shaxi-main.glb");
    scene.add(gltf1.scene);

    const video = document.getElementById( 'motor_repeat' );
    video.play();
    const texture = new THREE.VideoTexture( video );

    let plane = new THREE.PlaneGeometry(20, 20);
    let mat = new THREE.MeshLambertMaterial({ map: texture});
    let mesh = new THREE.Mesh(plane, mat);
    // scene.add(mesh);

    mesh.rotateY(Math.PI * 0.5);
    mesh.position.x += 10;

    const settings = {
      posX: 20,
      posY: 20,
      posZ: 5,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      projWidth: 5,
      projHeight: 5,
    };
    
    const gui = new GUI();
    gui.add(settings, 'posX').onChange(change);

    const u_textureMatrix = {value: m4.identity()}
    function change(){
      let textureWorldMatrix = m4.lookAt(
        [settings.posX, settings.posY, settings.posZ],          // position
        [settings.targetX, settings.targetY, settings.targetZ], // target
        [0, 1, 0],                                              // up
      );
      textureWorldMatrix = m4.scale(
          textureWorldMatrix,
          settings.projWidth, settings.projHeight, 1,
      );
      u_textureMatrix.value = m4.inverse(textureWorldMatrix);
    }
    change();
    
    const sphereGeo = new THREE.SphereGeometry(10, 20, 20);
    const sphereMat = new ShaderMaterial({
      uniforms: {
        u_world: {
          value: m4.translation(0, 0, 0)
        },
        u_textureMatrix,
        u_video: {
          value: texture
        } 
      },
      vertexShader: `
        varying vec4 v_projectedTexcoord;
        uniform mat4 u_world;
        uniform mat4 u_textureMatrix;
        
        void main(){
          vec4 worldPosition = u_world * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          v_projectedTexcoord = u_textureMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec4 v_projectedTexcoord;
        uniform sampler2D u_video;
        void main(){
          vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;

          bool inRange = 
              projectedTexcoord.x >= 0.0 &&
              projectedTexcoord.x <= 1.0 &&
              projectedTexcoord.y >= 0.0 &&
              projectedTexcoord.y <= 1.0;
          float projectedAmount = inRange ? 1.0 : 0.0;

          vec4 texColor = vec4(1., 1., 0., 1.);
          vec4 projectedTexColor = texture2D(u_video, projectedTexcoord.xy);
          gl_FragColor = mix(texColor, projectedTexColor, projectedAmount);
        }
      `
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // scene.getObjectByName("主楼2").traverse((mesh) => {
    //   if (mesh?.material) {
    //     mesh.material = mesh.material.clone();
    //     // mesh.material.transparent = true;
    //     mesh.material.onBeforeCompile = (shader) => {
    //       const uniforms = {
    //         u_texture: { value: texture },
    //       };
    //       Object.assign(shader.uniforms, uniforms);

    //       const vertex = `
    //       varying vec4 v_projectedTexcoord;
    //       uniform mat4 u_world;
    //       uniform mat4 u_textureMatrix;
    //         void main(){
    //       `;
    //       const vertexColor = `
    //       vec4 worldPosition = u_world * vec4(position, 1.0);
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //       v_projectedTexcoord = u_textureMatrix * worldPosition;
    //         }
    //       `;
    //       shader.vertexShader = shader.vertexShader.replace(
    //         "void main() {",
    //         vertex
    //       );

    //       shader.vertexShader = shader.vertexShader.replace("}", vertexColor);
          
    //       const fragment = `
    //       varying vec4 v_projectedTexcoord;
    //       uniform sampler2D u_video;
    //         void main(){
    //       `;
    //       const fragmentColor = `
    //           vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;

    //           bool inRange = 
    //               projectedTexcoord.x >= 0.0 &&
    //               projectedTexcoord.x <= 1.0 &&
    //               projectedTexcoord.y >= 0.0 &&
    //               projectedTexcoord.y <= 1.0;
    //           float projectedAmount = inRange ? 1.0 : 0.0;

    //           vec4 texColor = vec4(1., 1., 0., 1.);
    //           vec4 projectedTexColor = vec4(1., 0., 0., 1.);
    //           gl_FragColor = mix(texColor, projectedTexColor, projectedAmount);
    //         }
    //       `;
    //       shader.fragmentShader = shader.fragmentShader.replace(
    //         "void main() {",
    //         fragment
    //       );

    //       shader.fragmentShader = shader.fragmentShader.replace(
    //         "}",
    //         fragmentColor
    //       );
    //     };
    //   }
    // });

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      texture.update()
    }
    render();
  }
  async video_test(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let gltf1 = await loader.loadAsync("/shaxi-main.glb");
    scene.add(gltf1.scene);


    const video = document.getElementById( 'motor_repeat' );
    video.play();
    const texture = new THREE.VideoTexture( video );

    let plane = new THREE.PlaneGeometry(20, 20);
    let mat = new THREE.MeshLambertMaterial({ map: texture});
    let mesh = new THREE.Mesh(plane, mat);
    // scene.add(mesh);

    mesh.rotateY(Math.PI * 0.5);
    mesh.position.x += 10;

    
    const gui = new GUI();

    let u_minZ = { value: 0 },
        u_minY = { value: 0, },
        u_maxZ = { value: 10, },
        u_maxY = { value: 10 };

    gui.add(u_minZ, "value").onChange(function () {
      // mesh.rotation.z = guiNode.lerpPosition;
    });

    scene.getObjectByName("主楼2").traverse((mesh) => {
      if (mesh?.material) {
        mesh.material = mesh.material.clone();
        // mesh.material.transparent = true;
        mesh.material.onBeforeCompile = (shader) => {
          const uniforms = {
            u_texture: { value: texture },
            u_minZ,
            u_maxZ,
            u_minY,
            u_maxY,
          };
          Object.assign(shader.uniforms, uniforms);

          console.log(shader);

          const vertex = `
            
            varying vec2 vUv2;
            varying vec4 vPosition;
            uniform float u_minZ;
            uniform float u_maxZ;
            uniform float u_minY;
            uniform float u_maxY;
            void main(){
          `;
          const vertexColor = `
              vUv2 = uv;
              // vPosition = modelViewMatrix * vec4(position, 1.0);
              vPosition = vec4(position, 1.0);
              // gl_Position = projectionMatrix * mvPosition;

              float l = u_maxZ - u_minZ;
              float lY = u_maxY - u_minY;

              vUv2 = vec2( abs(vPosition.x - u_minZ) / l,  abs(vPosition.y - u_minY) / lY);
            
            }
          `;
          shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            vertex
          );

          shader.vertexShader = shader.vertexShader.replace("}", vertexColor);
          
          const fragment = `
            uniform sampler2D u_texture;
            varying vec2 vUv2;
            varying vec4 vPosition;
            uniform float u_minZ;
            uniform float u_maxZ;
            uniform float u_minY;
            uniform float u_maxY;
            void main(){
          `;
          const fragmentColor = `
              
              if(vPosition.z > u_minZ && vPosition.y > u_minY && vPosition.z < u_maxZ && vPosition.y < u_maxY){
                gl_FragColor = texture2D(u_texture, vUv2);
              }

              if(vPosition.z > u_minZ){
                gl_FragColor = vec4(1., 1., 0., 1.);
              }

            }
          `;
          shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            fragment
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "}",
            fragmentColor
          );
        };
      }
    });

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      texture.update()
    }
    render();
  }

  async dynamic_sky(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(-16, 58, 65);
    controls.update();

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let gltf = await loader.loadAsync("/sphere.glb");
    scene.add(gltf.scene);
    // gltf.scene.scale.set(20, 20, 20)

    let gltf1 = await loader.loadAsync("/shaxi-main.glb");
    scene.add(gltf1.scene);

    controls.screenSpacePanning = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxPolarAngle = Math.PI / 2;

    // let mixer = new THREE.AnimationMixer(gltf.scene)
    // const pressureAnimation = mixer.clipAction(gltf.animations[0])
    // pressureAnimation.loop = THREE.LoopOnce // 不循环播放
    // pressureAnimation.clampWhenFinished = true; //暂停在最后一帧播放的状态
    // pressureAnimation.play();

    let texture = await new THREE.TextureLoader().loadAsync(
      "/images/noise.png"
    );
    // gltf.scene.children[0].material.map = texture;

    let iTime = { value: 0.0 };

    // const geometry = new MySphereGeometry( 500, 100, 100, 0, Math.PI );
    gltf.scene.children[0].material = new THREE.ShaderMaterial({
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iChannel0: {
          value: texture,
        },
        iTime,
      },
      side: THREE.BackSide,
      vertexShader: `
      varying vec2 vUv;
        void main(){
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
        `,
      fragmentShader: `
          const float cloudscale = 1.1;
          const float speed = 0.03;
          const float clouddark = 0.5;
          const float cloudlight = 0.3;
          const float cloudcover = 0.2;
          const float cloudalpha = 8.0;
          const float skytint = 0.5;
          const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
          const vec3 skycolour2 = vec3(0.4, 0.7, 1.0);
          
          const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
          
          vec2 hash( vec2 p ) {
            p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
          }
          
          float noise( in vec2 p ) {
              const float K1 = 0.366025404; // (sqrt(3)-1)/2;
              const float K2 = 0.211324865; // (3-sqrt(3))/6;
            vec2 i = floor(p + (p.x+p.y)*K1);	
              vec2 a = p - i + (i.x+i.y)*K2;
              vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
              vec2 b = a - o + K2;
            vec2 c = a - 1.0 + 2.0*K2;
              vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
              return dot(n, vec3(70.0));	
          }
          
          float fbm(vec2 n) {
            float total = 0.0, amplitude = 0.1;
            for (int i = 0; i < 7; i++) {
              total += noise(n) * amplitude;
              n = m * n;
              amplitude *= 0.4;
            }
            return total;
          }
          uniform vec2 iResolution;
          uniform float iTime;
          uniform sampler2D texture1;
          varying vec2 vUv;
          void main(){
            // vec2 p = gl_FragCoord.xy / iResolution.xy;
            vec2 p = vUv;
            vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
              float time = iTime * speed;
              float q = fbm(uv * cloudscale * 0.5);
              
              //ridged noise shape
            float r = 0.0;
            uv *= cloudscale;
              uv -= q - time;
              float weight = 0.8;
              for (int i=0; i<8; i++){
              r += abs(weight*noise( uv ));
                  uv = m*uv + time;
              weight *= 0.7;
              }
              
              //noise shape
            float f = 0.0;
              uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale;
              uv -= q - time;
              weight = 0.7;
              for (int i=0; i<8; i++){
              f += weight*noise( uv );
                  uv = m*uv + time;
              weight *= 0.6;
              }
              
              f *= r + f;
              
              //noise colour
              float c = 0.0;
              time = iTime * speed * 2.0;
              uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale*2.0;
              uv -= q - time;
              weight = 0.4;
              for (int i=0; i<7; i++){
              c += weight*noise( uv );
                  uv = m*uv + time;
              weight *= 0.6;
              }
              
              //noise ridge colour
              float c1 = 0.0;
              time = iTime * speed * 3.0;
              uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale*3.0;
              uv -= q - time;
              weight = 0.4;
              for (int i=0; i<7; i++){
              c1 += abs(weight*noise( uv ));
                  uv = m*uv + time;
              weight *= 0.6;
              }
            
              c += c1;
              
              vec3 skycolour = mix(skycolour2, skycolour1, p.y);
              vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
            
              f = cloudcover + cloudalpha*f*r;
              
              vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
              
            gl_FragColor = vec4( result, 1.0 );
            // gl_FragColor = texture2D(texture1, vUv);
          }
        `,
    });
    // const sphere = new THREE.Mesh( geometry, material );
    // sphere.rotateX(-Math.PI / 2);
    // scene.add( sphere );
    // gltf.scene.add(sphere)

    // const geom = new MySphereGeometry( 5, 4, 3 , 0, Math.PI );

    // const mat = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, wireframe: false, color: 0x00ffff} );
    // const mesh = new THREE.Mesh( geom, mat );
    // // mesh.rotateX(-Math.PI / 2);
    // scene.add( mesh );
    console.log(gltf.scene);

    let clock = new THREE.Clock();
    function render() {
      // mixer.update(clock.getDelta());

      requestAnimationFrame(render);

      renderer.render(scene, camera);

      iTime.value += clock.getDelta();
      // if(app){
      //   const sky = new THREE.CanvasTexture(app.view);
      //   sky.mapping = THREE.EquirectangularReflectionMapping;
      //   material.map = sky;
      // }
    }
    render();
  }

  add_flywire(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let start = new THREE.Vector3(0, 0, 0),
      end = new THREE.Vector3(20, 0, 0),
      pointY = 0,
      height = start.distanceTo(end) / 5;

    let points = [
      { x: start.x, y: pointY, z: start.z },
      // 三等分点
      {
        x: (end.x + 2 * start.x) / 3,
        y: pointY + height,
        z: (end.z + 2 * start.z) / 3,
      },
      {
        x: (2 * end.x + start.x) / 3,
        y: pointY + height,
        z: (2 * end.z + start.z) / 3,
      },
      // 二等分点
      // {x: (start.x + end.x) / 2, y: pointY + height, z: (start.z + end.z) / 2},
      { x: end.x, y: pointY, z: end.z },
    ];

    let obj = createFlywire({
      points,
    });
    scene.add(obj.points);
    obj.start();

    function createFlywire(params) {
      const option = {
        points: [],
        divisions: 1000, // 路径对应的分段数
        startColor: "#ffffff",
        endColor: "#ff0000",
        pointSize: 10,
        maxOpacity: 1,
        speed: 1,
        cycle: 3, // 一个周期是 divisions / cycle
      };

      Object.assign(option, params);

      let vec3Points = option.points.map((item) =>
        new THREE.Vector3().copy(item)
      );

      let curve = new THREE.CatmullRomCurve3(vec3Points);

      let pointsArr = curve.getPoints(option.divisions);

      let attrCnumber = [];

      for (let i = 0; i < pointsArr.length; i++) {
        attrCnumber.push(i);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
      geometry.setAttribute(
        "current",
        new THREE.Float32BufferAttribute(attrCnumber, 1)
      );

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uCycle: {
            value: option.divisions / option.cycle,
          },
          uSize: {
            value: option.pointSize,
          },
          uTime: {
            value: 0,
          },
          uLength: {
            value: pointsArr.length,
          },
          maxOpacity: {
            value: option.maxOpacity,
          },
          startColor: {
            value: new THREE.Color(option.startColor),
          },
          endColor: {
            value: new THREE.Color(option.endColor),
          },
        },
        vertexShader: `
        attribute float current;
        uniform float uCycle;
        uniform float uSize;
        uniform float uTime;
        varying float percent;
        varying float vCurrent;
        void main(){
          vCurrent = current;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          percent = mod(current+uTime, uCycle) / uCycle;
          gl_PointSize = percent * uSize;
        }
        `,
        fragmentShader: `
          varying float percent;
          uniform float uLength;
          varying float vCurrent;
          uniform vec3 startColor;
          uniform vec3 endColor;
          uniform float maxOpacity;
          void main(){
            float d = vCurrent / uLength;
            gl_FragColor = vec4(mix(startColor, endColor, d), percent * maxOpacity);
          }
        `,
      });

      const points = new THREE.Points(geometry, mat);

      let obj = {
        points,
        isStarted: false,
        stop() {
          this.isStarted = false;
        },
        start() {
          this.isStarted = true;
          render();
        },
      };

      let clock = new THREE.Clock();
      let d = option.divisions / 10;
      function render() {
        obj.isStarted && requestAnimationFrame(render);
        mat.uniforms.uTime.value -= clock.getDelta() * d * option.speed;
      }
      render();

      return obj;
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  new_fence(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    const box = new THREE.BoxGeometry(1, 1, 1);
    const boxMesh = new Mesh(box, new MeshLambertMaterial({ color: 0x0000ff }));
    scene.add(boxMesh);

    boxMesh.position.set(5, 5, 6);
    boxMesh.name = "boxMesh";

    gsap.to(boxMesh.position, {
      z: -1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      onUpdate: () => {},
    });

    let obj = this.createFence({
      points: [
        {
          x: 0.602154318249855,
          y: 0.921453849076141,
          z: 6.721410476616342,
        },
        {
          x: 10.148048025924078,
          y: 1.80519616030863,
          z: -3.687171295945351,
        },
        {
          x: 17.196987884977865,
          y: 10.367155161070908,
          z: -1.7331112243968336,
        },
        {
          x: 21.676960221577954,
          y: 6.7777302427081665,
          z: 2.761755486019113,
        },
        {
          x: 17.576459920642765,
          y: 8.061689769635127,
          z: 8.265982854571803,
        },
      ],
      height: 10,
      meshNameList: ["boxMesh"],
      scene: scene,
      warnCallback: (mesh) => {
        console.log(mesh.name, "穿墙了");
      },
    });
    scene.add(obj.mesh);
    obj.start();

    let clock = new THREE.Clock();
    function render() {
      // uTime.value -= clock.getDelta()

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  // 创建围栏 API
  createFence(params) {
    const option = {
      points: [],
      meshNameList: [],
      scene: null,
      height: 10,
      warnCallback: () => {},
      bgColor: "#00ff00",
      lineColor: "#ffff00",
      warnBgColor: "#ff0000",
      warnLineColor: "#ffff00",
      cycle: 1,
      lineWidth: 0,
      speed: 1,
    };
    Object.assign(option, params);

    // 1、制造围墙
    let geometry = new FenceGeometry(option.points, option.height);
    let uTime = { value: 0 };
    let mat = new THREE.ShaderMaterial({
      uniforms: {
        uBgColor: {
          value: new THREE.Color(option.bgColor),
        },
        uLineColor: {
          value: new THREE.Color(option.lineColor),
        },
        uCycle: {
          value: Math.PI * option.cycle,
        },
        uDown: {
          value: option.lineWidth,
        },
        uHeight: {
          value: option.height,
        },
        uTime,
      },
      vertexShader: `
      attribute float height;
      varying float vHeight;

      void main() {

        vHeight = height;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }`,
      fragmentShader: `
      #define PI 3.1415926//圆周率

      varying float vHeight;
      uniform float uCycle;
      uniform float uHeight;
      uniform float uDown;
      uniform float uTime;
      uniform vec3 uBgColor;
      uniform vec3 uLineColor;

      void main() {
        float w = 2.0 * PI / uCycle;
        float a = 1.0 + uDown;

        float d = abs(a * sin(w * (vHeight+uTime))) - uDown;

        float o = 1.0 - vHeight / uHeight;

        gl_FragColor = vec4(mix(uLineColor,uBgColor, d), o);

      }`,
      side: THREE.DoubleSide,
      transparent: true,
    });
    let mesh = new THREE.Mesh(geometry, mat);

    // 2、添加碰撞检测
    let meshAndBoxList = [];
    for (let item of option.meshNameList) {
      let mesh = option.scene.getObjectByName(item);
      let box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      box.setFromObject(mesh);
      meshAndBoxList.push({ mesh, box });
    }

    let triangleList = [];
    option.points.reduce((p1, p2) => {
      let p1TopPoint = new THREE.Vector3(p1.x, p1.y + option.height, p1.z),
        p2TopPoint = new THREE.Vector3(p2.x, p2.y + option.height, p2.z);

      let triangle1 = new THREE.Triangle(p1, p2, p2TopPoint),
        triangle2 = new THREE.Triangle(p1, p2TopPoint, p1TopPoint);

      triangleList.push(triangle1);
      triangleList.push(triangle2);

      return p2;
    });
    let obj = {
      mesh,
      isStarted: false,
      start() {
        this.isStarted = true;
        render();
      },
      stop() {
        this.isStarted = false;
      },
    };
    // 告警
    const warn = _.debounce(
      (mesh) => {
        mat.uniforms.uBgColor.value = new THREE.Color(option.warnBgColor);
        mat.uniforms.uLineColor.value = new THREE.Color(option.warnLineColor);
        option.warnCallback(mesh);
      },
      150,
      { leading: true, trailing: false }
    );

    let clock = new THREE.Clock();
    function render() {
      obj.isStarted && requestAnimationFrame(render);

      uTime.value -= clock.getDelta() * option.speed;
      // 1、更新包围盒
      for (let meshAndBox of meshAndBoxList) {
        meshAndBox.box.setFromObject(meshAndBox.mesh);
      }

      // 2、检测三角形是否与包围盒相撞
      for (let triangle of triangleList) {
        for (let meshAndBox of meshAndBoxList) {
          if (triangle.intersectsBox(meshAndBox.box)) {
            warn(mesh);
            return;
          }
        }
      }
      mat.uniforms.uBgColor.value = new THREE.Color(option.bgColor);
      mat.uniforms.uLineColor.value = new THREE.Color(option.lineColor);
    }

    return obj;
  }
  new_virtual_tree(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    const ENTIRE_SCENE = 0,
      BLOOM_SCENE = 1,
      BLOOM_SCENE_2 = 2;

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: "Scene with Glow",
    };

    let uuid;
    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const materials = {};

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
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

				gl_FragColor = ( texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv ) );

			}`,
        defines: {},
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    {
      const gui = new GUI();

      const folder = gui.addFolder("Bloom Parameters");

      folder.add(params, "exposure", 0.1, 2).onChange(function (value) {
        renderer.toneMappingExposure = Math.pow(value, 4.0);
        render();
      });

      folder.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
        bloomPass.threshold = Number(value);
        render();
      });

      folder
        .add(params, "bloomStrength", 0.0, 100.0)
        .onChange(function (value) {
          bloomPass.strength = Number(value);
          render();
        });

      folder
        .add(params, "bloomRadius", 0.0, 1.0)
        .step(0.01)
        .onChange(function (value) {
          bloomPass.radius = Number(value);
          render();
        });
    }

    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        gltf.scene.name = "场景";
        await scene.add(gltf.scene);

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
    window.toggleVirtualMesh = toggleVirtualMesh;
    window.toggleVirtualTree = toggleVirtualTree;

    function toggleVirtualMesh(name, scene, _isVirtual) {
      let _mesh = scene.getObjectByName(name);

      // 如果有传_isVirtual
      if (_isVirtual != undefined) {
        if (_isVirtual === true && !_mesh.userData.isVirtual) {
          virtual(_mesh);
          return;
        }
        if (_isVirtual === false && _mesh.userData.isVirtual) {
          restore(_mesh);
          return;
        }

        // 如果没有传_isVirtual
      } else {
        if (_mesh.userData.isVirtual) {
          restore(_mesh);
        } else {
          virtual(_mesh);
        }
      }
      function virtual(_mesh) {
        _mesh.userData.isVirtual = true;
        // 虚化
        _mesh.traverse((mesh) => {
          if (mesh?.isMesh) {
            let lineGeometry = new THREE.EdgesGeometry(mesh.geometry);
            let line = new THREE.LineSegments(
              lineGeometry,
              new THREE.LineBasicMaterial({
                color: 0x00ffff,
                opacity: 0.1,
                transparent: true,
              })
            );
            line.layers.toggle(BLOOM_SCENE);
            line.name = mesh.uuid + "线框";
            mesh.parent.add(line);
            mesh.visible = false;
          }
        });
      }
      function restore(_mesh) {
        _mesh.userData.isVirtual = false;
        let list = [];
        _mesh.traverse((mesh) => {
          if (mesh?.isMesh) {
            let line = scene.getObjectByName(mesh.uuid + "线框");
            list.push(line);
            mesh.visible = true;
          }
        });
        list.forEach((line) => {
          line.removeFromParent();
        });
      }

      return _mesh.userData.isVirtual;
    }

    loader.load("/shaxi-tree.glb", async (gltf) => {
      await scene.add(gltf.scene);
    });

    function toggleVirtualTree(name, scene, _isVirtual, params) {
      let mesh = scene.getObjectByName(name);
      const option = {
        color: "#00ffff",
        opacity: 0.05,
      };
      Object.assign(option, params || {});

      let userData = mesh.userData;
      if (userData.isVirtual == undefined) {
        userData.isVirtual = { value: 0 };
        mesh.traverse((_mesh) => {
          if (_mesh?.material?.isMaterial) {
            _mesh.material.transparent = true;
            _mesh.material.wireframe = false;

            _mesh.material.onBeforeCompile = (shader) => {
              const uniforms = {
                isVirtual: userData.isVirtual,
                uOpacity: { value: option.opacity },
                uColor: { value: new THREE.Color(option.color) },
              };
              Object.assign(shader.uniforms, uniforms);
              const fragment = `
                uniform float isVirtual;
                uniform float uOpacity;
                uniform vec3 uColor;
                void main(){
              `;
              const fragmentColor = `
                  if(isVirtual == 1.0){
                    gl_FragColor = vec4(uColor, uOpacity);
                  }
                }
              `;
              shader.fragmentShader = shader.fragmentShader.replace(
                "void main() {",
                fragment
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                "}",
                fragmentColor
              );
            };
          }
        });
      }

      // 如果有传_isVirtual
      if (_isVirtual != undefined) {
        if (_isVirtual === true && !mesh.userData.isVirtual.value) {
          virtual();
          return;
        }
        if (_isVirtual === false && mesh.userData.isVirtual.value) {
          restore();
          return;
        }

        // 如果没有传_isVirtual
      } else {
        if (mesh.userData.isVirtual.value) {
          restore();
        } else {
          virtual();
        }
      }

      // 虚化
      function virtual() {
        userData.isVirtual.value = 1;
        mesh.traverse((mesh) => {
          if (mesh?.material?.isMaterial) {
            mesh.material.wireframe = true;
            mesh.material.transparent = true;
            mesh.layers.toggle(BLOOM_SCENE);
          }
        });
      }
      // 还原
      function restore() {
        userData.isVirtual.value = 0;
        mesh.traverse((mesh) => {
          if (mesh?.material?.isMaterial) {
            mesh.material.wireframe = false;
            mesh.layers.toggle(BLOOM_SCENE);
          }
        });
      }
      return Boolean(userData.isVirtual.value);
    }

    let stats = new Stats();
    document.body.append(stats.dom);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();

    function darkenNonBloomed(obj) {
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;

        if (obj.uuid == uuid) console.log(bloomLayer, obj.layers);
      }
    }

    function restoreMaterial(obj) {
      if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];

        if (obj.uuid == uuid) console.log(321);
      }
    }
  }
  async snow(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    box.geometry.computeBoundingBox();

    let { min, max } = box.geometry.boundingBox;

    let uTime = { value: 0 };

    const pointMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime,
        height: {
          value: max.y - min.y,
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float height;
        void main(){
          vUv = uv;
          vec3 pos = vec3(position.x, mod(position.y+uTime, height) - (height/2.0), position.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 10.0;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main(){
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          float m = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(1.0, 1.0, 1.0, m * 0.5);
        }
      `,
    });
    const group = new THREE.Group();
    const points = [];
    for (let i = 0; i < 1000; i++) {
      const pos = new THREE.Vector3();
      pos.x = Math.random() * (max.x - min.x + 1) + min.x;
      pos.y = Math.random() * (max.y - min.y + 1) + min.y;
      pos.z = Math.random() * (max.z - min.z + 1) + min.z;

      points.push(pos.x);
      points.push(pos.y);
      points.push(pos.z);
    }
    let g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(points), 3)
    );
    let mesh = new THREE.Points(g, pointMat);

    const h = new THREE.BoxHelper(mesh);
    scene.add(h);

    let obj = create_snow({
      width: 200,
      speed: 10,
      pointSize: 30,
    });
    scene.add(obj.mesh);
    obj.start();

    // scene.add(mesh);

    let clock = new THREE.Clock();
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();

    function create_snow(params) {
      const option = {
        width: 100,
        height: 100,
        depth: 100,
        total: 1000, // 雪的数量
        speed: 10, // 下雪速度
        pointSize: 10, // 雪的大小
      };

      Object.assign(option, params);

      let box = new THREE.Mesh(
        new THREE.BoxGeometry(option.width, option.height, option.depth),
        new THREE.MeshLambertMaterial({ color: 0xffff00 })
      );
      box.geometry.computeBoundingBox();

      let { min, max } = box.geometry.boundingBox;

      let uTime = { value: 0 };

      const pointMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime,
          height: {
            value: max.y - min.y,
          },
          pointSize: {
            value: option.pointSize,
          },
        },
        transparent: true,
        depthWrite: false,
        depthTest: true,
        vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float height;
        uniform float pointSize;
          void main(){
            vUv = uv;
            vec3 pos = vec3(position.x, mod(position.y+uTime, height) - (height/2.0), position.z);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = pointSize;
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main(){
            float d = distance(gl_PointCoord, vec2(0.5, 0.5));
            float m = 1.0 - smoothstep(0.0, 0.5, d);
            gl_FragColor = vec4(1.0, 1.0, 1.0, m * 0.5);
          }
        `,
      });
      const group = new THREE.Group();
      const points = [];
      for (let i = 0; i < option.total; i++) {
        const pos = new THREE.Vector3();
        pos.x = Math.random() * (max.x - min.x + 1) + min.x;
        pos.y = Math.random() * (max.y - min.y + 1) + min.y;
        pos.z = Math.random() * (max.z - min.z + 1) + min.z;

        points.push(pos.x);
        points.push(pos.y);
        points.push(pos.z);
      }
      let g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(points), 3)
      );
      let mesh = new THREE.Points(g, pointMat);

      const boxHelper = new THREE.BoxHelper(mesh);

      const obj = {
        mesh,
        boxHelper,
        isStarted: false,
        start() {
          this.isStarted = true;
          render();
        },
        stop() {
          this.isStarted = false;
        },
      };

      let clock = new THREE.Clock();
      function render() {
        obj.isStarted && requestAnimationFrame(render);
        uTime.value -= option.speed * clock.getDelta();
      }
      return obj;
    }
  }
  async shaking_snow(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    // scene.add(box);
    box.geometry.computeBoundingBox();

    let { min, max } = box.geometry.boundingBox;

    let d = 1;

    let texture = await new THREE.TextureLoader().loadAsync("/circle.png");

    const pointMat = new THREE.PointsMaterial({
      map: texture,
      opacity: 0.7,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });
    const group = new THREE.Group();
    const points = [];
    for (let i = 0; i < 1000; i++) {
      const pos = new THREE.Vector3();
      pos.x = Math.random() * (max.x - min.x + 1) + min.x;
      pos.y = Math.random() * (max.y - min.y + 1) + min.y;
      pos.z = Math.random() * (max.z - min.z + 1) + min.z;

      points.push(pos.x);
      points.push(pos.y);
      points.push(pos.z);
    }
    let g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(points), 3)
    );
    let mesh = new THREE.Points(g, pointMat);

    const h = new THREE.BoxHelper(mesh);
    scene.add(h);

    scene.add(mesh);

    function render() {
      const positions = mesh.geometry.attributes.position.array;

      for (let i = 0, len = positions.length; i < len; i++) {
        let delta = 0.01;
        if (Math.random() > 0.5) positions[i + 1] += delta;
        else positions[i + 1] -= delta;
      }

      mesh.geometry.attributes.position.needsUpdate = true;

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  async line_glare(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    renderer.setClearColor(0xcccccc);

    const geometry = new THREE.BufferGeometry();
    let positions = [
      -10, 0, 10, 10, 0, 10, 20, 5, -10, -20, 7, -10, -10, 0, 10,
    ];
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    let texture = await new THREE.TextureLoader().loadAsync("/circle.png");

    let mat = new THREE.ShaderMaterial({
      uniforms: {
        img: {
          value: texture,
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      vertexShader: `
      varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 100.0;
        }
      `,
      fragmentShader: `
        uniform sampler2D img;
        varying vec2 vUv;
        void main(){
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          gl_FragColor = texture2D(img, gl_PointCoord);
          // if(gl_FragColor.a == 0.0) discard;
          // float m = 1.0 - smoothstep(0.0, 0.5, d);
          // gl_FragColor = vec4(1.0, 1.0, 0.0, m);
        }
      `,
    });

    let mesh = new THREE.Points(geometry, mat);
    scene.add(mesh);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  async camera_layers(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const DEFAULT_LAYER = 0,
      SECOND_LAYER = 1;

    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let gltf = await loader.loadAsync("/shaxi-main.glb");
    scene.add(gltf.scene);

    let light = new THREE.DirectionalLight();
    light.position.set(1, 1, 1);
    light.intensity = 2;
    scene.add(light);
    light.layers.enable(SECOND_LAYER);
    light.layers.set(SECOND_LAYER);

    let isToggle = false;

    setInterval(() => {
      let layer = isToggle ? DEFAULT_LAYER : SECOND_LAYER;
      camera.layers.enable(layer);
      camera.layers.set(layer);

      scene.getObjectByName("#1主变").traverse((mesh) => {
        if (mesh?.layers) {
          mesh.layers.enable(layer);
          mesh.layers.set(layer);
        }
      });

      isToggle = !isToggle;
    }, 3000);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  async not_light(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let gltf = await loader.loadAsync("/shaxi-main.glb");
    scene.add(gltf.scene);

    let light = new THREE.DirectionalLight();
    scene.add(light);

    scene.getObjectByName("地形").traverse((mesh) => {
      if (mesh.material?.isMeshStandardMaterial) {
        // mesh.material.emissiveIntensity = 0;
        // mesh.material.envMapIntensity = 0;
        // mesh.material.lightMapIntensity = 0;
        // mesh.material.refractionRatio = 0;
        // mesh.material.metalness = 0;

        mesh.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = `
          uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
          `;
        };
      }
    });

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  async floor(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    renderer.setClearColor(0x1f527b);
    // let pos = {
    //   "x": 12.582182772199193,
    //   "y": 399.41594248256837,
    //   "z": 360.4669449611739
    // }
    // camera.position.copy(pos)
    // controls.update();

    let loader = new THREE.TextureLoader();

    // 第一层(网格)
    let obj1 = create_floor({
      imgUrl: "/images/1.png",
    });
    console.log(obj1);

    scene.add(obj1.mesh);
    obj1.start();

    // 第二层
    let obj2 = create_floor({
      imgUrl: "/images/2.png",
      imgHighColor: "#00ffff",
      initOpacity: 0.2,
      moreLight: 3,
    });
    obj2.mesh.position.y -= 0.5;
    scene.add(obj2.mesh);
    obj2.start();

    // 第三层
    let obj3 = create_floor({
      imgUrl: "/images/3.png",
      imgHighColor: "#ffffff",
      initOpacity: 0,
      moreLight: 3,
    });
    obj3.mesh.position.y -= 1;
    scene.add(obj3.mesh);
    obj3.start();

    function create_floor(params) {
      const option = {
        width: 400,
        height: 400,
        imgUrl: "",
        // 图片重复次数
        imgRepeatXY: 10,
        // 图片高亮颜色
        imgHighColor: "#7a6fc0",
        // 初始透明度(范围0-1)
        initOpacity: 0.2, //
        // 两个环间隔距离
        ringDistance: 90,

        // 内环和外环的宽度(范围0-width)
        blurRadius: 25,
        innerRadius: 20,
        // 内外环里有一个环透明度要低一点
        lowerOpacity: 0.4,
        // 最高亮度 * 这个倍数
        moreLight: 1,
        // 外围颜色
        edgeColor: "#1f527b",
      };
      Object.assign(option, params);

      let geometry = new THREE.PlaneGeometry(option.width, option.height, 2, 2);
      geometry.computeBoundingSphere();
      let { radius } = geometry.boundingSphere;

      let img = { value: null };
      new THREE.TextureLoader().load(option.imgUrl, (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        img.value = texture;
      });

      let vTime = { value: 0.0 };

      let mat = new THREE.ShaderMaterial({
        uniforms: {
          img,
          imgRepeatXY: {
            value: option.imgRepeatXY,
          },
          radius: {
            value: radius,
          },
          // 内环和外环的宽度
          vBlurRadius: {
            value: option.blurRadius,
          },
          vInnerRadius: {
            value: option.innerRadius,
          },
          // 内外环里有一个环透明度要低一点
          vLowerOpacity: {
            value: option.lowerOpacity,
          },
          // 初始透明度
          vInitOpacity: {
            value: option.initOpacity,
          },
          // 图片高亮的颜色
          imgHighColor: {
            value: new THREE.Color(option.imgHighColor),
          },
          // 两个环间隔距离
          ringDistance: {
            value: option.ringDistance,
          },
          moreLight: {
            value: option.moreLight,
          },
          edgeColor: {
            value: new THREE.Color(option.edgeColor),
          },
          vTime,
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main(){
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D img;

          uniform vec3 imgHighColor;
          uniform vec3 edgeColor;

          uniform float imgRepeatXY;

          uniform float radius;
          uniform float ringDistance;
          uniform float vTime;

          uniform float vInnerRadius;
          uniform float vBlurRadius;
          uniform float vLowerOpacity;
          uniform float vInitOpacity;
          uniform float moreLight;

          varying vec2 vUv;
          varying vec3 vPosition;

          vec4 addRing(float offsetWidth, vec4 texture1, bool isInner){
            float moveR = mod(vTime + offsetWidth, radius);

            float edge0 = moveR - vInnerRadius;
            float edge1 = moveR;
            float edge2 = moveR + vBlurRadius;

            float curR = length(vPosition.xy);

            float o = vInitOpacity == 0.0 ? 1.0 : texture1.a * (1.0 / vInitOpacity * moreLight);

            // 内环
            if(curR < edge1 && curR > edge0){
              float d = smoothstep(edge0, edge1, curR); // 由外到内是 1.0-0.0
              float d1 = clamp(d * o, 0., 1.); 
              texture1.a = isInner ? max(d1 * vLowerOpacity, texture1.a) : max(d1, texture1.a);
              
              texture1.rgb = mix(texture1.rgb, imgHighColor, d);
            
            // 外环
            }else if(curR < edge2 && curR > edge1){
              float d = (1.0 - smoothstep(edge1, edge2, curR)); // 由内到外是 1.0-0.0
              float d1 = clamp(d * o, 0., 1.); 
              texture1.a = isInner ? max(d1, texture1.a) : max(d1 * vLowerOpacity, texture1.a);

              texture1.rgb = mix(texture1.rgb, imgHighColor, d);
              
            }
            return texture1;
          }
          vec4 addRing2(float offsetWidth, vec4 texture1, bool isInner){
            float moveR = mod(vTime + offsetWidth, radius);

            float edge0 = moveR - vInnerRadius;
            float edge1 = moveR;
            float edge2 = moveR + vBlurRadius;

            float curR = length(vPosition.xy);

            // 内环
            if(curR < edge1 && curR > edge0){
              float d = smoothstep(edge0, edge1, curR); // 由外到内是 1.0-0.0
              texture1.a *= isInner ? (d * vLowerOpacity) : d;  
              
            // 外环
            }else if(curR < edge2 && curR > edge1){
              float d = (1.0 - smoothstep(edge1, edge2, curR)); // 由内到外是 1.0-0.0
              texture1.a *= isInner ? d : (d * vLowerOpacity);

            }else{
              texture1.a = 0.0;
            }
            return texture1;
          }
          void main(){
            vec4 texture1 = texture2D(img, vec2(vUv.x * imgRepeatXY, vUv.y * imgRepeatXY));

            if(vInitOpacity == 0.0){
              vec4 ring1 = addRing2(0.0, texture1, true);
              vec4 ring2 = addRing2(ringDistance, texture1, false);
              gl_FragColor = ring1 + ring2;

            }else{
              
              texture1.a *= vInitOpacity;
              vec4 ring1 = addRing(0.0, texture1, true);
              vec4 ring2 = addRing(ringDistance, ring1, false);
              gl_FragColor = ring2;
            }

            float o = length(vPosition.xy/radius);
            gl_FragColor = vec4(mix(gl_FragColor.rgb, edgeColor, o), gl_FragColor.a);
          }
        `,
        transparent: true,
      });

      let mesh = new THREE.Mesh(geometry, mat);
      mesh.rotateX(-Math.PI * 0.5);

      const obj = {
        mesh,
        isStarted: false,
        start() {
          this.isStarted = true;
          render();
        },
        stop() {
          this.isStarted = false;
        },
      };
      let clock = new THREE.Clock();
      function render() {
        obj.isStarted && requestAnimationFrame(render);
        vTime.value += clock.getDelta() * 20;
      }
      return obj;
    }

    async function create_floor1(params) {
      let loader = new THREE.TextureLoader();

      let img1 = await loader.loadAsync("/images/1.png");
      let img2 = await loader.loadAsync("/images/2.png");
      let img3 = await loader.loadAsync("/images/3.png");
      img1.wrapS =
        img1.wrapT =
        img2.wrapS =
        img2.wrapT =
        img3.wrapS =
        img3.wrapT =
          THREE.RepeatWrapping;

      const option = {
        width: 400,
        height: 400,
        img1,
        img1RepeatXY: 10,
        img2,
        img2RepeatXY: 10,
        img3,
        img3RepeatXY: 10,

        // 内环和外环的宽度
        blurRadius: 20,
        innerRadius: 20,
      };
      Object.assign(option, params);

      let geometry = new THREE.PlaneGeometry(option.width, option.height, 2, 2);
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
      let { center, radius } = geometry.boundingSphere;
      let { min, max } = geometry.boundingBox;
      console.log(geometry);

      let vTime = { value: 0.0 };

      let mat = new THREE.ShaderMaterial({
        uniforms: {
          img1: {
            value: option.img1,
          },
          img2: {
            value: option.img2,
          },
          img3: {
            value: option.img3,
          },
          img1RepeatXY: {
            value: option.img1RepeatXY,
          },
          img2RepeatXY: {
            value: option.img2RepeatXY,
          },
          img3RepeatXY: {
            value: option.img3RepeatXY,
          },
          radius: {
            value: new THREE.Vector2((max.x - min.x) / 2, (max.y - min.y) / 2),
          },
          center: {
            value: center,
          },
          // 内环和外环的宽度
          vBlurRadius: {
            value: 30,
          },
          vInnerRadius: {
            value: 30,
          },
          // 内外环里有一个环透明度要低一点
          vLowerOpacity: {
            value: 0.4,
          },
          // 图片1高亮的颜色
          img1HighColor: {
            value: new THREE.Color("#7a6fc0"),
          },
          vTime,
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main(){
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D img1;
          uniform sampler2D img2;
          uniform sampler2D img3;

          uniform vec3 img1HighColor;

          uniform float img1RepeatXY;
          uniform float img2RepeatXY;
          uniform float img3RepeatXY;

          uniform vec2 radius;
          uniform vec3 center;
          uniform float vTime;

          uniform float vInnerRadius;
          uniform float vBlurRadius;
          uniform float vLowerOpacity;

          varying vec2 vUv;
          varying vec3 vPosition;

          vec4 addRing(float offsetWidth, vec4 texture1, vec4 texture2, vec4 texture3){
            float moveR = mod(vTime + offsetWidth, radius.x);

            float edge0 = moveR - vInnerRadius;
            float edge1 = moveR;
            float edge2 = moveR + vBlurRadius;

            float curR = length(vPosition.xy);

            // 内环
            if(curR < edge1 && curR > edge0){
              float d = smoothstep(edge0, edge1, curR); // 由外到内是 1.0-0.0
              float d1 = clamp(d * texture1.a * 5.0, 0., 1.); 
              texture1.a = max(d1 * vLowerOpacity, texture1.a);
              
              texture1.rgb = mix(texture1.rgb, img1HighColor, d);

              texture2.a = max(texture2.a, d * texture2.a * 20.0 * vLowerOpacity );

              texture3.a *= d;
            
            // 外环
            }else if(curR < edge2 && curR > edge1){
              float d = (1.0 - smoothstep(edge1, edge2, curR)); // 由内到外是 1.0-0.0
              float d1 = clamp(d * texture1.a * 5.0, 0., 1.); 
              texture1.a = max(d1, texture1.a);

              texture1.rgb = mix(texture1.rgb, img1HighColor, d);
              
              texture2.a = max(texture2.a, d * texture2.a * 20.0);
              
              texture3.a *= d;
            }else{
              texture3.a = 0.0;
            }
            return texture1 + texture2 + texture3;

          }
          void main(){
            vec4 texture1 = texture2D(img1, vec2(vUv.x * img1RepeatXY, vUv.y * img1RepeatXY));
            vec4 texture2 = texture2D(img2, vec2(vUv.x * img2RepeatXY, vUv.y * img2RepeatXY));
            vec4 texture3 = texture2D(img3, vec2(vUv.x * img3RepeatXY, vUv.y * img3RepeatXY));

            // 初始化三个贴图的参数
            texture2.rgb = vec3(0.0, 1.0, 1.0);
            texture1.a *= 0.2;
            texture2.a *= 0.1;

            if(texture1.a < 0.001){
              texture1.rgb = vec3(0.0, 0.0, 0.0);
            }
            if(texture2.a < 0.001){
              texture2.rgb = vec3(0.0, 0.0, 0.0);
            }
            if(texture3.a < 0.001){
              texture3.rgb = vec3(0.0, 0.0, 0.0);
            }

            vec4 ring2 = addRing(0.0, texture1, texture2, texture3);
            vec4 ring1 = addRing(radius.x / 2.0, texture1, texture2, texture3);

            gl_FragColor = ring1 + ring2;
          }
        `,
        transparent: true,
      });

      let clock = new THREE.Clock();
      function render() {
        vTime.value += clock.getDelta() * 20;
        requestAnimationFrame(render);
      }
      render();

      let mesh = new THREE.Mesh(geometry, mat);
      mesh.rotateX(-Math.PI * 0.5);
      return mesh;
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  move_camera(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let pos = {
      x: 483.1277266658629,
      y: 516.1509008308291,
      z: 1344.2366162786986,
    };
    let targetPos = {
      x: 530.5256549902259,
      y: -103.8820878127977,
      z: 60.77386963747249,
    };

    setTimeout(() => {
      move(pos, targetPos, 2);
    }, 3000);

    function move(_cameraPos, _targetPos, speed = 1) {
      let cameraPos = new THREE.Vector3().copy(_cameraPos);
      let targetPos = new THREE.Vector3().copy(_targetPos);
      let lengthVector = new THREE.Vector3();
      lengthVector.subVectors(cameraPos, targetPos);
      let length = lengthVector.length();
      let time = length / speed;

      new TWEEN.Tween(camera.position)
        .to(
          {
            x: cameraPos.x,
            y: cameraPos.y,
            z: cameraPos.z,
          },
          time
        )
        // .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          controls.update();
        })
        .start();
      new TWEEN.Tween(controls.target)
        .to(
          {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
          },
          time
        )
        .onUpdate(() => {
          controls.update();
        })
        .start();
    }

    function render() {
      TWEEN.update();

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  async tweened_animation(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let isTransparent = { value: 1 };

    let tMixTexture = {
      value: await new TextureLoader().loadAsync("/transition/transition3.png"),
    };
    let mixRatio = {
      value: 0,
    };
    let height = {
      value: 0,
    };

    window.isTransparent = isTransparent;

    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        scene.add(gltf.scene);

        scene.getObjectByName("主楼屋顶").visible = false;

        setTransparent("内墙");
        setTransparent("主楼1");
        setTransparent("主楼2");
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

    const gui = new GUI();

    gui.add(mixRatio, "value", 0, 1, 0.1).listen();
    gui.add(height, "value", 0, 1, 0.1).listen();

    function setTransparent(_name) {
      let group = scene.getObjectByName(_name);

      group.traverse((mesh) => {
        if (mesh.material?.isMaterial) {
          mesh.material = mesh.material.clone();

          mesh.material.transparent = true;

          mesh.material.onBeforeCompile = (shader) => {
            const uniforms = { isTransparent, tMixTexture, mixRatio, height };
            Object.assign(shader.uniforms, uniforms);
            const vertex = `
            
              varying vec2 vUv1;
              varying vec3 vPosition;
              void main(){
            `;
            const vertexColor = `
                vUv1 = uv;
                vPosition = position;
              }
            `;
            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              vertex
            );

            shader.vertexShader = shader.vertexShader.replace("}", vertexColor);
            const fragment = `
              uniform float isTransparent;
              uniform sampler2D tMixTexture;
              uniform float mixRatio;
              uniform float height;
              varying vec2 vUv1;
              varying vec3 vPosition;
              void main(){
            `;
            const fragmentColor = `
              
              vec4 transparent = vec4(1.0, 1.0, 1.0, 0.2);
              vec4 origin = gl_FragColor;
              vec4 transitionTexel = texture2D( tMixTexture, vUv1 * 2.0 );
              
              float threshold = 0.3;
              float r = mixRatio * (1.0 + threshold * 2.0) - threshold; // -1 ~ 0.5
              float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);
              gl_FragColor = mix(transparent, origin, mixf);
              
              // float h = height * 19. - 1.0;
              // if(vPosition.y < h){
              //   gl_FragColor = transparent;
              // }

              }
            `;
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              fragment
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              "}",
              fragmentColor
            );
          };
        }
      });
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  shine_test(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        // 外发光
        // "s":   { type: "f", value: 1.0},
        // "b":   { type: "f", value: 0.0},
        // "p":   { type: "f", value: 2.0 },
        // 内发光
        s: { type: "f", value: -1.0 },
        b: { type: "f", value: 1.0 },
        p: { type: "f", value: 2.0 },
        glowColor: { type: "c", value: new THREE.Color(0x00ffff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float b;
        uniform float p;
        uniform float s;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
          gl_FragColor = vec4( glowColor, a );
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    // let geometry = new THREE.BoxGeometry( 10, 10, 10 )
    let geometry = new THREE.TorusKnotGeometry(10, 3, 100, 32);
    // let geometry = new THREE.SphereGeometry( 10,50, 50 )
    let torusKnot = new THREE.Mesh(geometry, customMaterial);
    scene.add(torusKnot);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  upgrade_bloom(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const ENTIRE_SCENE = 0,
      BLOOM_SCENE = 1,
      BLOOM_SCENE_2 = 2;

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: "Scene with Glow",
    };

    let uuid;
    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const materials = {};

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
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

				gl_FragColor = ( texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv ) );

			}`,
        defines: {},
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    // 添加物体
    let box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    scene.add(box);
    box.layers.toggle(BLOOM_SCENE);

    let box1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    box1.position.set(3, 0, 0);
    scene.add(box1);
    box1.layers.toggle(BLOOM_SCENE_2);
    box1.name = "box1";

    function render() {
      requestAnimationFrame(render);

      scene.traverse(darkenNonBloomed);

      bloomComposer.render();
      scene.traverse(restoreMaterial);

      finalComposer.render();
    }
    render();

    function darkenNonBloomed(obj) {
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;

        if (obj.uuid == uuid) console.log(bloomLayer, obj.layers);
      }
    }

    function restoreMaterial(obj) {
      if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];

        if (obj.uuid == uuid) console.log(321);
      }
    }
  }

  lightning(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const conesDistance = 1000;
    const coneHeight = 200;
    const coneHeightHalf = coneHeight * 0.5;

    let pos1 = new THREE.Vector3(0, conesDistance + coneHeight, 0);
    let pos2 = new THREE.Vector3(0, coneHeightHalf, 0);

    let rayParams = {
      sourceOffset: new THREE.Vector3(),
      destOffset: new THREE.Vector3(),
      radius0: 4,
      radius1: 4,
      minRadius: 2.5,
      maxIterations: 7,
      isEternal: true,

      timeScale: 0.7,

      propagationTimeFactor: 0.05,
      vanishingTimeFactor: 0.95,
      subrayPeriod: 3.5,
      subrayDutyCycle: 0.6,
      maxSubrayRecursion: 3,
      ramification: 7,
      recursionProbability: 0.6,

      roughness: 0.85,
      straightness: 0.6,
    };

    let lightningMaterial = new THREE.MeshBasicMaterial({ color: 0xb0ffff });
    let lightningStrike = new LightningStrike(rayParams);
    let lightningStrikeMesh = new THREE.Mesh(
      lightningStrike,
      lightningMaterial
    );

    scene.add(lightningStrikeMesh);

    let plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({ color: 0xc0c0c0, shininess: 0 })
    );
    plane.rotateX(-Math.PI * 0.5);
    scene.add(plane);

    let light = new THREE.PointLight(0x00ffff, 1, 5000, 2);
    light.position.set(0, 1, 0);
    scene.add(light);

    const clock = new THREE.Clock();
    let currentTime = 0;

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      lightningStrike.rayParameters.sourceOffset.copy(pos1);
      lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
      lightningStrike.rayParameters.destOffset.copy(pos2);
      lightningStrike.rayParameters.destOffset.y += coneHeightHalf;

      currentTime += clock.getDelta();
      if (currentTime < 0) {
        currentTime = 0;
      }
      lightningStrike.update(currentTime);
    }
    render();
  }

  play(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let geometry = new THREE.SphereGeometry(30, 32, 16);
    let material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let textureLoader = new THREE.TextureLoader();
    // 加载贴图
    let texture = textureLoader.load("/textures/shine.png");
    // 点精灵材质
    let spriteMaterial = new THREE.SpriteMaterial({
      map: texture, //贴图
      color: 0xffff00,
      blending: THREE.AdditiveBlending, //在使用此材质显示对象时要使用何种混合。加法
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    // 发光范围
    sprite.scale.set(100, 100, 1.0);
    mesh.add(sprite);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  async final_path(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let points = [
      {
        x: 7.602154318249855,
        y: 7.921453849076141,
        z: 6.721410476616342,
      },
      {
        x: 10.148048025924078,
        y: 9.80519616030863,
        z: -3.687171295945351,
      },
      {
        x: 17.196987884977865,
        y: 10.367155161070908,
        z: -1.7331112243968336,
      },
      {
        x: 21.676960221577954,
        y: 6.7777302427081665,
        z: 2.761755486019113,
      },
      {
        x: 17.576459920642765,
        y: 8.061689769635127,
        z: 8.265982854571803,
      },
    ];

    let obj = this.create_path(
      {
        points,
        imgUrl: "/021-箭头.png",
        radius: 0.5,
        divisions: 200,
      },
      scene
    );
    console.log(obj);
    scene.add(obj.path);
    obj.start();

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      // transformY.value -= 0.01;
    }
    render();
  }

  new_path_animation(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const box = new THREE.BoxGeometry(1, 1, 1);
    const boxMesh = new Mesh(box, [
      new MeshLambertMaterial({ color: 0x0000ff }),
      new MeshLambertMaterial({ color: 0xff00ff }),
      new MeshLambertMaterial({ color: 0xddffff }),
      new MeshLambertMaterial({ color: 0xddeeff }),
      new MeshLambertMaterial({ color: 0x00fdff }),
      new MeshLambertMaterial({ color: 0xcc00ff }),
    ]);
    scene.add(boxMesh);
    let points = [
      {
        x: 7.602154318249855,
        y: 7.921453849076141,
        z: 6.721410476616342,
      },
      {
        x: 10.148048025924078,
        y: 9.80519616030863,
        z: -3.687171295945351,
      },
      {
        x: 17.196987884977865,
        y: 10.367155161070908,
        z: -1.7331112243968336,
      },
      {
        x: 21.676960221577954,
        y: 6.7777302427081665,
        z: 2.761755486019113,
      },
      {
        x: 17.576459920642765,
        y: 8.061689769635127,
        z: 8.265982854571803,
      },
    ];
    let animation = this.create_path_animation({
      points,
      mesh: boxMesh,
      isClosed: true,
      isRepeat: true,
      speed: 0.3,
    });
    animation.start();

    scene.add(animation.line);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  getCurvePathByPoints(points, radius, isClosed) {
    let vec3Points = points.map((item) => new THREE.Vector3().copy(item));
    let curvePath = new THREE.CurvePath();
    let linePoints = [];

    // 1、算出每个点对应的贝塞尔曲线需要的四个点
    for (let i = 0; i < vec3Points.length; i++) {
      let p1 = vec3Points[i],
        p2 = vec3Points[(i + 1) % vec3Points.length];

      let side = new THREE.Vector3().subVectors(p2, p1).normalize();

      let p11 = new THREE.Vector3().addVectors(p1, side);
      let p12 = new THREE.Vector3().addVectors(
        p1,
        new THREE.Vector3().copy(side).multiplyScalar(radius)
      );
      let p22 = new THREE.Vector3().addVectors(
        p2,
        new THREE.Vector3().copy(side).negate()
      );
      let p23 = new THREE.Vector3().addVectors(
        p2,
        new THREE.Vector3().copy(side).negate().multiplyScalar(radius)
      );

      // 顺时针
      linePoints.push(p12);
      linePoints.push(p11);
      linePoints.push(p22);
      linePoints.push(p23);
    }
    // 2、把上面算出的点连起来
    if (isClosed) {
      for (let i = 0; i < linePoints.length; i += 4) {
        // 贝塞尔曲线
        let p1 = linePoints[(i + 1) % linePoints.length],
          p2 = linePoints[(i + 2) % linePoints.length],
          p3 = linePoints[(i + 3) % linePoints.length],
          p4 = linePoints[(i + 4) % linePoints.length],
          p5 = linePoints[(i + 5) % linePoints.length];

        let straight = new THREE.LineCurve3(p1, p2);
        curvePath.add(straight);

        let beize = new THREE.CubicBezierCurve3(p2, p3, p4, p5);
        curvePath.add(beize);
      }
    } else {
      let p1 = vec3Points[0],
        p2 = linePoints[1];
      let straight1 = new THREE.LineCurve3(p1, p2);
      curvePath.add(straight1);

      for (let i = 0; i < linePoints.length - 8; i += 4) {
        // 贝塞尔曲线
        let p1 = linePoints[(i + 1) % linePoints.length],
          p2 = linePoints[(i + 2) % linePoints.length],
          p3 = linePoints[(i + 3) % linePoints.length],
          p4 = linePoints[(i + 4) % linePoints.length],
          p5 = linePoints[(i + 5) % linePoints.length];

        let straight = new THREE.LineCurve3(p1, p2);
        curvePath.add(straight);

        let beize = new THREE.CubicBezierCurve3(p2, p3, p4, p5);
        curvePath.add(beize);
      }
      let p3 = linePoints[linePoints.length - 7],
        p4 = vec3Points[vec3Points.length - 1];
      let straight = new THREE.LineCurve3(p3, p4);
      curvePath.add(straight);
    }
    return curvePath;
  }

  create_path_animation(params) {
    const option = {
      points: [],
      isClosed: false,
      radius: 0, // 圆角，范围是0-1，实际意义是利用占比radius的线条来画圆角
      mesh: null,
      divisions: 200,
      speed: 0.1,
      isRepeat: false,
    };

    Object.assign(option, params || {});

    let curvePath = this.getCurvePathByPoints(
      option.points,
      option.radius,
      option.isClosed
    );

    const line = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true })
    );
    let positionArray = [];

    let clock = new THREE.Clock();
    const obj = {
      line,
      isStarted: false,
      start() {
        this.isStarted = true;
        clock.start();
        render();
      },
      stop() {
        clock.stop();
        this.isStarted = false;
      },
    };
    window.obj = obj;

    let percent = 0;
    let isDrawLine = true;
    function render() {
      obj.isStarted && option.mesh && requestAnimationFrame(render);

      let delta = clock.getDelta() * option.speed;

      percent = (percent + delta) % 1;
      // console.log(percent);

      // 0.99就够了，剩下的0.01留给看向前方的点
      if (!option.isRepeat && percent >= 0.99) {
        obj.isStarted = false;
        return;
      }
      let pos = curvePath.getPointAt(percent);
      option.mesh.position.copy(pos);

      // 看向前方
      let prePercent = percent + 0.01 > 1 ? 1 : percent + 0.01;
      let targetPosition = curvePath.getPointAt(prePercent);
      option.mesh.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);

      // 只允许写一圈线的点坐标
      if (isDrawLine) {
        positionArray.push(pos.x);
        positionArray.push(pos.y);
        positionArray.push(pos.z);
        line.geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(positionArray), 3)
        );
      }

      if (percent == 1) isDrawLine = false;
    }

    return obj;
  }

  create_path(params, scene) {
    let option = {
      points: [],
      imgUrl: "", // 贴图路径
      isClosed: false,
      radius: 0.5, // 范围0-1，实际意义是圆角的贝塞尔曲线控制点，贝塞尔曲线的起始终止点都是 1
      divisions: 200, // 默认分段数
    };
    Object.assign(option, params);

    let curvePath = this.getCurvePathByPoints(
      option.points,
      option.radius,
      option.isClosed
    );

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curvePath.getPoints(50)),
      new THREE.LineBasicMaterial({ color: 0x00ffff })
    );
    scene.add(line);

    let pathGeometry = new MyPathGeometry(
      curvePath,
      option.divisions,
      option.isClosed
    );

    let bg = { value: null };
    new THREE.TextureLoader().load(option.imgUrl, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      bg.value = texture;
    });

    let transformY = {
      value: 0,
    };

    let material = new THREE.ShaderMaterial({
      uniforms: {
        bg,
        transformY,
      },
      vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      uniform sampler2D bg;
      varying vec2 vUv;
      uniform float transformY;
      void main(){
        gl_FragColor = texture2D(bg, vec2(vUv.x, vUv.y + transformY));
      }
      
      `,
      side: THREE.DoubleSide,
    });

    let path = new THREE.Mesh(pathGeometry, material);

    let clock = new THREE.Clock();

    const obj = {
      path,
      isStarted: false,
      start() {
        this.isStarted = true;
        render();
      },
      stop() {
        this.isStarted = false;
      },
    };

    function render() {
      obj.isStarted && requestAnimationFrame(render);

      transformY.value -= clock.getDelta();
    }

    return obj;
  }

  async uv_study(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let arr = [
      [-1, 0, 0],
      [1, 0, 0],

      [-1, 2, 0],
      [1, 2, 0],

      [-1, 4, 0],
      [1, 4, 0],
    ];

    let geometry = new THREE.BufferGeometry().setFromPoints(
      arr.map((item) => new THREE.Vector3(item[0], item[1], item[2]))
    );

    let uv = [0, 0, 1, 0, 0, 1.5, 1, 1.5, 0, 3, 1, 3];
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));

    let index = [0, 1, 2, 2, 1, 3, 3, 2, 4, 4, 3, 5];
    // geometry.index = new THREE.Uint16BufferAttribute(index, 1);
    geometry.setIndex(index);

    let bg = await new THREE.TextureLoader().loadAsync("/bali_small.jpeg");
    bg.wrapS = bg.wrapT = THREE.RepeatWrapping;
    bg.offset.y += 0.5;

    let material = new THREE.ShaderMaterial({
      uniforms: {
        bg: {
          value: bg,
        },
      },
      vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      uniform sampler2D bg;
      varying vec2 vUv;
      void main(){
        gl_FragColor = texture2D(bg, vec2(vUv.x, vUv.y + 0.1));
      }
      
      `,
      side: THREE.DoubleSide,
    });
    let mat = new THREE.MeshBasicMaterial({
      map: bg,
    });
    mat.onBeforeCompile = (shader) => {
      console.log(shader);
    };
    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);
    mesh.position.set(0, 7, 0);

    let mesh1 = new THREE.Mesh(geometry, material);
    scene.add(mesh1);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  blingbling(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        let obj = gltf.scene.getObjectByName("35kv开关室");
        await scene.add(obj);
        let equip = obj.getObjectByName("#1主变35kv开关");

        let red = {
          value: 0.0,
        };

        gsap.to(red, {
          value: 0.6,
          repeat: -1,
          yoyo: true,
          duration: 1,
        });

        equip.children.forEach((mesh) => {
          let mat = (mesh.material = mesh.material.clone());
          if (mat.isMaterial) {
            mat.onBeforeCompile = (shader) => {
              let uniforms = {
                red,
              };
              Object.assign(shader.uniforms, uniforms);
              const vertex = `
    
                void main(){
              `;
              const vertexShader = `
                }
              `;

              const fragment = `
                  uniform float red;
                  void main(){
              `;
              const fragmentColor = `
                  gl_FragColor.r = max(red, gl_FragColor.r);
                }
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
                "}",
                vertexShader
              );
              shader.vertexShader = shader.vertexShader.replace(
                "void main() {",
                vertex
              );
            };
          }
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

  vague(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        let obj = gltf.scene.getObjectByName("主楼1_4");
        await scene.add(obj);
        console.log(obj);
        obj.material.onBeforeCompile = (shader) => {
          console.log(shader);
          const vertex = `
             attribute float size;
     
             void main(){
           `;
          const vertexShader = `
               
             }
           `;

          const fragment = `
               void main(){
           `;
          const fragmentColor = `
             }
           `;

          shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            fragment
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "}",
            fragmentColor
          );
          shader.vertexShader = shader.vertexShader.replace("}", vertexShader);
          shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            vertex
          );
        };
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

  new_path(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    const initialPoints = [
      { x: 1, y: 0, z: -1 },
      { x: 1, y: 0, z: 1 },
      { x: -1, y: 0, z: 1 },
      { x: -1, y: 0, z: -1 },
    ];
    let curveHandles = [];
    const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    for (const handlePos of initialPoints) {
      const handle = new THREE.Mesh(boxGeometry, boxMaterial);
      handle.position.copy(handlePos);
      curveHandles.push(handle);
      scene.add(handle);
    }

    const curve = new THREE.CatmullRomCurve3(
      curveHandles.map((handle) => handle.position)
    );

    curve.curveType = "centripetal";
    curve.closed = true;

    const points = curve.getPoints(50);

    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(line);

    let dragstart = () => {
      controls.enabled = false;
    };

    let dragend = (event) => {
      controls.enabled = true;

      const points = curve.getPoints(50);
      line.geometry.setFromPoints(points);
      console.log(123);
    };

    let dragControls = new DragControls(
      curveHandles,
      camera,
      renderer.domElement
    );
    dragControls.addEventListener("dragstart", dragstart);
    dragControls.addEventListener("dragend", dragend);

    const light2 = new THREE.AmbientLight(0x003973);
    light2.intensity = 1.0;
    scene.add(light2);

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );

    scene.add(box);
    box.position.set(10, 10, 10);

    let controls1 = new TransformControls(camera, renderer.domElement);
    controls1.addEventListener("mouseDown", (event) => {
      if (!event.value) {
        console.log("down", event);
        controls.enabled = false;
      }
    });
    controls1.addEventListener("mouseUp", (event) => {
      if (!event.value) {
        console.log("up", event);
        controls.enabled = true;
      }
    });
    controls1.attach(box);
    scene.add(controls1);

    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
    });

    const points1 = [];
    points1.push(new THREE.Vector3(-10, 0, 0));
    points1.push(new THREE.Vector3(0, 10, 0));
    points1.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points1);

    const line1 = new THREE.Line(geometry, material);
    scene.add(line1);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  practice(renderer) {
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    camera.position.set(0, 0, 173);
    controls.update();

    const width = 100,
      height = 100;

    let material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: `
      
      void main(){
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
        uniform vec2 uResolution;
        void main(){
          vec2 st = gl_FragCoord.xy / uResolution;
          st -= 0.5;
          st.x *= uResolution.x / uResolution.y;
          float r = length(st);
          float d = smoothstep(.3,.3,r);
          gl_FragColor = vec4(d,d,d, 1.0);
        }
      `,
    });

    let plane = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      material
    );
    // plane.rotateX(Math.pI * 0.5);
    scene.add(plane);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  async label_move(renderer) {
    renderer.setClearColor(0xcccccc, true);

    const d = 0; // 移动的距离

    let { scene, camera, controls } = this.loadBasic(renderer);

    // 模拟几个标签
    let labelList = [];
    await addLabel({ x: -10, y: 0, z: -5 });
    await addLabel({ x: 0, y: 0, z: 9.8 });
    await addLabel({ x: 20, y: 0, z: 0 });
    await addLabel({ x: 18, y: 0, z: 2 });
    await addLabel({ x: 0, y: 0, z: 0 });

    let arr = [
      { x: -10, z: -10 },
      { x: -10, z: 10 },
      { x: 10, z: 10 },
      { x: 20, z: 0 },
      { x: 10, z: -10 },
    ];
    let arrVectors = arr.map((item) => new THREE.Vector2(item.x, item.z));

    // 1、根据点数组创建多边形平面
    let shape = new THREE.Shape(arrVectors);
    let plane = new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshLambertMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
    );
    plane.rotateX(Math.PI * 0.5);
    scene.add(plane);

    // 2、得到中心点
    plane.geometry.computeBoundingSphere();
    plane.geometry.computeBoundingBox();
    let { center } = plane.geometry.boundingSphere;
    let centerP = new THREE.Vector2(center.x, center.y);

    // 3、让标签沿着法线向中心点的方向移动
    let up = new THREE.Vector3(0, 1, 0);
    let sideArray = [];

    for (let i = 0; i < arr.length; i++) {
      let curP = new THREE.Vector2(arr[i].x, arr[i].z);
      let nextIndex = (i + 1) % arr.length;
      let nextP = new THREE.Vector2(arr[nextIndex].x, arr[nextIndex].z);

      // 得到边的二维向量
      let side2 = new THREE.Vector2();
      side2.subVectors(nextP, curP);
      let center = new THREE.Vector2();
      center.subVectors(nextP, centerP);

      let sign = side2.cross(center) > 0 ? 1 : -1;

      // 得到边的向量
      let side = new THREE.Vector3();
      side.subVectors(
        new THREE.Vector3(nextP.x, 0, nextP.y),
        new THREE.Vector3(curP.x, 0, curP.y)
      );

      // 得到法向量
      let normal = new THREE.Vector3();
      normal
        .crossVectors(up, side)
        .normalize()
        .multiplyScalar(Math.abs(d) * sign);

      sideArray.push({ curP, nextP, centerP, normal, sign });
    }

    // 4、检测标签是否撞墙，是的话自动移位
    labelList.forEach((mesh) => {
      let p = new THREE.Vector2(mesh.position.x, mesh.position.z);

      // 给标签构造一个最大包围矩形
      mesh.geometry.computeBoundingBox();
      let { min, max } = mesh.geometry.boundingBox;

      let r1 = (max.x - min.x) / 2,
        r2 = (max.z - min.z) / 2,
        r = r1 > r2 ? r1 : r2;

      let points = [
        new THREE.Vector2(mesh.position.x - r, mesh.position.z - r),
        new THREE.Vector2(mesh.position.x - r, mesh.position.z + r),
        new THREE.Vector2(mesh.position.x + r, mesh.position.z - r),
        new THREE.Vector2(mesh.position.x + r, mesh.position.z + r),
      ];

      let booleanArr = [];
      points.forEach((item) => {
        booleanArr.push(isPointInPolygon(item, arrVectors));
      });

      // 包围矩形的四个点 全在该多边形区域内
      if (booleanArr.every((item) => item)) {
        // to do
        // 包围矩形的四个点 全不在矩形内
      } else if (booleanArr.every((item) => !item)) {
        // to do
        // 包围矩形的四个点 不全在多边形区域内
      } else {
        for (let i = 0; i < sideArray.length; i++) {
          let item = sideArray[i];

          let { curP, nextP, centerP, normal } = item;

          // 该标签属于当前的边
          if (isPointInPolygon(p, [curP, nextP, centerP])) {
            // 移动标签位置
            mesh.position.add(normal);
          }
        }
      }
    });

    // 判断一个点是否在多边形内
    // point: Vector2, polygonPoints: Array<Vector2>
    function isPointInPolygon(point, polygonPoints) {
      let arr = [],
        len = polygonPoints.length;
      for (let i = 0; i < len; i++) {
        let cur = polygonPoints[i];
        let next = polygonPoints[(i + 1) % len];
        let line = new THREE.Vector2();
        line.subVectors(next, cur);

        let pointLine = new THREE.Vector2();
        pointLine.subVectors(point, cur);

        let is = line.cross(pointLine);
        arr.push(is);
      }

      return arr.every((item) => item >= 0) || arr.every((item) => item <= 0);
    }
    window.isPointInPolygon = isPointInPolygon;

    async function addLabel(position) {
      let baseWidth = 1;

      // 添加一个标签
      let texture = await new THREE.TextureLoader().loadAsync(
        "/fanControllerLabel.png"
      );
      let accept = texture.image.height / texture.image.width;
      let labelPlane = new THREE.Mesh(
        new PlaneGeometry(baseWidth, baseWidth * accept),
        new MeshLambertMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
        })
      );
      scene.add(labelPlane);
      labelPlane.position.set(position.x, position.y, position.z);

      labelList.push(labelPlane);
    }

    // let p1 = new THREE.Vector3(2,0,-2);
    // let p2 = new THREE.Vector3(2,0,2);

    // let lineGeometry = new THREE.BufferGeometry();
    // lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    //   p1.x, p1.y, p1.z,
    //   p2.x, p2.y, p2.z,
    // ], 3))
    // let line = new THREE.Line(
    //   lineGeometry,
    //   new THREE.LineBasicMaterial({color: 0x00ffff}),
    // )
    // scene.add(line)

    // let side = new THREE.Vector3();
    // let faxian = new THREE.Vector3();
    // let up = new THREE.Vector3(0,1,0);

    // side.subVectors( p1, p2 );
    // faxian.crossVectors( up, side ).normalize().multiplyScalar(4);

    // let box = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.5,0.5,0.5),
    //   new THREE.MeshLambertMaterial({color: 0x0000ff})
    // )
    // scene.add(box)
    // box.position.copy(faxian);

    function render() {
      labelList.forEach((mesh) => {
        mesh.lookAt(camera.position.x, mesh.position.y, camera.position.z);
      });

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  async canvas(renderer) {
    renderer.setClearColor(0x000000, true);

    let { scene, camera, controls } = this.loadBasic(renderer);

    const width = 2000, // 正方形canvas宽度
      gridNum = 15, // 每一行包含的贴图数量
      pointWidth = 3, // 随机点的宽度
      gridPointWidth = 2; // 网格点的宽度

    let gridWidth = width / gridNum; // 格子贴图的宽度
    let d = gridWidth / 4,
      num = width / d; // d: 每个格子的距离，num: 每一行需要的网格点的数量

    // 网格的canvas
    let gridCanvas = createCanvas();
    let gridCtx = gridCanvas.getContext("2d");

    // 随机点的canvas
    let pointCanvas = createCanvas();
    let pointCtx = pointCanvas.getContext("2d");

    // 网格点的canvas
    let gridPointCanvas = createCanvas();
    let gridPointCtx = gridPointCanvas.getContext("2d");

    // 添加网格
    let gridImg = await createImg("/grid.png");
    for (let i = 0; i < gridNum; i++) {
      for (let j = 0; j < gridNum; j++) {
        gridCtx.drawImage(
          gridImg,
          i * gridWidth,
          j * gridWidth,
          gridWidth,
          gridWidth
        );
      }
    }

    let pointImg = await createImg("/circle1.png");

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        // 添加网格点
        let x = i * d - gridPointWidth / 2 + d / 2;
        let y = j * d - gridPointWidth / 2 + d / 2;
        gridPointCtx.drawImage(pointImg, x, y, gridPointWidth, gridPointWidth);

        // 添加随机点
        let m = i * d,
          n = (i + 1) * d;
        let x1 = Math.random() * (n - m + 1) + m;
        let m2 = j * d,
          n2 = (j + 1) * d;
        let y1 = Math.random() * (n2 - m2 + 1) + m2;
        if (Math.random() > 0.7) {
          pointCtx.drawImage(pointImg, x1, y1, pointWidth, pointWidth);
        }
      }
    }

    let gridTexture = new THREE.CanvasTexture(gridCanvas);
    let pointTexture = new THREE.CanvasTexture(pointCanvas);
    let gridPointTexture = new THREE.CanvasTexture(gridPointCanvas);

    let geometry = new THREE.PlaneGeometry(500, 500);
    geometry.computeBoundingSphere();

    let { center, radius } = geometry.boundingSphere;

    let vTime = { value: 0.0 };
    let vTime1 = { value: 0.0 };
    let shader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        // 点的贴图
        pointBg: {
          value: pointTexture,
        },
        // 网格贴图
        gridBg: {
          value: gridTexture,
        },
        // 网格点贴图
        gridPointBg: {
          value: gridPointTexture,
        },
        // 透明圈宽度
        vRingRadius: {
          value: 15,
        },
        // 网格圈 内环和外环的宽度
        vPointBlurRadius: {
          value: 40,
        },
        vPointInnerRadius: {
          value: 40,
        },
        // 网格圈 内环和外环的宽度
        vBlurRadius: {
          value: 30,
        },
        vInnerRadius: {
          value: 30,
        },
        // 高亮的颜色
        vHighColor: {
          value: new THREE.Color("#00ffff"),
        },
        radius: {
          value: radius,
        },
        center: {
          value: center,
        },
        vTime,
        vTime1,
      },
      vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main(){
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      
      uniform sampler2D pointBg;
      uniform sampler2D gridBg;
      uniform sampler2D gridPointBg;
      uniform float vRingRadius;
      uniform float vInnerRadius;
      uniform float vBlurRadius;
      uniform float vPointInnerRadius;
      uniform float vPointBlurRadius;
      uniform float radius;
      uniform vec3 center;
      uniform float vTime;
      uniform float vTime1;
      uniform vec3 vHighColor;
      varying vec2 vUv;
      varying vec3 vPosition;

      void addRing(float offsetWidth, bool isInner){
        float moveR = mod(vTime1 + offsetWidth, radius);

        float edge0 = moveR - vRingRadius;
        float edge1 = moveR;

        float curR = distance(center, vPosition);

        if(curR > edge0 && curR < edge1){

          float percent = (curR - edge0) / (edge1 - edge0);
          float w = isInner ? percent : (1.0 - percent);
          if(gl_FragColor.r != 0.0){
            gl_FragColor.rgb = vec3(mix(gl_FragColor.rgb, mix(vec3(0.0), vHighColor , gl_FragColor.w), w));
          }else{
            gl_FragColor += vec4(mix(gl_FragColor.rgb, vHighColor, w), 0.03);
          }
        }

        float edge2 = moveR - vPointInnerRadius;
        float edge3 = moveR + vPointBlurRadius;

        if(curR > edge2 && curR < edge3 && gl_FragColor.r != 0.0){
          float pointPercent = smoothstep(edge2, edge1, curR) - smoothstep(edge1, edge3, curR);
          gl_FragColor.rgb = vec3(mix(gl_FragColor.rgb, vHighColor, pointPercent));
        }
      }
      void addDoubleRing(float offsetWidth, vec4 grid, vec4 gridPoint, bool isInner){
        vec4 mergeBg = grid + gridPoint;

        float moveR = mod(vTime + offsetWidth, radius);

        float edge0 = moveR - vInnerRadius;
        float edge1 = moveR;
        float edge2 = moveR + vBlurRadius;

        float curR = distance(center, vPosition);

        float d1 = 1.0 - smoothstep(edge1, edge2, curR);
        float d2 = smoothstep(edge0, edge1, curR);

        if(isInner){
          d1 = d1 * 0.6;
        }else{
          d2 = d2 * 0.6;
        }

        // 网格和点 与 高亮颜色的 混合
        vec3 high = mix(mergeBg.rgb, mix(vec3(0.0), vHighColor, mergeBg.w), 1.0);

        if(curR < edge1 && curR > edge0 && grid.w != 0.0){

          gl_FragColor = vec4(mix(gridPoint.rgb, high, d2),max(d2, gl_FragColor.w));

        }else if(curR < edge2 && curR > edge1 && grid.r != 0.0){
          
          gl_FragColor = vec4(mix(gridPoint.rgb, high, d1),max(d1, gl_FragColor.w));
          
        }
      }

      void main(){
        vec4 grid = texture2D(gridBg, vUv);
        vec4 gridPoint = texture2D(gridPointBg, vUv);
        vec4 point = texture2D(pointBg, vUv);
        // gridPoint.w *= 0.4;
        // point.w *= 0.3;
        gl_FragColor = gridPoint + point;
        addRing(radius * 0.6, true);
        addRing(radius * 0.9, false);

        addDoubleRing(0.0, grid, gridPoint, true);
        addDoubleRing(radius * 0.5, grid, gridPoint, false);

        // gl_FragColor = texture2D(pointBg, vUv);
      }
      `,
    });
    let plane = new THREE.Mesh(geometry, shader);
    plane.rotateX(-Math.PI * 0.5);
    scene.add(plane);

    function createCanvas() {
      let canvas = document.createElement("canvas");
      canvas.setAttribute(
        "style",
        `
        width:${width}px;
        height:${width}px;
        position:absolute;
        top:0;
        left:0;
        border:solid 1px #00ffff;
        background: rgb(0,7,14);
      `
      );
      canvas.width = width;
      canvas.height = width;
      return canvas;
    }
    async function createImg(src) {
      let img;
      await new Promise((resolve) => {
        img = new Image();
        img.src = src;
        img.onload = () => {
          resolve();
        };
      });
      return img;
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      vTime.value += 0.3;
      vTime1.value += 0.6;
    }
    render();
  }
  async test(renderer) {
    renderer.setClearColor(0x000000, true);

    let { scene, camera, controls } = this.loadBasic(renderer);

    // let tar = {
    //   x: -34.342292326577,
    //   y: 3.208379938865189,
    //   z: 9.692377403858826,
    // };
    // controls.target.set(tar.x, tar.y, tar.z);
    // let car = {
    //   x: -28.097513095683766,
    //   y: 75.7305304806959,
    //   z: 8.423887582791858,
    // };
    // camera.position.set(car.x, car.y, car.z);
    // controls.update();

    let labelGroup = new THREE.Group();
    scene.add(labelGroup);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let _small = { value: -6.9 };
    let _big = { value: 10.1 };
    let _d = { value: 0.1 };
    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        // let group = gltf.scene.getObjectByName('内墙')
        // scene.add(group);

        // setBright(group)

        scene.add(gltf.scene);

        // 镜岭
        // scene.getObjectByName('屋顶1').visible = false;
        // scene.getObjectByName('屋顶2').visible = false;

        // setTransparent('房屋1')
        // setTransparent('房屋2')
        // let obj = {
        //   0: {
        //     small: -6.9,
        //     big: 10.1
        //   },
        //   1: {
        //     small: -6.9,
        //     big: 10.1
        //   },
        //   2: {
        //     small: -6.9,
        //     big: 10.1
        //   }
        // }

        // 沙溪
        scene.getObjectByName("主楼屋顶").visible = false;
        let obj = {
          0: {
            small: 3.1,
            big: 25.1,
          },
          1: {
            small: 27.1,
            big: 51.1,
          },
          2: {
            small: 51.1,
            big: 53.1,
          },
        };
        setTransparent("主楼1");
        setTransparent("主楼2");
        // let baseWidth = 1;

        // 塔山
        // scene.getObjectByName('屋顶1').visible = false;
        // scene.getObjectByName('屋顶2').visible = false;
        // setTransparent('主体1')
        // setTransparent('主体2')
        // setTransparent('主体3')
        // let obj = {
        // 0: {
        //   small: -24.9,
        //   big: -12.9
        // },
        // 1: {
        //   small: -11.9,
        //   big: 13.1
        // },
        // 2: {
        //   small: 21.1,
        //   big: 23.1
        // }
        // }
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

    function setBright(group) {
      group.traverse((mesh) => {
        if (mesh.material?.isMaterial) {
          mesh.material.onBeforeCompile = (shader) => {
            const uniforms = { d: _d };
            Object.assign(shader.uniforms, uniforms);
            const vertex = `
              varying vec4 vPosition;
              void main(){
            `;
            const vertexColor = `
                vPosition = projectionMatrix * vec4(position, 1.0);
              }
            `;
            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              vertex
            );

            shader.vertexShader = shader.vertexShader.replace("}", vertexColor);
            const fragment = `
            uniform float d;
              void main(){
            `;
            const fragmentColor = `
                gl_FragColor = vec4(gl_FragColor.r+d, gl_FragColor.g+d, gl_FragColor.b+d, gl_FragColor.a);
                
              }
            `;
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              fragment
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              "}",
              fragmentColor
            );
          };
        }
      });
    }

    const gui = new GUI();

    gui.add(_d, "value", 0, 1, 0.1).listen();

    // let _small = {value: 1.1}
    // gui.add(_small, "value").name('small').listen();
    // let _big = {value: 10.1}
    // gui.add(_big, "value").name('big').listen();

    function setTransparent(_name) {
      let group = scene.getObjectByName(_name);

      group.traverse((mesh) => {
        if (mesh.material?.isMaterial) {
          mesh.material = mesh.material.clone();

          mesh.material.transparent = true;

          mesh.material.onBeforeCompile = (shader) => {
            const uniforms = { _small, _big };
            Object.assign(shader.uniforms, uniforms);
            const vertex = `
              varying vec4 vPosition;
              void main(){
            `;
            const vertexColor = `
                vPosition = projectionMatrix * vec4(position, 1.0);
              }
            `;
            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              vertex
            );

            shader.vertexShader = shader.vertexShader.replace("}", vertexColor);
            const fragment = `
              varying vec4 vPosition;
              uniform float _small;
              uniform float _big;
              void main(){
            `;
            const fragmentColor = `
              if(vPosition.y > _small && vPosition.y < _big){
                  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.2);
                }
              }
            `;
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              fragment
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              "}",
              fragmentColor
            );
          };
        }
      });
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  fire(renderer) {
    renderer.setClearColor(0x000000, true);

    let { scene, camera, controls } = this.loadBasic(renderer);

    var width = window.innerWidth,
      height = window.innerHeight;
    var fireRadius = 0.5;
    var fireHeight = 3;
    var particleCount = 400;
    var geometry0 = new Geometry(fireRadius, fireHeight, particleCount);
    var material0 = new Material({ color: 0xff2200 });
    material0.setPerspective(camera.fov, height);
    var particleFireMesh0 = new THREE.Points(geometry0, material0);
    // scene.add(particleFireMesh0);

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({
        color: 0xffff00,
      })
    );
    box.position.y = -0.3;
    // scene.add(box)

    let obj = create_fire({ camera });
    scene.add(obj.mesh);
    obj.start();

    let clock = new THREE.Clock();

    function render() {
      var delta = clock.getDelta();

      particleFireMesh0.material.update(delta * 0.75);

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();

    function create_fire(params) {
      const option = {
        fireRadius: 0.5,
        fireHeight: 3,
        particleCount: 400,
        color: 0xff2200,
        camera: null,
      };
      Object.assign(option, params);

      let height = window.innerHeight;
      let geometry0 = new Geometry(
        option.fireRadius,
        option.fireHeight,
        option.particleCount
      );
      let material0 = new Material({ color: 0xff2200 });
      material0.setPerspective(camera.fov, height);
      let mesh = new THREE.Points(geometry0, material0);

      const obj = {
        mesh,
        isStarted: false,
        start() {
          this.isStarted = true;
          render();
        },
        stop() {
          this.isStarted = false;
        },
      };
      let clock = new THREE.Clock();
      function render() {
        obj.isStarted && requestAnimationFrame(render);

        mesh.material.update(clock.getDelta() * 0.75);
      }
      return obj;
    }
  }

  async love(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let array = [];

    let pre = new THREE.Vector3(-2, 0, 0);

    for (let t = -2; t <= 2; t += 0.005) {
      let y = Math.acos(1 - Math.abs(t)) - 3.2;

      let cur = new THREE.Vector3(t, y, 0);
      let next = new THREE.Vector3();
      next.crossVectors(cur, pre);

      array.push(t);
      array.push(y);
      array.push(0);

      // array.push(next.x);
      // array.push(next.y);
      // array.push(next.z);
      pre = cur;
    }
    for (let t = 2; t >= -2; t -= 0.005) {
      let y = Math.sqrt(1 - Math.pow(Math.abs(t) - 1, 2));
      let cur = new THREE.Vector3(t, y, 0);
      let next = new THREE.Vector3();
      next.crossVectors(cur, pre).normalize();

      array.push(t);
      array.push(y);
      array.push(0);

      // array.push(next.x);
      // array.push(next.y);
      // array.push(next.z);
      pre = cur;
    }
    array.push(array[0]);
    array.push(array[1]);
    array.push(array[2]);

    let geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(array, 3)
    );

    let img = await new THREE.TextureLoader().loadAsync("爱心.png");

    let mesh = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.2,
        map: img,
        transparent: true,
      })
    );
    scene.add(mesh);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }
  ocean(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let streamPoints = [
      {
        x: 174.24676250869848,
        y: -1.4384303579241404,
        z: -92.34560152213483,
      },
      {
        x: 121.94277989120262,
        y: 0.01621134773585453,
        z: 3.0087496865637497,
      },
      {
        x: 101.47828091666524,
        y: 0.09258305732682715,
        z: 1.0576039959385755,
      },
      {
        x: 130.06752782936735,
        y: -0.6818734409543836,
        z: -49.41787393901901,
      },
      {
        x: 152.7990601035051,
        y: -1.3906980143931023,
        z: -96.9645390321471,
      },
    ];

    let streamArray = streamPoints.map(
      (item) => new THREE.Vector2(item.x, item.y)
    );
    let shape = new THREE.Shape(streamArray);

    let geometry = new THREE.ShapeGeometry(shape);
    let mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: 0x00ffff })
    );
    scene.add(mesh);
    // mesh.rotation.x = Math.PI * 0.5;
    mesh.position.y = 0;

    const gui = new GUI();
    const guiNode = { lerpPosition: 0 };

    gui.add(guiNode, "lerpPosition", 0, Math.PI * 2).onChange(function () {
      mesh.rotation.z = guiNode.lerpPosition;
    });

    window.mesh = mesh;
    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load("/shaxi-main.glb", async (gltf) => {
      scene.add(gltf.scene);
    });

    const waterGeometry = new THREE.PlaneGeometry(500, 500);

    let water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotateX(-Math.PI * 0.5);
    water.position.y = -4;

    // scene.add( water );

    let box = new THREE.BoxGeometry(1, 1, 1);
    let mesh1 = new THREE.Mesh(
      box,
      new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );
    mesh1.position.set(10, 10, 10);
    let meshList = [mesh1];
    scene.add(mesh1);

    let dragstart = (event) => {
      controls.enabled = false;
    };

    let dragend = (event) => {
      controls.enabled = true;
      let pos = event.object.position;
      console.log(event.object.name, pos);
    };
    let dragControls;

    let Controller = {
      startDrag: () => {
        dragControls = new DragControls(meshList, camera, renderer.domElement);
        dragControls.addEventListener("drag", () =>
          renderer.render(scene, camera)
        );

        // 3、把OrbitControls的dom元素替换掉
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // 4、避免两个控制器冲突
        dragControls.addEventListener("dragstart", dragstart);

        dragControls.addEventListener("dragend", dragend);
      },
      endDrag: () => {
        // 1、开启CSS3DRenderer
        // css2DRenderer.domElement.style.display = 'block'

        let obj = {};

        // 3、关闭拖拽控制器
        dragControls.removeEventListener("dragstart", dragstart);
        dragControls.removeEventListener("dragend", dragend);
        dragControls.dispose();

        // 4、还原OrbitControls
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
      },
    };

    Object.assign(window, { Controller });
    Controller.startDrag();

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      const time = performance.now() * 0.001;

      water.material.uniforms["time"].value += 1.0 / 60.0;
    }
    render();
  }
  createPointsPlane({
    width = 10,
    length = 10,
    density = 1,
    position = [0, 0, 0],
    pointColor = 0xcc8866,
  }) {
    const group = new THREE.Group();
    const rot = Math.PI / 2;

    {
      // 1、创建平面点
      const w = width / density + 1;
      const l = length / density + 1;

      for (let i = 0; i < w; i++) {
        for (let j = 0; j < l; j++) {
          const geometry = new THREE.CircleGeometry(0.05, 50);

          const material = new THREE.MeshPhongMaterial({
            color: pointColor,
            side: THREE.DoubleSide,
            polygonOffset: true,
          });
          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.set(i * density, j * density, 0);

          group.add(mesh);
        }
      }
    }
    {
      // 2、创建网格
      const axis = new THREE.GridHelper(width, length);
      const material = axis.material;
      material.transparent = true;
      material.opacity = 0.4;
      axis.rotation.x = -Math.PI / 2;

      axis.position.set(width / 2, length / 2, 0);
      group.add(axis);
    }
    {
      // 3、创建平面
      const planeGeometry = new THREE.PlaneGeometry(width, length);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
      });

      const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
      group.add(mesh);

      mesh.position.set(width / 2, length / 2, 0);
    }

    group.rotation.x = rot;

    group.position.set(position[0], position[1], position[2]);

    return group;
  }

  changeFog(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let pos = {
      x: 121.90667216988187,
      y: 36.41296479106111,
      z: -44.32224725055222,
    };
    camera.position.set(pos.x, pos.y, pos.z);
    controls.update();

    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 10, 0);
    scene.add(light);

    var parseColor = function (hexStr) {
      return hexStr.length === 4
        ? hexStr
            .substr(1)
            .split("")
            .map(function (s) {
              return 0x11 * parseInt(s, 16);
            })
        : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(
            function (s) {
              return parseInt(s, 16);
            }
          );
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
      return s.length === 1 ? "0" + s : s;
    };

    /*
        start 开始颜色
        end 结束颜色
        steps 颜色分解 次数
        gamma 暂时理解为透明一点（伽马）
    */
    var gradientColors = function (start, end, steps, gamma) {
      var i,
        j,
        ms,
        me,
        output = [],
        so = [];
      gamma = gamma || 1;
      var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
      };
      start = parseColor(start).map(normalize);
      end = parseColor(end).map(normalize);
      for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
          so[j] = pad(
            Math.round(
              Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255
            ).toString(16)
          );
        }
        output.push("#" + so.join(""));
      }
      return output;
    };

    let c1 = "#A4958E";
    let c2 = "#111D3E";
    let array = gradientColors(c1, c2, 100);
    console.log(array);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/tashan.glb",
      function (gltf) {
        scene.add(gltf.scene);

        let param = {
          delta: 0,
        };
        gsap.to(param, {
          delta: 99,
          duration: 5,
          yoyo: true,
          repeat: -1,
          onUpdate() {
            let c1 = "#A4958E";
            let c2 = "#111D3E";
            let i = Math.floor(param.delta);

            let color = array[i];

            scene.fog = new THREE.FogExp2(color, 0.01);
          },
        });

        // setTimeout(function(){
        //   scene.fog = new THREE.FogExp2(0x111D3E, 0.01);
        //   console.log('changed!');
        // }, 2000)
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

    let fog = new THREE.FogExp2("#A4958E", 0.01);

    scene.fog = fog;

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  temperature2(renderer) {
    let heatmapInstance = h337.create({
      container: document.querySelector("#box2"),
      radius: 100,
      gradient: {
        ".2": "#00ffff",
        ".6": "#00ff00",
        ".8": "#ffff00",
        ".95": "#ff0000",
      },
    });

    //构建一些随机数据点,网页切图价格这里替换成你的业务数据
    let points = [
      {
        x: 50,
        y: 200,
        value: 25,
      },
    ];
    let data = {
      max: 60,
      data: points,
    };
    //因为data是一组数据,web切图报价所以直接setData
    heatmapInstance.setData(data); //数据绑定还可以使用

    console.log(heatmapInstance);

    let { scene, camera, controls } = this.loadBasic(renderer);

    let light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);

    let texture = new THREE.CanvasTexture(
      document.querySelector("#box2").children[0]
    );

    let material = new THREE.MeshLambertMaterial({
      map: texture,
      // transparent: true,
      side: THREE.DoubleSide,
    });

    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 26), material);
    scene.add(mesh);
    mesh.rotateX(Math.PI * 0.5);
    let pos = {
      x: -51.96995664673806,
      y: 39.3,
      z: 13.383748148979855,
    };
    mesh.position.set(pos.x, pos.y, pos.z);

    let w = mesh.geometry.parameters.width / 2,
      h = mesh.geometry.parameters.height / 2;

    let posArray = [
      { x: pos.x - w, z: pos.z - h },
      { x: pos.x + w, z: pos.z - h },
      { x: pos.x + w, z: pos.z + h },
      { x: pos.x - w, z: pos.z + h },
    ];

    for (let item of posArray) {
      let box = new THREE.BoxGeometry(1, 1, 1);
      let _mesh = new THREE.Mesh(
        box,
        new THREE.MeshLambertMaterial({ color: 0x00ffff })
      );
      _mesh.position.set(item.x, pos.y, item.z);
      scene.add(_mesh);
    }
    console.log(posArray);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/jingling-main.glb",
      function (gltf) {
        scene.add(gltf.scene);

        scene.getObjectByName("屋顶1").visible = false;
        scene.getObjectByName("屋顶2").visible = false;

        // scene.getObjectByName('35kv开关室').traverse(mesh => {
        //   if(mesh?.material?.isMaterial){
        //     mesh.material.transparent = true;
        //     mesh.material.opacity = 0.2;
        //   }
        // })
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

    let box = new THREE.BoxGeometry(1, 1, 1);
    let _mesh = new THREE.Mesh(
      box,
      new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );
    _mesh.position.set(10, 10, 10);
    scene.add(_mesh);
    let meshList = [_mesh, mesh];

    let dragstart = (event) => {
      controls.enabled = false;
    };

    let dragend = (event) => {
      controls.enabled = true;
      let pos = event.object.position;
      console.log(event.object.name, pos);
    };
    let dragControls;

    let Controller = {
      startDrag: () => {
        dragControls = new DragControls(meshList, camera, renderer.domElement);
        dragControls.addEventListener("drag", () =>
          renderer.render(scene, camera)
        );

        // 3、把OrbitControls的dom元素替换掉
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // 4、避免两个控制器冲突
        dragControls.addEventListener("dragstart", dragstart);

        dragControls.addEventListener("dragend", dragend);
      },
      endDrag: () => {
        // 1、开启CSS3DRenderer
        // css2DRenderer.domElement.style.display = 'block'

        let obj = {};

        // 3、关闭拖拽控制器
        dragControls.removeEventListener("dragstart", dragstart);
        dragControls.removeEventListener("dragend", dragend);
        dragControls.dispose();

        // 4、还原OrbitControls
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
      },
    };

    Object.assign(window, { Controller });
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  computedWater(renderer, paramsOption) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    camera.position.set(0, 4, 15);
    controls.update();

    let obj = this.createWater();
    scene.add(obj.plane);

    scene.add(obj.group);

    obj.start();

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  createWater(paramsOption) {
    const defOption = {
      length: 8, // 水柱的长度
      height: 7, // 水柱的高度
      width: 3, // 底部矩形的宽
      depth: 4, // 底部矩形的高
      widthSegment: 5, // 底部矩形的宽度分段数
      depthSegment: 5, // 底部矩形的高度分段数
      color: 0xffffff, // 水柱颜色
      opacity: 0.8, // 水柱的透明度
      dashSize: 0.2, // 每段虚线的长度
      gapSize: 0.1, // 每段虚线的间隔
      speed: 0.02, // 虚线移动的速度，实际意义是每一帧移动的距离
    };

    const option = Object.assign(defOption, paramsOption || {});

    let plane = new THREE.Mesh(
      new THREE.PlaneGeometry(
        option.width,
        option.depth,
        option.widthSegment,
        option.depthSegment
      ),
      new MeshLambertMaterial({
        color: 0x0000ff,
        wireframe: true,
      })
    );
    plane.rotateX(Math.PI * 0.5);
    plane.position.x = option.length;
    plane.updateMatrixWorld();

    let points = [];
    let array = plane.geometry.getAttribute("position").array;
    for (let i = 0; i < array.length; i += 3) {
      let p = new THREE.Vector3(array[i], array[i + 1], array[i + 2]);
      p.applyMatrix4(plane.matrixWorld);
      points.push(p);
    }

    let material = new THREE.LineDashedMaterial({
      color: option.color,
      dashSize: option.dashSize,
      gapSize: option.gapSize,
      transparent: true,
      opacity: option.opacity,
    });
    let _shader;
    material.onBeforeCompile = (shader) => {
      _shader = shader;

      shader.uniforms.time = {
        value: 0,
      };
      const vertex = `
        uniform float time;
        void main() {
      `;
      const vertexShader = `
        vLineDistance = scale * lineDistance + time;
      `;
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        vertex
      );
      shader.vertexShader = shader.vertexShader.replace(
        "vLineDistance = scale * lineDistance",
        vertexShader
      );
    };

    const group = new THREE.Group();

    const start = new THREE.Vector3(0, option.height, 0);

    for (let end of points) {
      let d1 = start,
        d2 = new THREE.Vector3(
          (start.x + end.x) / 2,
          start.y,
          (start.z + end.z) / 2
        ),
        d3 = new THREE.Vector3(end.x, (start.y + end.y) / 2, end.z),
        d4 = end;

      let line = new THREE.CubicBezierCurve3(d1, d2, d3, d4);

      const linePoints = line.getPoints(50);
      const curveObject = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePoints),
        material
      );
      curveObject.computeLineDistances();
      group.add(curveObject);
    }

    const obj = {
      group,
      plane,
      isStarted: false,
      start() {
        this.isStarted = true;
        render();
      },
      stop() {
        this.isStarted = false;
      },
    };
    let clock = new THREE.Clock();
    function render() {
      obj.isStarted && requestAnimationFrame(render);

      if (_shader) _shader.uniforms.time.value -= clock.getDelta();
    }
    return obj;
  }

  fire1(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);

    let stats;

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        2,
        2000
      );
      camera.position.x = 0;
      camera.position.y = 100;
      camera.position.z = -300;

      // scene = new THREE.Scene();
      // scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

      // geometries

      const teapotGeometry = new THREE.BoxGeometry(20, 20, 20, 1, 10, 10, 10);
      const sphereGeometry = new THREE.SphereGeometry(100, 130, 16);

      const geometry = new THREE.BufferGeometry();

      // buffers

      const speed = [];
      const intensity = [];
      const size = [];

      const positionAttribute = teapotGeometry.getAttribute("position");
      const particleCount = positionAttribute.count;

      for (let i = 0; i < particleCount; i++) {
        speed.push(20 + Math.random() * 50);

        intensity.push(Math.random() * 0.15);

        size.push(30 + Math.random() * 230);
      }

      geometry.setAttribute("position", positionAttribute);
      geometry.setAttribute(
        "targetPosition",
        sphereGeometry.getAttribute("position")
      );
      geometry.setAttribute(
        "particleSpeed",
        new THREE.Float32BufferAttribute(speed, 1)
      );
      geometry.setAttribute(
        "particleIntensity",
        new THREE.Float32BufferAttribute(intensity, 1)
      );
      geometry.setAttribute(
        "particleSize",
        new THREE.Float32BufferAttribute(size, 1)
      );

      // maps

      // Forked from: https://answers.unrealengine.com/questions/143267/emergency-need-help-with-fire-fx-weird-loop.html

      const fireMap = new THREE.TextureLoader().load(
        "textures/sprites/firetorch_1.jpg"
      );

      // nodes

      const targetPosition = new Nodes.AttributeNode("targetPosition", "vec3");
      const particleSpeed = new Nodes.AttributeNode("particleSpeed", "float");
      const particleIntensity = new Nodes.AttributeNode(
        "particleIntensity",
        "float"
      );
      const particleSize = new Nodes.AttributeNode("particleSize", "float");

      const time = new Nodes.TimerNode();

      const spriteSheetCount = new Nodes.ConstNode(new THREE.Vector2(6, 6));

      const fireUV = new Nodes.SpriteSheetUVNode(
        spriteSheetCount, // count
        new Nodes.PointUVNode(), // uv
        new Nodes.OperatorNode("*", time, particleSpeed) // current frame
      );

      const fireSprite = new Nodes.TextureNode(fireMap, fireUV);
      const fire = new Nodes.OperatorNode("*", fireSprite, particleIntensity);

      const lerpPosition = new Nodes.UniformNode(0);

      const positionNode = new Nodes.MathNode(
        Nodes.MathNode.MIX,
        new Nodes.PositionNode(Nodes.PositionNode.LOCAL),
        targetPosition,
        lerpPosition
      );

      // material

      const material = new Nodes.PointsNodeMaterial({
        depthWrite: false,
        transparent: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      });

      material.colorNode = fire;
      material.sizeNode = particleSize;
      material.positionNode = positionNode;

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // stats

      stats = new Stats();
      document.body.appendChild(stats.dom);

      // gui

      const gui = new GUI();
      const guiNode = { lerpPosition: 0 };

      gui.add(material, "sizeAttenuation").onChange(function () {
        material.needsUpdate = true;
      });

      gui.add(guiNode, "lerpPosition", 0, 1).onChange(function () {
        lerpPosition.value = guiNode.lerpPosition;
      });

      gui.open();

      // controls

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.maxDistance = 1000;
      controls.update();

      // events

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //

    function animate() {
      requestAnimationFrame(animate);

      render();
      stats.update();
    }

    function render() {
      nodeFrame.update();

      renderer.render(scene, camera);
    }
  }

  mouse_bloom(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    const pos = {
      x: -7.1473706000687365,
      y: 16.714516428609492,
      z: 13.815467561803132,
    };
    const target = {
      x: -6.824771217141079,
      y: 1.8003050411241583,
      z: -5.355257243029237,
    };
    camera.position.set(pos.x, pos.y, pos.z);
    controls.target.set(target.x, target.y, target.z);
    controls.update();
    controls.addEventListener("change", render);

    // controls.maxDistance = 2000; // 能够将相机向外移动多少
    // controls.minDistance = 300; // 能够将相机向里移动多少
    // controls.minPolarAngle = 1.4645096607652575; // 能够垂直旋转的角度的上限
    // controls.maxPolarAngle = 1.4645096607652575; // 能够垂直旋转的角度的上限
    // controls.minAzimuthAngle = 0; // 能够水平旋转的角度下限
    // controls.maxAzimuthAngle = 0; // 能够水平旋转的角度上限
    // controls.enableDamping = true; // 将其设置为true以启用阻尼（惯性），这将给控制器带来重量感

    // let light = new THREE.PointLight(0xffffff);
    // light.position.y = 200;
    // scene.add(light);
    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    const ENTIRE_SCENE = 1,
      BLOOM_SCENE = 2;
    let children = [];

    let isVirtual = {
      value: 0,
    };
    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        await scene.add(gltf.scene);
        // scene.getObjectByName("屋顶1").removeFromParent();
        // scene.getObjectByName("屋顶2").removeFromParent();

        // scene.getObjectByName("35kv内墙").layers.toggle(BLOOM_SCENE);
        // scene.getObjectByName('D20_2').layers.toggle(BLOOM_SCENE);
        // // scene.getObjectByName('主楼1').layers.toggle(BLOOM_SCENE);
        // scene.getObjectByName('35kv开关室').traverse(mesh => {
        //   if(mesh.isMesh){
        //     mesh.layers.toggle(BLOOM_SCENE)
        //   }
        // });

        // let _mesh = scene.getObjectByName('保安室')
        // _mesh.children.forEach(mesh => {

        //   let lineGeometry = new THREE.EdgesGeometry(mesh.geometry);

        //   let line = new THREE.LineSegments(
        //     lineGeometry,
        //     new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 0.15, transparent: true })
        //   )

        //   mesh.parent.add(line)

        //   line.layers.toggle(BLOOM_SCENE);
        //   mesh.visible = false;
        //   // }
        // })
        // scene.getObjectByName('地形').visible = false
        // scene.getObjectByName('外场景').visible = false
        // scene.getObjectByName('水面').visible = false

        // let list = scene.getObjectByName('排风扇').children.map(item => {
        //   let name = item.name + '_2';
        //   let mesh = scene.getObjectByName(name)

        //   new TWEEN.Tween(mesh.rotation).to({
        //     y: mesh.rotation.y + Math.PI
        //   }, 1000).repeat(Infinity).start().onStart(val => {
        //     mesh.rotation.y = mesh.rotation.y + Math.PI;
        //   });

        //   return name
        // })
        // console.log(list);

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
    window.toggleVirtualMesh = toggleVirtualMesh;

    function toggleVirtualMesh(nameList) {
      for (let name of nameList) {
        let _mesh = scene.getObjectByName(name);
        // 还原
        if (_mesh.userData.isVirtual) {
          _mesh.userData.isVirtual = false;
          _mesh.children.forEach((mesh) => {
            if (mesh?.isMesh) {
              let line = scene.getObjectByName(mesh.uuid);
              line.removeFromParent();
              mesh.visible = true;
            }
          });
        } else {
          _mesh.userData.isVirtual = true;
          // 虚化
          _mesh.children.forEach((mesh) => {
            if (mesh?.isMesh) {
              let lineGeometry = new THREE.EdgesGeometry(mesh.geometry);
              let line = new THREE.LineSegments(
                lineGeometry,
                new THREE.LineBasicMaterial({
                  color: 0x00ffff,
                  opacity: 0.05,
                  transparent: true,
                })
              );
              line.name = mesh.uuid;
              mesh.parent.add(line);
              line.layers.toggle(BLOOM_SCENE);
              mesh.visible = false;
            }
          });
        }

        render();
      }
    }

    window.toggleVirtualTree = toggleVirtualTree;
    function toggleVirtualTree() {
      let tree = scene.getObjectByName("树");

      if (tree.userData.isVirtual) {
        tree.userData.isVirtual = false;
        tree.traverse((mesh) => {
          if (mesh?.material?.isMaterial) {
            mesh.material.wireframe = false;
            mesh.layers.toggle(BLOOM_SCENE);
          }
        });
        isVirtual.value = 0;
      } else {
        tree.userData.isVirtual = true;
        tree.traverse((mesh) => {
          if (mesh?.material?.isMaterial) {
            mesh.material.wireframe = true;
            mesh.layers.toggle(BLOOM_SCENE);
          }
        });
        isVirtual.value = 1;
      }
      render();
    }

    loader.load("/shaxi-tree.glb", async (gltf) => {
      await scene.add(gltf.scene);

      let tree = scene.getObjectByName("树");
      tree.traverse((mesh) => {
        if (mesh?.material?.isMaterial) {
          mesh.material.transparent = true;
          mesh.material.wireframe = false;

          mesh.material.onBeforeCompile = (shader) => {
            const uniforms = { isVirtual };
            Object.assign(shader.uniforms, uniforms);
            const fragment = `
              uniform float isVirtual;
              void main(){
            `;
            const fragmentColor = `
                if(isVirtual == 1.0){
                  gl_FragColor = vec4(0.0, 1.0, 1.0, 0.02);
                }
              }
            `;
            shader.fragmentShader = shader.fragmentShader.replace(
              "void main() {",
              fragment
            );

            shader.fragmentShader = shader.fragmentShader.replace(
              "}",
              fragmentColor
            );
          };
          // mesh.layers.toggle(BLOOM_SCENE);
        }
      });
    });

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
      scene: "Scene with Glow",
    };

    // renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    let t;
    new TextureLoader().load("/4.jpg", (texture) => {
      scene.background = texture;
      t = texture;
    });

    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const materials = {};
    // renderer.toneMapping = THREE.ReinhardToneMapping;

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
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
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    const gui = new GUI();

    const folder = gui.addFolder("Bloom Parameters");

    folder.add(params, "exposure", 0.1, 2).onChange(function (value) {
      renderer.toneMappingExposure = Math.pow(value, 4.0);
      render();
    });

    folder.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
      bloomPass.threshold = Number(value);
      render();
    });

    folder.add(params, "bloomStrength", 0.0, 100.0).onChange(function (value) {
      bloomPass.strength = Number(value);
      render();
    });

    folder
      .add(params, "bloomRadius", 0.0, 1.0)
      .step(0.01)
      .onChange(function (value) {
        bloomPass.radius = Number(value);
        render();
      });

    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2();

    // window.addEventListener('pointerdown', onPointerDown)

    setupScene();

    function onPointerDown(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      let children = scene
        .getObjectByName("灯")
        .children.map((item) => scene.getObjectByName(item.name + "_2"));
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE);
        render();
        console.log("点击了", object);
      }
    }

    function setupScene() {
      scene.traverse(disposeMaterial);

      render();
    }

    function render() {
      renderBloom(true);

      finalComposer.render();
    }

    function disposeMaterial(obj) {
      if (obj.material) {
        obj.material.dispose();
      }
    }

    function renderBloom(mask) {
      if (mask) {
        scene.traverse(darkenNonBloomed);

        scene.background = null;
        bloomComposer.render();
        scene.traverse(restoreMaterial);

        scene.background = t;
      } else {
        camera.layers.set(BLOOM_SCENE);
        bloomComposer.render();
        camera.layers.set(ENTIRE_SCENE);
      }
    }

    function darkenNonBloomed(obj) {
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    }
    function restoreMaterial(obj) {
      if (materials[obj.uuid]) {
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

        scene.getObjectByName("主体1").visible = false;
        scene.getObjectByName("主体2").visible = false;
        scene.getObjectByName("屋顶1").visible = false;
        scene.getObjectByName("屋顶2").visible = false;

        scene.getObjectByName("10kv\\35kv开关室").traverse((mesh) => {
          if (mesh.isMesh) {
            changeMat(mesh, true);
          }
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

    function changeMat(mesh, isVirtual, isAfter) {
      // mesh.visible = false;

      mesh.geometry.computeBoundingBox();

      let { min, max } = mesh.geometry.boundingBox;
      let height = max.y - min.y;

      mesh.material.transparent = true;

      if (isAfter) {
        for (let key in matObj) {
          matObj[key].uniforms.isVirtual.value = isVirtual;
        }
        lineGroup.visible = isVirtual;
        mesh.material.needsUpdate = true;
        return;
      }
      mesh.material = mesh.material.clone();
      mesh.material.onBeforeCompile = (shader) => {
        matObj[mesh.material.uuid] = shader;
        Object.assign(shader.uniforms, {
          uHeight: {
            value: height,
          },
          uColor: {
            value: new THREE.Color("#00ffff"),
          },
          maxOpacity: {
            value: 0.6,
          },
          isVirtual: {
            value: true,
          },
          minY: {
            value: min.y,
          },
          maxY: {
            value: max.y,
          },
        });

        const vertex = `
          varying vec3 vPosition;
          void main() {
            vPosition = position;`;
        const fragment = `
          uniform float uHeight;
          uniform vec3 uColor;
          uniform float maxOpacity;
          uniform float minY;
          uniform float maxY;
          uniform bool isVirtual;
          varying vec3 vPosition;
          void main() {`;
        const fragmentColor = `
          float dist = 1.0 - ((vPosition.y-minY) / uHeight);
          if(isVirtual){
            gl_FragColor = vec4(uColor, dist * maxOpacity);
          }
        }`;

        shader.vertexShader = shader.vertexShader.replace(
          `void main() {`,
          vertex
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          `void main() {`,
          fragment
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          `}`,
          fragmentColor
        );
      };
      if (!isVirtual) return;
      let geometry = new THREE.EdgesGeometry(mesh.geometry);

      let shader = new THREE.ShaderMaterial({
        uniforms: {
          vColor: {
            value: new THREE.Color("#00ffff"),
          },
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
        `,
      });

      let seg = new THREE.LineSegments(geometry, shader);

      // 获取物体的世界坐标 旋转等
      const worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);

      seg.position.copy(worldPosition);

      lineGroup.add(seg);
    }

    window.changeMat = changeMat;
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

    group.children.forEach((_mesh) => {
      let delta = Math.random() * (max.y - min.y + 1) + min.y;
      if (Math.random() > 0.5) _mesh.position.y += delta;
      else _mesh.position.y -= delta;
    });

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
  createRain(width, height, depth, paramsOption) {
    const defOption = {
      maxSpeed: 0.5, // 雨滴下落最大速度
      minSpeed: 0.1, // 雨滴下落最小速度
      length: 1, // 每个雨滴的长度
    };

    const option = Object.assign(defOption, paramsOption || {});

    let box = new THREE.Mesh(
      new THREE.BoxGeometry(width, height / 2, depth),
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

    group.children.forEach((_mesh) => {
      let delta = Math.random() * (max.y - min.y + 1) + min.y;
      if (Math.random() > 0.5) _mesh.position.y += delta;
      else _mesh.position.y -= delta;
    });

    const obj = {
      group,
      isStarted: false,
      start() {
        this.isStarted = true;
        render();
      },
      stop() {
        this.isStarted = false;
      },
    };

    let clock = new THREE.Clock();
    function render() {
      obj.isStarted && requestAnimationFrame(render);
      let delta = clock.getDelta();

      group.children.forEach((_mesh, index) => {
        // let maxNum = delta * 10, minNum = delta * 5;
        // let num = (Math.random() * (maxNum - minNum + 1) + minNum);
        // _mesh.position.y -=  num;
        _mesh.position.y -=
          Math.random() * (option.maxSpeed - option.minSpeed + 1) +
          option.minSpeed;

        if (_mesh.position.y < min.y) {
          _mesh.position.y = max.y;
        }
      });
    }
    return obj;
  }

  async temperature(renderer) {
    let { scene, camera, controls } = this.loadBasic(renderer);
    const pos = {
      x: -7.1473706000687365,
      y: 16.714516428609492,
      z: 13.815467561803132,
    };
    const target = {
      x: -6.824771217141079,
      y: 1.8003050411241583,
      z: -5.355257243029237,
    };
    camera.position.set(pos.x, pos.y, pos.z);
    controls.target.set(target.x, target.y, target.z);
    controls.update();

    // let light = new THREE.PointLight(0xffffff);
    // light.position.y = 200;
    // scene.add(light);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/jingling-main.glb",
      async (gltf) => {
        scene.add(gltf.scene);
        // scene.getObjectByName('主楼屋顶').removeFromParent();
        // scene.getObjectByName('屋顶2').visible = false;

        // g.rotateY(Math.PI * 0.3);
        // let obj = gltf.scene.getObjectByName("#3主变10kv开关");
        // obj.traverse((mesh) => {
        //   if (mesh.material) {
        //     mesh.material = mesh.material.clone();
        //     mesh.material.onBeforeCompile = (shader) => {
        //       const fragmentColor = `
        //         gl_FragColor.x = 0.3;}
        //       `;
        //       shader.fragmentShader = shader.fragmentShader.replace(
        //         "}",
        //         fragmentColor
        //       );
        //     };
        //   }
        //   // mesh?
        // });
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

    let box = new THREE.BoxGeometry(1, 1, 1);
    let mesh = new THREE.Mesh(
      box,
      new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );
    mesh.position.set(10, 10, 10);
    let meshList = [mesh];
    scene.add(mesh);

    // let wrapper = new THREE.Object3D();
    // wrapper.position.set(3,10,0);
    // wrapper.add(mesh)
    // mesh.position.set(-3,-10,0)

    // scene.add(wrapper)

    // let a = {
    //   val: 0
    // }
    // gsap.to(a, {
    //   val: 1,
    //   // yoyo: true,
    //   repeat: -1,
    //   duration: 2,
    //   onUpdate(v){
    //     wrapper.rotation.y = a.val * Math.PI;
    //   }
    // })

    let dragstart = (event) => {
      controls.enabled = false;
    };

    let dragend = (event) => {
      controls.enabled = true;
      let pos = event.object.position;
      console.log(event.object.name, pos);
    };
    let dragControls;

    let Controller = {
      startDrag: () => {
        dragControls = new DragControls(meshList, camera, renderer.domElement);
        dragControls.addEventListener("drag", () =>
          renderer.render(scene, camera)
        );

        // 3、把OrbitControls的dom元素替换掉
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // 4、避免两个控制器冲突
        dragControls.addEventListener("dragstart", dragstart);

        dragControls.addEventListener("dragend", dragend);
      },
      endDrag: () => {
        // 1、开启CSS3DRenderer
        // css2DRenderer.domElement.style.display = 'block'

        let obj = {};

        // 3、关闭拖拽控制器
        dragControls.removeEventListener("dragstart", dragstart);
        dragControls.removeEventListener("dragend", dragend);
        dragControls.dispose();

        // 4、还原OrbitControls
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
      },
    };

    Object.assign(window, { Controller });

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      TWEEN.update();
    }

    render();
  }

  technologe_sity(renderer) {
    renderer.setClearColor(new THREE.Color("#32373E"), 1);
    let { scene, camera, controls } = this.loadBasic(renderer);
    controls.enableDamping = true;

    camera.position.set(1200, 700, 121);
    controls.update();

    // let light = new THREE.PointLight(0xffffff);
    // light.position.y = 800;
    // scene.add(light);

    let vTime = {
      value: 0,
    };

    new FBXLoader().load("/shanghai.FBX", (group) => {
      scene.add(group);

      addShader();
      addGrowAnimation();
      setFloor(group);

      scene.getObjectByName("ROADS").visible = false;
    });

    function setFloor() {
      let floor = scene.getObjectByName("LANDMASS");
      floor.material.color.setStyle("#040912");
      scene.add(floor);
    }

    function addGrowAnimation() {
      let city = scene.getObjectByName("CITY_UNTRIANGULATED");
      city.scale.z = 0;
      gsap.to(city.scale, {
        z: 1,
        duration: 2,
      });
    }

    function addShader() {
      let city = scene.getObjectByName("CITY_UNTRIANGULATED");

      city.geometry.computeBoundingBox();
      city.geometry.computeBoundingSphere();

      let { radius, center } = city.geometry.boundingSphere;

      let { min, max } = city.geometry.boundingBox;
      let size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
      const material = city.material;

      material.transparent = true;
      material.color.setStyle("#1B3045");
      console.log(city.geometry);

      material.onBeforeCompile = (shader) => {
        let uniforms = {
          radius: {
            value: radius,
          },
          center: {
            value: center,
          },
          uSize: {
            value: size,
          },
          uTopColor: {
            value: new THREE.Color("#FFFFDC"),
          },
          vTime,
          vBlurRadius: {
            value: 50,
          },
          vRingWidth: {
            value: 100,
          },
          vHighColor: {
            value: new THREE.Color("#5588aa"),
          },
        };
        Object.assign(shader.uniforms, uniforms);

        const vertex = `
          varying vec3 vPosition;
          void main(){
            vPosition = position;
        `;

        const fragment = `
            varying vec3 vPosition;
            uniform float vRingWidth;
            uniform float vBlurRadius;
            uniform vec3 center;
            uniform float radius;
            uniform vec3 uTopColor;
            uniform vec3 uSize;
            uniform vec3 vHighColor;
            uniform float vTime;
            void main(){
        `;
        const fragmentColor = `
            vec3 distColor = outgoingLight;
            float indexMix = vPosition.z / (uSize.z * 0.6);
            distColor = mix(distColor, uTopColor, indexMix);
            gl_FragColor = vec4(distColor, 1.0);
            
            float startR = mod(vTime, radius);
            float endR = startR + vRingWidth;
            float r = distance(center, vPosition);

            if(r < endR && r > startR){

              float edge1 = startR;
              float edge2 = startR + vBlurRadius;
              float edge3 = endR - vBlurRadius;
              float edge4 = endR;

              if(r > edge2 && r < edge3){
                gl_FragColor = vec4(vHighColor, 1.0);
              }else{
                gl_FragColor = vec4(mix(distColor, vHighColor, smoothstep(edge1, edge2, r) - smoothstep(edge3, edge4, r)), 1.0);
              }

            }
          }
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

      vTime.value += 4;

      renderer.render(scene, camera);
      controls.update();
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
      depthwrite: false,
      depthTest: true,
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
    renderer.setClearColor(0x000000);
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
    ambientLight.intensity = 1;
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
        <div
          id="box2"
          style={{ width: "200px", height: "200px", position: "absolute" }}
        />

        <video id="motor_repeat" width="270" height="270" muted autoPlay loop>
          <source src={video}  />
        </video>
      </div>
    );
  }
}
