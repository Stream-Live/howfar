/*
 * @Author: Wjh
 * @Date: 2022-09-26 13:03:36
 * @LastEditors: Wjh
 * @LastEditTime: 2023-01-09 17:03:14
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

import * as Nodes from "three/nodes";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry.js";

import { nodeFrame } from "three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as TWEEN from "@tweenjs/tween.js";
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

import { MyPathGeometry } from '../path-libs/MyPathGeometry'
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js';
import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js';

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
    // this.rain(renderer)
    window.THREE = THREE;

    // this.temperature(renderer); // 设置设备温度
    // this.virtual(renderer); // 虚化
    // this.mouse_bloom(renderer); // 鼠标悬浮发光
    // this.fire1(renderer); // 火1

    // this.water(renderer)
    // this.computedWater(renderer)
    // this.temperature2(renderer); // 设置设备温度

    // this.changeFog(renderer);  // js实现颜色的线性插值

    // this.floor(renderer)  // 地板
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

    this.tweened_animation(renderer) // 渐变动画
  }
  async tweened_animation(renderer){

    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    let isTransparent = { value: 1 }

    let tMixTexture = {
      value: await new TextureLoader().loadAsync('/transition/transition3.png')
    }
    let mixRatio = {
      value: 0
    }

    window.isTransparent = isTransparent;

    loader.load(
      "/shaxi-main.glb",
      async function (gltf) {
        scene.add(gltf.scene);

        scene.getObjectByName('主楼屋顶').visible = false;

        setTransparent('内墙');
        setTransparent('主楼1');
        setTransparent('主楼2');

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
    
    function setTransparent(_name){

      let group = scene.getObjectByName(_name);

      group.traverse(mesh => {
        if(mesh.material?.isMaterial){
          mesh.material = mesh.material.clone();
          
          mesh.material.transparent = true;

          mesh.material.onBeforeCompile = (shader) => {

            const uniforms = { isTransparent, tMixTexture, mixRatio };
            Object.assign(shader.uniforms, uniforms);
            const vertex = `
            
              varying vec2 vUv1;
              void main(){
            `;
            const vertexColor = `
                vUv1 = uv;
              }
            `;
            shader.vertexShader = shader.vertexShader.replace(
              "void main() {",
              vertex
            );

            shader.vertexShader = shader.vertexShader.replace(
              "}",
              vertexColor
            );
            const fragment = `
              uniform float isTransparent;
              uniform sampler2D tMixTexture;
              uniform float mixRatio;
              varying vec2 vUv1;
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
          }
          
        }

      })
    }
    
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

    }
    render();
  }
  shine_test(renderer){
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    let customMaterial = new THREE.ShaderMaterial({
      uniforms: 
      { 
        // 外发光
        // "s":   { type: "f", value: 1.0},
        // "b":   { type: "f", value: 0.0},
        // "p":   { type: "f", value: 2.0 },
        // 内发光
        "s":   { type: "f", value: -1.0},
        "b":   { type: "f", value: 1.0},
        "p":   { type: "f", value: 2.0 },
        glowColor: { type: "c", value: new THREE.Color(0x00ffff) }
      },
      vertexShader:   `
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
      transparent: true
    })
    // let geometry = new THREE.BoxGeometry( 10, 10, 10 )
    let geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 32 )
    // let geometry = new THREE.SphereGeometry( 10,50, 50 )
    let torusKnot = new THREE.Mesh( geometry, customMaterial )
    scene.add( torusKnot )

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

    }
    render();
  }
  upgrade_bloom(renderer){
    
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1, BLOOM_SCENE_2 = 2;

    const bloomLayer = new THREE.Layers();
    bloomLayer.set( BLOOM_SCENE );

    const params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    };

    let uuid;
    const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    const materials = {};

    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const bloomComposer = new EffectComposer( renderer );
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
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
        defines: {}
      } ), 'baseTexture'
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( finalPass );

    // 添加物体
    let box = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({color: 0xffffff})
    )
    scene.add(box);
    box.layers.toggle(BLOOM_SCENE)

    let box1 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshLambertMaterial({color: 0xffffff})
    );
    box1.position.set(3, 0, 0)
    scene.add(box1)
    box1.layers.toggle(BLOOM_SCENE_2)
    box1.name = 'box1'

    function render() {
      requestAnimationFrame(render);

      scene.traverse( darkenNonBloomed );
      
      bloomComposer.render();
      scene.traverse( restoreMaterial );

      finalComposer.render();

    }
    render();

    function darkenNonBloomed( obj ) {

      if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

        if(obj.uuid == uuid) console.log(bloomLayer, obj.layers);

      }

    }

    function restoreMaterial( obj ) {

      if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

        if(obj.uuid == uuid) console.log(321);
      }

    }
  }

  lightning(renderer){
    renderer.setClearColor(0x000000);
    let { scene, camera, controls } = this.loadBasic(renderer);

    const conesDistance = 1000;
    const coneHeight = 200;
    const coneHeightHalf = coneHeight * 0.5;

    let pos1 = new THREE.Vector3(0,conesDistance + coneHeight,0);
    let pos2 = new THREE.Vector3(0,coneHeightHalf,0);

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
      straightness: 0.6

    };
    
    
    let lightningMaterial = new THREE.MeshBasicMaterial( { color: 0xB0FFFF } );
    let lightningStrike = new LightningStrike( rayParams );
    let lightningStrikeMesh = new THREE.Mesh( lightningStrike, lightningMaterial );

    scene.add(lightningStrikeMesh);

    let plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhongMaterial( { color: 0xC0C0C0, shininess: 0 } )
    )
    plane.rotateX(-Math.PI * 0.5)
    scene.add(plane)

    let light = new THREE.PointLight(0x00ffff, 1, 5000, 2)
    light.position.set(0,1,0)
    scene.add(light)
    
		const clock = new THREE.Clock();
    let currentTime = 0;
    
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      lightningStrike.rayParameters.sourceOffset.copy(pos1);
      lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
      lightningStrike.rayParameters.destOffset.copy(pos2);
      lightningStrike.rayParameters.destOffset.y += coneHeightHalf;

      currentTime += clock.getDelta()
      if(currentTime<0){
        currentTime = 0;
      }
      lightningStrike.update( currentTime );

    }
    render();
  }

  play(renderer){
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
      map: texture,//贴图
      color: 0xffff00,
      blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。加法
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

    const option = {
      isClosed: true,
      radius: 0.5, // 范围0-1，实际意义是圆角的贝塞尔曲线控制点，贝塞尔曲线的起始终止点都是 1
    };

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

    let vec3Points = points.map((item) => new THREE.Vector3().copy(item));

    // 1、绘制三维线条
    let curvePath1 = new THREE.CurvePath();
    let curvePath = new THREE.CurvePath();
    let linePoints = [];

    for (let i = 0; i < vec3Points.length; i++) {
      let p1 = vec3Points[i],
        p2 = vec3Points[(i + 1) % vec3Points.length];

      const lineCurve1 = new THREE.LineCurve3(p1, p2);
      curvePath1.add(lineCurve1);

      let side = new THREE.Vector3().subVectors(p2, p1).normalize();

      let p11 = new THREE.Vector3().addVectors(p1, side);
      let p12 = new THREE.Vector3().addVectors(
        p1,
        new THREE.Vector3().copy(side).multiplyScalar(option.radius)
      );
      let p22 = new THREE.Vector3().addVectors(
        p2,
        new THREE.Vector3().copy(side).negate()
      );
      let p23 = new THREE.Vector3().addVectors(
        p2,
        new THREE.Vector3().copy(side).negate().multiplyScalar(option.radius)
      );

      // 顺时针
      linePoints.push(p12);
      linePoints.push(p11);
      linePoints.push(p22);
      linePoints.push(p23);
    }
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

    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(curvePath.getPoints(50)),
      new THREE.LineBasicMaterial({ color: 0x00ffff })
    );
    scene.add(line);

    const line1 = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(curvePath1.getPoints(50)),
      new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    scene.add(line1);

    let pathGeometry = new MyPathGeometry(curvePath, 200);
    
    let bg = await new THREE.TextureLoader().loadAsync("/021-箭头.png");
    bg.wrapS = bg.wrapT = THREE.RepeatWrapping;

    let transformY = {
      value: 0
    }

    let material = new THREE.ShaderMaterial({
      uniforms: {
        bg: {
          value: bg,
        },
        transformY
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

    let path = new THREE.Mesh(pathGeometry, material)
    scene.add(path);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      transformY.value -= 0.01;
    }
    render();
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
    await addLabel({x: -10, y: 0, z: -5})
    await addLabel({x: 0, y: 0, z: 9.8})
    await addLabel({x: 20, y: 0, z: 0})
    await addLabel({x: 18, y: 0, z: 2})
    await addLabel({x: 0, y: 0, z: 0})

    let arr = [
      { x: -10, z: -10},
      { x: -10, z: 10},
      { x: 10, z: 10},
      { x: 20, z: 0},
      { x: 10, z: -10},
    ]
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
          transparent: true
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

    let _small = { value: -6.9}
    let _big = { value: 10.1}
    let _d = {value: 0.1}
    loader.load(
      "/jingling-main.glb",
      async function (gltf) {
        let group = gltf.scene.getObjectByName('内墙')
        scene.add(group);

        setBright(group)

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
        // scene.getObjectByName('主楼屋顶').visible = false; 
        // let obj = {
        //   0: {
        //     small: 3.1,
        //     big: 25.1
        //   },
        //   1: {
        //     small: 27.1,
        //     big: 51.1
        //   },
        //   2: {
        //     small: 51.1,
        //     big: 53.1
        //   }
        // }
        // setTransparent('主楼1')
        // setTransparent('主楼2')
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

    function setBright(group){

      group.traverse((mesh => {
        if(mesh.material?.isMaterial){
          mesh.material.onBeforeCompile = (shader) => {

            const uniforms = { d: _d, };
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

            shader.vertexShader = shader.vertexShader.replace(
              "}",
              vertexColor
            );
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
          }
        }


      }))
    }

    
    const gui = new GUI();
    
    gui.add(_d, "value", 0, 1, 0.1).listen();
    
    // let _small = {value: 1.1}
    // gui.add(_small, "value").name('small').listen();
    // let _big = {value: 10.1}
    // gui.add(_big, "value").name('big').listen();

    function setTransparent(_name){

      let group = scene.getObjectByName(_name);

      group.traverse(mesh => {
        if(mesh.material?.isMaterial){
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

            shader.vertexShader = shader.vertexShader.replace(
              "}",
              vertexColor
            );
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
          }
          
        }

      })
    }


    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
  }

  fire(renderer) {
    renderer.setClearColor(0x0000ff, true);

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
    scene.add(particleFireMesh0);

    let clock = new THREE.Clock();

    function render() {
      var delta = clock.getDelta();

      particleFireMesh0.material.update(delta * 0.75);

      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }
    render();
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
  async floor(renderer) {
    renderer.setClearColor(0x00000d, 1.0);

    let { scene, camera, controls } = this.loadBasic(renderer);

    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 20, 0);
    scene.add(light);

    let img1 = await new THREE.TextureLoader().loadAsync("/grid.png");
    img1.wrapS = THREE.RepeatWrapping;
    img1.wrapT = THREE.RepeatWrapping;
    img1.repeat.set(8, 8);

    let img2 = await new THREE.TextureLoader().loadAsync("/光1.png");
    img2.matrixAutoUpdate = false;
    img2.matrix.identity().scale(0.6, 0.6).translate(0.2, 0.2);
    // img2.needsUpdate = true;
    console.log(img2);

    const height = 100,
      width = 100;

    let pointGeometry = new THREE.BufferGeometry();
    let points = new THREE.Mesh(
      pointGeometry,
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );

    let pArray = [];
    for (let i = 0; i < (width * height) / 2; i++) {
      let m = 0,
        n = 100;
      pArray.push(Math.random() * (n - m + 1) - m);
      pArray.push(Math.random() * (n - m + 1) - m);
      pArray.push(Math.random() * (n - m + 1) - m);
    }
    // let pointMat = new THREE.ShaderMaterial({
    //   uniforms: {
    //     uColor: {
    //       value: new THREE.Color(0xffffff)
    //     }
    //   },
    //   vertexShader: `
    //     varying vPosition;
    //     void main(){
    //       vPosition = position;
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //     }
    //   `,
    //   fragmentShader: `
    //     void main(){
    //       gl_FragColor =
    //     }
    //   `
    // })

    let material = new MeshLambertMaterial({
      map: img1,
    });
    let geometry = new THREE.PlaneGeometry(width, height);
    let plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotateX(-Math.PI * 0.5);

    geometry.setAttribute(
      "p_position",
      new THREE.Float32BufferAttribute(pArray, 3)
    );
    console.log(geometry);

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    let { center, radius } = geometry.boundingSphere;
    let { max, min } = geometry.boundingBox;

    let size = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);

    let vTime = {
      value: 0,
    };
    material.transparent = true;
    material.onBeforeCompile = (shader) => {
      let uniforms = {
        img2: {
          value: img2,
        },
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
          value: 6,
        },
        vInnerRadius: {
          value: 6,
        },
        vRingWidth: {
          value: 12,
        },
        vHighColor: {
          value: new THREE.Color("#5588aa"),
        },
      };
      Object.assign(shader.uniforms, uniforms);

      const vertex = `
        varying vec3 vPosition;
        varying vec3 vP_Position;
        attribute vec3 p_position;
        void main(){
          vPosition = position;
          vP_Position = p_position;
      `;

      const fragment = `
          
          varying vec3 vPosition;
          varying vec3 vP_Position;
          uniform float vRingWidth;
          uniform float vInnerRadius;
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
          gl_FragColor.w = 0.0;
          
          float moveR = mod(vTime, radius);

          float edge0 = moveR - vInnerRadius;
          float edge1 = moveR;
          float edge2 = moveR + vBlurRadius;

          float curR = distance(center, vPosition);

          float d1 = 1.0 - (curR - edge1) / (edge2 - edge1);
          float d2 = (curR - edge0) / (edge1 - edge0);

          if(curR < edge1 && curR > edge0){
            gl_FragColor.w = d2 * 0.3;
          }
          if(curR < edge2 && curR > edge1){
            gl_FragColor.w = d1;
          }

          gl_FragColor.w *= 1.0 - smoothstep(radius * 0.5, radius * 0.7, curR);  // 接近半径长度的时候渐变消失
          
          if(distance(vP_Position, vPosition)<1.0){
            gl_FragColor = vec4(vHighColor, 1.0);
          }
        }
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        fragment
      );
      shader.fragmentShader = shader.fragmentShader.replace("}", fragmentColor);
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        vertex
      );
    };

    let stats = new Stats();
    document.body.appendChild(stats.dom);
    function render() {
      requestAnimationFrame(render);

      vTime.value += 0.1;
      renderer.render(scene, camera);
      stats.update();
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
            // console.log(color.replace('#', ''));

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
    // scene.add(obj.plane);

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
    function render() {
      obj.isStarted && requestAnimationFrame(render);

      if (_shader) _shader.uniforms.time.value -= option.speed;
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
      "/jingling-main.glb",
      async function (gltf) {
        await scene.add(gltf.scene);
        scene.getObjectByName("屋顶1").removeFromParent();
        scene.getObjectByName("屋顶2").removeFromParent();

        scene.getObjectByName("35kv内墙").layers.toggle(BLOOM_SCENE);
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

    // loader.load('/shaxi-tree.glb', async (gltf) => {
    //   await scene.add(gltf.scene);

    //   let tree = scene.getObjectByName('树');
    //   tree.traverse(mesh => {
    //     if (mesh?.material?.isMaterial) {
    //       mesh.material.transparent = true;
    //       mesh.material.wireframe = false;

    //       mesh.material.onBeforeCompile = (shader) => {
    //         const uniforms = {isVirtual};
    //         Object.assign(shader.uniforms, uniforms);
    //         const fragment = `
    //           uniform float isVirtual;
    //           void main(){
    //         `
    //         const fragmentColor = `
    //             if(isVirtual == 1.0){
    //               gl_FragColor = vec4(0.0, 1.0, 1.0, 0.02);
    //             }
    //           }
    //         `;
    //         shader.fragmentShader = shader.fragmentShader.replace(
    //           "void main() {",
    //           fragment
    //         )

    //         shader.fragmentShader = shader.fragmentShader.replace(
    //           "}",
    //           fragmentColor
    //         );
    //       }
    //       // mesh.layers.toggle(BLOOM_SCENE);

    //     }
    //   })
    // })

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

    console.log(group);
    // scene.add(group);

    let maxSpeed = 1,
      minSpeed = 0.2;
    function move() {
      group.children.forEach((_mesh, index) => {
        _mesh.position.y -=
          Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
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
  createRain(width, height, depth, paramsOption) {
    const defOption = {
      maxSpeed: 1.5, // 雨滴下落最大速度
      minSpeed: 0.2, // 雨滴下落最小速度
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

    function render() {
      obj.isStarted && requestAnimationFrame(render);

      group.children.forEach((_mesh, index) => {
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
      </div>
    );
  }
}
