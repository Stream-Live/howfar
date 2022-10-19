/*
 * @Author: Wjh
 * @Date: 2022-09-26 13:03:36
 * @LastEditors: Wjh
 * @LastEditTime: 2022-10-19 17:25:58
 * @FilePath: \howfar\src\MainPage\ShaderStudy2.js
 * @Description: 
 * 
 */
import React from "react";
import * as THREE from "three";
import { Mesh, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import TWEEN from "tween.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'


export default class ShaderStudy extends React.Component {

  componentDidMount() {
    this.draw();
  }
  draw() {

    const renderer = new THREE.WebGLRenderer({
      antialias: true   // 抗锯齿
    });
    document.getElementById("box").appendChild(renderer.domElement);

    // 开启Hidpi设置
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    // this.loadAnimation(renderer);
    // this.cloud(renderer);
    // this.transition(renderer);

    // this.bloom(renderer)
    // this.technologe_sity(renderer)
    this.rain(renderer)
    window.THREE = THREE
  }

  rain(renderer){

    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let {scene, camera, controls} = this.loadBasic(renderer);

    camera.position.set(50,50,60);
    controls.update();

    let light = new THREE.PointLight(0xffffff)
    light.position.y = 200
    scene.add(light)

    let box = new THREE.Mesh(new THREE.BoxGeometry(100,100,100), new THREE.MeshLambertMaterial({color: 0xffff00})) 
    // scene.add(box);
    box.geometry.computeBoundingBox();

    let {min,max} = box.geometry.boundingBox;
    let height = max.y - min.y;
    console.log(min,max)
    console.log(min.y, max.y);

    let geometry = new THREE.BufferGeometry();
    let arr = [];
    let geometries = [];

    let d = 1;
    let num = 16;

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, 
      opacity: 0.7
    });  
    const group = new THREE.Group();
    for(let i=0; i< 1000; i++){

      const pos = new THREE.Vector3();
      pos.x = Math.random() * (max.x - min.x) + min.x;
      pos.y = Math.random() * (max.y - min.y) + min.y;
      pos.z = Math.random() * (max.z - min.z) + min.z;

      // for(let j=0;j<num;j++){
      //   arr.push(pos.x);
      //   arr.push(pos.y + (d * j));
      //   arr.push(pos.z);
      // }

      const points = [];
      points.push( pos );
      points.push( new THREE.Vector3( pos.x, pos.y + d, pos.z ) );
      let g = new THREE.BufferGeometry().setFromPoints( points )
      let mesh = new THREE.Line(g, lineMat);
      mesh.name = 'line_'+i
      // scene.add(mesh);
      group.add(mesh);

    }
    

    const h = new THREE.BoxHelper(group)
    scene.add(h)
    // scene.add(group)
    console.log(group);
    scene.add(group)
    // let mergedGeometry = mergeBufferGeometries(geometries);
  
    // let mergedMesh = new THREE.Mesh(mergedGeometry, lineMat);
    // scene.add(mergedMesh)

    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));


    let shader = new THREE.ShaderMaterial({
      uniforms:{
        uSize: {
          value: 0.5
        },
        uTime: {
          value: 0
        },
        uHeight:{
          value: max.y - min.y
        }
      },
      vertexShader: `
        uniform float uSize;
        uniform float uTime;
        uniform float uHeight;
        void main(){
          // position.y = mod((position.y + uTime), uHeight);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * 300.0 / (-mvPosition.z);
        }
      `,
      fragmentShader: `
        void main(){
          gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
        }
      `,
      transparent: true,
    })

    let rain = new THREE.Points(geometry, shader)
    // scene.add(rain)
    function move(){
      // console.log(group);
      group.children.forEach((_mesh,index) => {
        // console.log(_mesh)
        let arr1 = _mesh.geometry.attributes.position.array;
        // if(arr1[4] < min.y){
        //   arr1[4] = max.y-d;
        //   arr1[1] = max.y;
        // }else{
        //   arr1[4] -= 0.4;
        //   arr1[1] -= 0.4;
        // }
        // _mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(arr1, 3));

        // _mesh.position.y -= (0.2*index *0.01);
        // _mesh.position.y -= (Math.random() * (1.5-0.2+1) + 0.2);
        // _mesh.position.y -= 0.2;
        
        // let y = _mesh.position.y + pos.y;
        // console.log(_mesh);
        if(_mesh.position.y < min.y){
          _mesh.position.y = max.y
        }
      })
    }

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    // loader.load(
    //   '/tashan.glb',
    //   function (gltf) {
    //     scene.add(gltf.scene)
        
    //   },
    //   // called while loading is progressing
    //   function (xhr) {
    //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //   },
    //   // called when loading has errors
    //   function (error) {
    //     console.log('An error happened');
    //   }
    // )


    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

      move();

    }

    render();
  }

  technologe_sity(renderer){

    let {scene, camera, controls} = this.loadBasic(renderer);

    camera.position.set(1864.2980461117584, 806.6782979561754, -210.71294706606588)
    controls.update();

    let light = new THREE.PointLight(0xffffff)
    light.position.y = 800
    scene.add(light)
    
    new FBXLoader().load('/shanghai.FBX', group => {

      scene.add(group)

      addShader();
    })


    function addShader(){

      let city = scene.getObjectByName('CITY_UNTRIANGULATED');

      city.geometry.computeBoundingBox();

      let {min, max} = city.geometry.boundingBox;
      let size = new THREE.Vector3(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z,
      )

      console.log(city.geometry);


      city.material = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: {
            value: new THREE.Color('#1B3045')
          },
          uMin: {
            value: min
          },
          uMax: {
            value: max
          },
          uSize: {
            value: size
          },
        },
        vertexShader: `
          varying vec3 vPosition;
          void main(){
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec3 vPosition;
          void main(){
            let
            gl_FragColor = vec4(uColor1, 1);
          }
        `
      })

    }
    
    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

    }

    render();
  }

  bloom(renderer){
    // renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    let {scene, camera, controls} = this.loadBasic(renderer);
    camera.position.set(97.63992972765156,
      661.5331147526151,
      1719.1682731434032)
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
      bloomRadius: 0
    };

    // 1、加载gltf文件1719.1682731434032
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/model-no-remarks.glb',
      function (gltf) {
        scene.add(gltf.scene)
        
        addBloom(gltf.scene)
        
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

    function addBloom(group){


      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass); // 将传入的过程添加到过程链

      const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
      outlinePass.visibleEdgeColor.set(0x73D7F2)
     
      composer.addPass(outlinePass);

      
				const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				// bloomPass.threshold = params.bloomThreshold;
				// bloomPass.strength = params.bloomStrength;
				// bloomPass.radius = params.bloomRadius;
      composer.addPass(bloomPass);

			const finalPass = new ShaderPass(
				new THREE.ShaderMaterial( {
					uniforms: {
						baseTexture: { value: null },
						bloomTexture: { value: composer.renderTarget2.texture }
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
					defines: {}
				} ), 'baseTexture'
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

      gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        renderer.toneMappingExposure = Math.pow( value, 4.0 );

      } );

      gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

        bloomPass.threshold = Number( value );

      } );

      gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

        bloomPass.strength = Number( value );

      } );

      gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

        bloomPass.radius = Number( value );

      } );


    }
    
    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

      composer.render();
    }

    render();
  }

  transition(renderer){
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
    
    let {scene, camera} = this.loadBasic(renderer);

    const transitionParams = {
      'useTexture': true,
      'transition': 0,
      'texture': 5,
      'cycle': true,
      'animate': true,
      'threshold': 0.3
    };
    const clock = new THREE.Clock();

    let _this = this;

    const sceneA = new createScene(0x0000ff, 0x00ffff);
    const sceneB = new createScene(0xffff00, 0xffffff);

    console.log(sceneA, sceneB);

    const transition = new createTransition(sceneA, sceneB);

    
    animate();

    function animate() {

      requestAnimationFrame( animate );

      transition.render( clock.getDelta() );

    }


    function createTransition(sceneA, sceneB){

      let {scene, camera} = _this.loadBasic(renderer);

      const material = new THREE.ShaderMaterial( {

        uniforms: {

          tDiffuse1: {
            value: null
          },
          tDiffuse2: {
            value: null
          },
          mixRatio: {
            value: 0.0
          },
          threshold: {
            value: 0.1
          },
          useTexture: {
            value: 1
          },
        },
        vertexShader: [

          'varying vec2 vUv;',

          'void main() {',

          'vUv = vec2( uv.x, uv.y );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

          '}'

        ].join( '\n' ),
        fragmentShader: [

          'uniform float mixRatio;',

          'uniform sampler2D tDiffuse1;',
          'uniform sampler2D tDiffuse2;',

          'uniform int useTexture;',
          'uniform float threshold;',

          'varying vec2 vUv;',

          'void main() {',

          '	vec4 texel1 = texture2D( tDiffuse1, vUv );',
          '	vec4 texel2 = texture2D( tDiffuse2, vUv );',

          '	gl_FragColor = mix( texel2, texel1, mixRatio );',


          '}'

        ].join( '\n' )

      } );

      const geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      material.uniforms.tDiffuse1.value = sceneA.fbo.texture;
      material.uniforms.tDiffuse2.value = sceneB.fbo.texture;

      new TWEEN.Tween( transitionParams )
					.to( { transition: 1 }, 1500 )
					.repeat( Infinity )
					.delay( 2000 )
					.yoyo( true )
					.start();

      this.needsTextureChange = false;

      this.render = function ( delta ) {

        // Transition animation
        if ( transitionParams.animate ) {

          TWEEN.update();

          // Change the current alpha texture after each transition
          if ( transitionParams.cycle ) {

            if ( transitionParams.transition == 0 || transitionParams.transition == 1 ) {

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
        if ( transitionParams.transition == 0 ) {

          sceneB.render( delta, false );

        } else if ( transitionParams.transition == 1 ) {

          sceneA.render( delta, false );

        } else {

          // When 0<transition<1 render transition between two scenes

          sceneA.render( delta, true );
          sceneB.render( delta, true );

          renderer.setRenderTarget( null );
          renderer.clear();
          renderer.render( scene, camera );

        }

      };
    }

    function createScene(boxColor, clearColor){

      let {scene, camera} = _this.loadBasic(renderer);

      let boxes = createBoxes(boxColor)

      scene.add(boxes);

      this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );

      this.render = function(rtt){

        renderer.setClearColor(clearColor);

        if(rtt){

          renderer.setRenderTarget(this.fbo);
          renderer.clear();
          renderer.render(scene, camera);

        }else{

          renderer.setRenderTarget(null);
          renderer.render(scene, camera);
        }
      }
    }

    function createBoxes(color){

      let group = new THREE.Group();
      let material = new THREE.MeshLambertMaterial({color});
      for(let i=0;i<500;i++){

        let mesh = new Mesh(new THREE.BoxGeometry(1,1,1), material)
        group.add(mesh);

        mesh.position.x = Math.random() * 100 - 50;
        mesh.position.y = Math.random() * 60 - 30;
        mesh.position.z = Math.random() * 80 - 40;

        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
      }
      return group
    }

    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

    }

    render();

  }

  cloud(renderer){
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
    
    let {scene, camera} = this.loadBasic(renderer);

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
    const backgroundColor = '#1e4877';

    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    camera.position.x = Math.floor(randomPositionX / 2);
    camera.position.z = cameraPositionZ;

    // 线性雾，就是说雾化效果是随着距离线性增大的
    // 可以改变雾的颜色，发现远处的云的颜色有所变化
    const fog = new THREE.Fog(backgroundColor, 1, 1000);

    const texture = new THREE.TextureLoader().load('/cloud.png')

    const geometry = new THREE.PlaneGeometry(64, 64);

    const geometries = [];

    const vShader = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
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
    `

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: texture,
        },
        fogColor: {
          value: fog.color,
        },
        fogNear: {
          value: fog.near
        },
        fogFar: {
          value: fog.far
        }
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true,
    })

    for(let i=0; i< cloudCount; i++){
      const instanceGeometry = geometry.clone();

      instanceGeometry.translate(Math.random() * randomPositionX, -Math.random() * randomPositionY, i * perCloudz);

      geometries.push(instanceGeometry);
    }

    const mergedGeometry = mergeBufferGeometries(geometries);

    const mesh = new THREE.Mesh(mergedGeometry, material);

    scene.add(mesh);
    
    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

    }

    render();
    
  }

  loadAnimation(renderer){

    let {scene, camera} = this.loadBasic(renderer);

    // let box = new THREE.BoxGeometry(10,10,10);
    // let mesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({
    //   color: 0x0000ff
    // }))
    // scene.add(mesh);

    // 进度条需要下面两种一起用，先加载GLTFLoader的onProgress，再加载LoadingManager的onProgress，一半一半
    let loadManager = new THREE.LoadingManager(
      () =>{},
      (url, loaded, total) => {
        console.log(loaded, total);
      }  
    )
    let loader = new GLTFLoader(loadManager);

    loader.load(
      // resource URL
      'bdzzcjgd3.gltf',
      // called when the resource is loaded
      function ( gltf ) {
    
        scene.add( gltf.scene );
    
      },
      // called while loading is progressing
      function ( xhr ) {
    
        console.log( ( xhr.loaded, xhr.total));
    
      },
      // called when loading has errors
      function ( error ) {
    
        console.log( 'An error happened' );
    
      }
    );

    function render() {

      requestAnimationFrame( render );
    
      renderer.render(scene, camera);

    }

    render();
  }


  loadBasic(renderer){
    // renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    let ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight);
    
    // 控制相机
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    window.scene = scene;
    window.camera = camera;
    window.controls = controls;
    return {
      scene,
      camera,
      controls
    }
  }
  render() {
    
    return <div>

      <div id="box" style={{width: '100%', height: '100%'}}/>

    </div>;
  }
}