import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import lundunyan from '../assets/images/lunduneye.png'
import grass from '../assets/images/grass.jpg'
import video from '../assets/video.mp4'
import tietu from '../assets/images/tietu.jpg'
import tietu2 from '../assets/images/tietu2.png'
import tietu3 from '../assets/images/tietu3.jpg'
import tietu4 from '../assets/images/tietu4.jpg'
import yuan from '../assets/images/yuan.png'
import data from '../assets/数据.json'
import tree from '../assets/images/tree.png'
import rain from '../assets/images/rain.png'
import { Button, InputNumber, Slider, Modal } from "antd";
import { PMREMGenerator, sRGBEncoding } from "three";
import { TextureLoader } from "three";
import { EquirectangularReflectionMapping } from "three";
import study from '../assets/study.svg'


// 漏掉的：
// 1、UV映射原理（定点纹理坐标）
// 2、materialIndex 的 geometry.faces  没有这个属性呀
// 3、光照贴图添加阴影(·lightMap)   141版本的threejs没有faceVertexUvs呀
// 4、数据纹理对象DataTexture 黑了
// 5、解析外部模型的帧动画  没有model.json文件咋整
// 6、骨骼动画  SkinnedMesh加上不scene啊
// 7、变形动画 没有morphTargetInfluences啊


class MainPage extends Component {

  state = {
    animationAction: null,
    inputValue: 1,
    clip: null
  }
  componentDidMount() {
    this.draw();
  }
  draw() {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1800, 800);
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
    document.getElementById("box").appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    this.setLight(scene, cube);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

    // this.setShadow(scene, cube)

    // this.group(scene)

    // this.arcCurve(scene)
    // this.catmullRomCurve(scene)
    // this.curvePath(scene)
    // this.tubeGeometry(scene);
    // this.latheGeometry(scene);
    // this.shapeGeometry(scene);
    // this.extrudeGeometry(scene);
    // this.texture(scene);
    // this.materialIndex(scene)
    // this.texture1(scene)

    // let texture = this.textureAnimation(scene)

    // this.addCanvas(scene)

    // this.normalMap(scene)
    // this.dataTexture(scene)

    let camera = this.camara(scene, renderer);

    // this.sprite(scene)

    // this.pm25view(scene)
    // this.sprite_tree(scene);
    // let group = this.sprite_rain(scene);

    // 帧动画
    // let mixer = this.animation(scene);
    // let clock = new THREE.Clock();

    // this.skinnedMesh(scene, renderer, camera);
    // this.morphTargets(scene);


    // Modal.info({
    //   title: '确认后才能放音乐啊',
    //   onOk: () => {
    //     this.audio(scene, camera)
    //   }
    // })
    // Modal.info({
    //   title: '确认后才能放音乐啊',
    //   onOk: () => {
    //     this.music_view(scene, renderer, camera)
    //   }
    // })

    // this.data_import_export(scene)

    // this.load_model(scene)
    this.testRotate(scene)

    // this.sky_box(scene)
    // this.load_gltf(scene, renderer, camera)

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    function onMouseDown(event){
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      raycaster.setFromCamera(mouse, camera)
      let raycasters = raycaster.intersectObjects(scene.children);
      if(raycasters.length > 0){

        raycasters[0].object.material.color.set(0x00ff00);
      }
        console.log(raycasters);
      renderer.render(scene, camera);
    }


    let controls = new OrbitControls(camera, renderer.domElement);

    controls.zoomSpeed = 2.0;
    controls.rotateSpeed = 2.0;
    controls.target.set(0,0,0);
    controls.minDistance = 80;
    controls.maxDistance = 20000;
    controls.screenSpacePanning=true;
    controls.mouseButtons = {
      LEFT:THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: ''
    }

    function animate() {

      // group.children.forEach(sprite => {
      //   sprite.position.y -= 1;
      //   if (sprite.position.y < 0) {
      //     sprite.position.y = 200;
      //   }
      // });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      controls.update();
      // cube.rotation.x +=0.01;
      // cube.rotation.y +=0.01;
      // cube.rotateZ(0.01);

      // texture.offset.x -=0.01;

      // mixer.update(clock.getDelta())
    }
    // renderer.shadowMap.enabled = true;
    animate();

    window.addEventListener('mousedown', onMouseDown, false)
    // controls.addEventListener("change", renderer);
  }

  sky_box(scene){

    let gridHelper = new THREE.GridHelper(12000, 20, 0x888888, 0x444444);
    gridHelper.position.y = -50;
    gridHelper.name = "Grid";
    scene.add(gridHelper);

    let cubeTextureLoader = new THREE.CubeTextureLoader();

    let cubeTexture = cubeTextureLoader.load([
      '/starNight/px.png',
      '/starNight/nx.png',
      '/starNight/py.png',
      '/starNight/ny.png',
      '/starNight/pz.png',
      '/starNight/nz.png',
    ]);

    scene.background = cubeTexture;
  }

  testRotate(scene){

    let geometry = new THREE.BoxGeometry(10,20,30);

    let materials = []

    let colors=[0xff0000, 0xffff00, 0xffffff, 0x00ff00, 0x0000ff, 0x00ffff]

    colors.forEach(item => {
      materials.push(new THREE.MeshLambertMaterial({
        color: item
      }))
    })

    let mesh = new THREE.Mesh(geometry, materials)

    let geometry1 = geometry.clone()
    let mesh2 = new THREE.Mesh(geometry1, materials)
    mesh2.position.x = 40

    mesh.rotateY(Math.PI/3)
    mesh.rotateZ(Math.PI/2)
    // mesh.rotateX(Math.PI/2)

    mesh2.rotation.y = Math.PI/3
    mesh2.rotation.z = Math.PI/2
    mesh2.rotation.x = Math.PI/2

    scene.add(mesh)
    scene.add(mesh2)

    let axis = new THREE.AxesHelper(300);

    mesh.add(axis)
  }

  load_model(scene){

    let loader = new STLLoader();

    const files = require.context('../../public/boat', true, /\.stl$/) // require.context获取指定目录下符合条件的文件
    files.keys().map(item => {
      const name = item.replace('./', '')


      loader.load('boat/' + name, function(geometry){

        // 1、实体渲染
        let material = new THREE.MeshLambertMaterial();
  
        let mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(-Math.PI/2);
        // mesh.position.x = -200

        let group = new THREE.Group();
        
        
        if(name === 'Deckel_v10.stl'){
          // 船上的盖子
          mesh.position.x = 190
          mesh.position.z = -54
          mesh.position.y = 75
          mesh.rotateX(-Math.PI);

          material.color = new THREE.Color(0x8e97a8) ;
          group.add(mesh);

        }else if(['Rumpf_heck_v1.stl', 'Rumpf_front_v3.stl'].includes(name)){
          // 船身
          material.color = new THREE.Color(0xaa3c1b) ;
          group.add(mesh);
        } else if(name === 'Kabine_v4.stl'){

          // 船上的棚子
          mesh.position.x = 190
          mesh.position.z = 50
          mesh.position.y = 75
          material.color = new THREE.Color(0x333333) ;
          group.add(mesh);

        }else if(name === 'Kabinendach_v3.stl'){
          
          // 船头棚子的盖子
          mesh.position.x = 180
          mesh.position.z = 60
          mesh.position.y = 190
          mesh.rotateY(-Math.PI/20)
          group.add(mesh);
        }else if(name === 'Bierhalter_v5.stl'){
          
          // 船尾的圆柱
          mesh.position.x = 125
          mesh.position.z = 0
          mesh.position.y = 50
          material.color = new THREE.Color(0x333333) ;
          group.add(mesh);
        }else{
          material.color = new THREE.Color(0xffffff) ;
          mesh.position.x = 0
          mesh.position.z = 0
          mesh.position.y = 150
        }
        scene.add(group);

        // group.rotateX(Math.PI/2)
        // 2、点渲染
        // let material = new THREE.PointsMaterial({
        //   color: 0x000000,
        //   size: 0.5
        // });
        // let points = new THREE.Points(geometry, material)
        // scene.add(points);
      });
    })


    // loader.load('boat/Rumpf_heck_v1.stl', function(geometry){

    //   // 1、实体渲染
    //   let material = new THREE.MeshLambertMaterial({

    //   });

    //   let mesh = new THREE.Mesh(geometry, material);
    //   mesh.rotateX(-Math.PI/2);
    //   // mesh.position.x = -200
    //   scene.add(mesh);
      
    //   // 2、点渲染
    //   // let material = new THREE.PointsMaterial({
    //   //   color: 0x000000,
    //   //   size: 0.5
    //   // });
    //   // let points = new THREE.Points(geometry, material)
    //   // scene.add(points);
    // });

    // loader.load('boat/Rumpf_front_v3.stl', function(geometry){
    //   // 1、实体渲染
    //   let material = new THREE.MeshLambertMaterial({

    //   });

    //   let mesh = new THREE.Mesh(geometry, material);
    //   mesh.rotateX(-Math.PI/2);
    //   // mesh.position.x = -200
    //   scene.add(mesh);
    // })


    let point = new THREE.PointLight(0xffffff);
    point.position.set(0,1500,1500);
    scene.add(point);

    let point1 = new THREE.PointLight(0xffffff);
    point1.position.set(0,-1500,-1500);
    scene.add(point1);

    point.castShadow = true;
  }

  data_import_export(scene){

    // 1、打印json数据
    // let geometry = new THREE.BoxGeometry(2,2,2);

    // console.log(geometry);
    // console.log(geometry.toJSON());
    // console.log(JSON.stringify(geometry));

    // let material = new THREE.MeshLambertMaterial({
    //   color: 0X0000ff
    // });
    // console.log(JSON.stringify(material));

    // let mesh = new THREE.Mesh(geometry, material);

    // scene.add(mesh);

    // 2、加载材质文件
    // let typeAPI= {
    //   MeshLambertMaterial: THREE.MeshLambertMaterial,
    //   MeshBasicMaterial: THREE.MeshBasicMaterial,
    //   MeshPhongMaterial: THREE.MeshPhongMaterial,
    //   PointsMaterial: THREE.PointsMaterial,
    // }

    // let loader = new THREE.FileLoader();
    // loader.load('material.json', function(elem){
    //   console.log(elem);
    //   let obj = JSON.parse(elem);
    //   console.log(obj);
    //   let geometry = new THREE.BoxGeometry(2,2,2);

    //   let material = new typeAPI[obj.type]();

    //   // 从obj.color中提取颜色
    //   // 16711935对应颜色0xFF00FF  255对应颜色0x0000FF
    //   material.color.r = (obj.color >> 16 & 255) / 255;
    //   material.color.g = (obj.color >> 8 & 255) / 255;
    //   material.color.b = (obj.color & 255 & 255) / 255;

    //   let mesh = new THREE.Mesh(geometry, material);
    //   scene.add(mesh);
    // })

    // 3、加载模型数据
    let loader = new THREE.FileLoader();
    loader.load('geometry.json', function(geometry){
      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    })
  }

  music_view(scene, renderer, camera){
    
    let group = new THREE.Group();
    let N =128;
    for(let i=0; i< N / 2; i++){
      let box = new THREE.BoxGeometry(10, 100, 10);
      let material = new THREE.MeshPhongMaterial({
        color: 0x0000ff
      });
      let mesh = new THREE.Mesh(box, material);
      mesh.position.set(30 * i - (15 * N - 20)/2 + 5, 0,0);
      group.add(mesh)
    }
    scene.add(group);


    let analyser = null;

    function render(){

      renderer.render(scene, camera);
      requestAnimationFrame(render);

      if(analyser){

        // let frequency = analyser.getAverageFrequency();
        // mesh.scale.y = 5 * frequency / 256;
        // mesh.material.color.r = 3 * frequency / 250;

        let arr = analyser.getFrequencyData();

        group.children.forEach((elem, index) => {
          elem.scale.y = arr[index]/60;
          elem.material.color.r = arr[index]/200
        })
      }
    }
    render();

    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();

    audioLoader.load('bedalone.mp3', function(audioBuffer){

      audio.setBuffer(audioBuffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();
      analyser = new THREE.AudioAnalyser(audio);
    });
    
  }

  audio(scene, camera){

    let listener = new THREE.AudioListener();

    let audio = new THREE.Audio(listener);

    let audioLoader = new THREE.AudioLoader();

    audioLoader.load('you.mp3', function(AudioBuffer){

      audio.setBuffer(AudioBuffer);

      audio.setLoop(true);

      audio.setVolume(0.3);

      audio.play();
    })

    // 音乐绑相机，没效果啊
    let geometry = new THREE.BoxGeometry(1,1,1);

    let material = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    })

    let audioMesh = new THREE.Mesh(geometry, material);

    audioMesh.position.set(0, 0, 300);

    scene.add(audioMesh);

    camera.add(listener); // 监听者绑定到相机对象

    let posAudio = new THREE.PositionalAudio(listener);
    audioMesh.add(posAudio);


  }

  // 变形动画geometry.morphTargets
  morphTargets(scene){

    let geometry = new THREE.BoxGeometry(5,5,5);

    let box1 = new THREE.BoxGeometry(10, 1, 10);
    let box2 = new THREE.BoxGeometry(1, 20, 1);


    geometry.morphTargets[0] = {name: 'target1', vertices: box1.vertices};
    geometry.morphTargets[1] = {name: 'target2', vertices: box2.vertices};

    geometry.computeMorphNormals();

    let material = new THREE.MeshLambertMaterial({
      morphTargets: true,
      color: 0x0000ff
    });

    let mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);

    console.log(mesh, geometry);

    // mesh.morphTargetInfluences = []

    // mesh.morphTargetInfluences[0] = 0.5;

    // mesh.morphTargetInfluences[1] = 1;



    console.log(mesh);
    
  }

  // 骨骼动画(SkinnedMesh)
  skinnedMesh(scene, renderer, camera){

    let geometry = new THREE.CylinderGeometry(1, 1, 12, 50, 50);

    console.log(geometry);

    geometry.skinIndices = [];

    geometry.skinWeights = [];

    geometry.translate(0, 6, 0);

    for(let i=0; i<geometry.vertices.length; i++){

      let j = geometry.vertices[i].y;

      if(j < 6){

        geometry.skinIndices.push(new THREE.Vector4(0,0,0,0));

        geometry.skinWeights.push(new THREE.Vector4(1 - (j - 6) / 4, 0, 0, 0));
      }else if(6 < j && j <= 6 + 4){

        geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0));

        geometry.skinWeights.push(new THREE.Vector4(1 - (j - 6) / 4, 0, 0, 0));
      }else if(6 + 4 < j && j <= 6 + 4 + 2){

        geometry.skinIndices.push(new THREE.Vector4(2, 0, 0, 0));

        geometry.skinWeights.push(new THREE.Vector4(1 - (j - 10) / 2, 0, 0 ,0));
      }
      
    }

    let material = new THREE.MeshPhongMaterial({
      skinning: true,
      color: 0x0000ff
    });

    material.wireframe = true

    let skinnedMesh = new THREE.Mesh(geometry, material);
    // skinnedMesh.position.set(5, 12, 5);

    // skinnedMesh.rotateX(Math.PI);
    scene.add(skinnedMesh)


    let bone1 = new THREE.Bone();
    let bone2 = new THREE.Bone();
    let bone3 = new THREE.Bone();

    bone1.add(bone2);
    bone2.add(bone3);

    bone2.position.y = 6;
    bone3.position.y = 4;

    let skeleton = new THREE.Skeleton([bone1, bone2, bone3]);

    console.log(skeleton.bones);

    skinnedMesh.add(bone1);
    // skinnedMesh.bind(skeleton);

    let skeletonHelper = new THREE.SkeletonHelper(skinnedMesh);

    scene.add(skeletonHelper);

    skeleton.bones[1].rotation.x = 0.5;
    skeleton.bones[2].rotation.x = 0.5;

    // skeleton.bones.forEache(elem => {
    //   console.log(elem.getWorldPosition(new THREE.Vector3()));
    // })

    let n = 0,
        T = 50,
        step = 0.01;
    
    function render(){
      renderer.render(scene, camera);
      requestAnimationFrame(render);
      n += 1;

      if(n < T){
        skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step;
        skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step;
        skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x +2 * step;

      }

      if(n < 2 * T && n > T){
        skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step;
        skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step;
        skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - 2 * step;
      }

      if(n === 2 * T){
        n = 0
      }
    }
    render();


  }

  // 快进
  pos = () => {

    // this.state.animationAction.time +=2;

    // this.state.clip.duration = this.state.animationAction.time;

    // this.state.animationAction.play();
  }

  // 播放设置(暂停、时间段、时间点)
  toggleAnimation = () => {
    this.state.animationAction.paused = !this.state.animationAction.paused;
  }

  // 编辑关键帧并解析播放
  animation(scene){

    let box = new THREE.BoxGeometry(2, 0.5, 0.5);

    let boxMaterial = new THREE.MeshLambertMaterial({
      color: 0x0000ff,
    })
    let boxMesh = new THREE.Mesh(box, boxMaterial)

    let ball = new THREE.SphereGeometry(1, 50, 50);

    let ballMaterial = new THREE.MeshLambertMaterial({
      color: 0xff00ff,
    })
    let ballMesh = new THREE.Mesh(ball, ballMaterial)

    boxMesh.position.x = 3


    let group = new THREE.Group();

    group.add(boxMesh);
    group.add(ballMesh);

    scene.add(group);

    // 第0秒 和 第5秒 
    let times = [0, 5];

    let values = [0, 0, 0, 4, 0, 0];

    let posTrack = new THREE.KeyframeTrack('Box.position', times, values);

    let colorKF = new THREE.KeyframeTrack('Box.material.color', [5, 10], [1, 0, 0, 0, 0, 1]);

    let scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [5, 10], [1, 1, 1, 2,2,2]);

    // 持续时间是 10 秒
    let duration = 10;

    let clip = new THREE.AnimationClip('default', duration, [posTrack, colorKF, scaleTrack]);

    let mixer = new THREE.AnimationMixer(boxMesh);

    let animationAction = mixer.clipAction(clip);

    animationAction.timeScale = 2;  // 默认1，可以调节播放速度

    animationAction.loop = THREE.LoopOnce;  // 不循环播放

    animationAction.clampWhenFinished = true; //暂停在最后一帧播放的状态

    // animationAction.time = 10; //操作对象设置开始播放时间

    // clip.duration = 18;  //剪辑对象设置播放结束时间

    // animationAction.play();

    this.setState({
      animationAction,
      clip
    })

    return mixer

  } 

  sprite_rain(scene){

    let textureRain = new THREE.TextureLoader().load(rain);

    let group = new THREE.Group();

    for(let i=0; i< 400; i++){

      let spriteMaterial = new THREE.SpriteMaterial({
        map: textureRain
      });

      let sprite = new THREE.Sprite(spriteMaterial);
      // scene.add(sprite);

      sprite.scale.set(8, 10, 1);

      let k1 = Math.random() - 0.5;
      let k2 = Math.random() - 0.5;
      let k3 = Math.random() - 0.5;

      sprite.position.set(200 * k1, 200*k3, 200 *k2);

      group.add(sprite);

    }

    scene.add(group)

    return group
  }

  sprite_tree(scene){

    let textureTree = new THREE.TextureLoader().load(tree);

    for(let i=0; i<100; i++){
      let spriteMaterial = new THREE.SpriteMaterial({
        map: textureTree,
      });

      let sprite = new THREE.Sprite(spriteMaterial);
      scene.add(sprite);

      sprite.scale.set(100, 100, 1);

      let k1 = Math.random() - 0.5;
      let k2 = Math.random() - 0.5;

      sprite.position.set(1000 * k1, 50, 1000 * k2) // x y z （y是竖着的）
    }

    let geometry = new THREE.PlaneGeometry(1000, 1000);

    let texture = new THREE.TextureLoader().load(grass);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(10, 10);

    let material = new THREE.MeshLambertMaterial({
      color: 0x777700,
      map: texture
    });

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    mesh.rotateX(-Math.PI/2);

  }

  pm25view(scene){

    THREE.Cache.enabled = true;

    let texture = new THREE.TextureLoader().load('yuan.png');

    let group = new THREE.Group();

    let loader = new THREE.FileLoader().setResponseType('json');
  
    loader.load('数据.json', function(_data){

      _data.forEach(elem => {

        let spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.5,
        });

        let sprite = new THREE.Sprite(spriteMaterial);
        group.add(sprite);

        let k = elem.value / 200;

        sprite.scale.set(k, k, 1);

        sprite.position.set(elem.coordinate[0], elem.coordinate[1], 0);
      });

      group.position.set(-110, -30, 0);

      scene.add(group)
    }, null, function(err){
      console.log(err);
    })
  }

  // 精灵模型Sprite
  sprite(scene){

    let texture = new THREE.TextureLoader().load(lundunyan);

    let spriteMaterial = new THREE.SpriteMaterial({
      color: 0xff00ff,
      rotation: Math.PI/4,
      map: texture
    });

    let sprite = new THREE.Sprite(spriteMaterial);
    scene.add(sprite);

    sprite.scale.set(2,2,1);  // 只需要设置x、y两个分量就可以

  }

  // 正视投影相机 和 透视投影相机
  camara(scene, renderer){

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);

    // scene.add(cube);

    // const cube2 = cube.clone();
    // cube2.position.x = 2
    // scene.add(cube2);
    // const cube3 = cube.clone();
    // cube3.position.x = 4
    // scene.add(cube3);
    // const cube4 = cube.clone();
    // cube4.position.x = 6
    // scene.add(cube4);

    // 1、正投影相机对象OrthographicCamera
    // let s = 5, k = window.innerWidth / window.innerHeight;
    // const camera = new THREE.OrthographicCamera(
    //   -s * k,
    //   s * k,
    //   s,
    //   -s,
    //   1,
    //   10
    // );
    // camera.position.set(4, 4, 4);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 2、透视投影相机PerspectiveCamera

    let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(200,200,200)
    camera.lookAt(new THREE.Vector3(0,0,0));

    // 3、正投影相机OrthographicCamera自适应渲染
    // window.onresize = function(){

    //   console.log(window.innerWidth, window.innerHeight);

    //   renderer.setSize(window.innerWidth, window.innerHeight);
    //   k = window.innerWidth / window.innerHeight;

    //   camera.left = -s*k;
    //   camera.right = s*k;
    //   camera.top = s;
    //   camera.bottom = -s;

    //   camera.updateProjectionMatrix ();

    // }

    // 4、透视投影相机PerspectiveCamera自适应渲染
    window.onresize = function(){

      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();
    }

    return camera;
  }

  dataTexture(scene){

    let geometry = new THREE.PlaneGeometry(128,128);

    let width = 12;
    let height= 12;
    let size = width * height;
    let data = new Uint8Array(size * 3);
    for(let i=0; i< size* 3;i+=3){
      data[i] = 255 * Math.random();
      data[i+1] = 255 * Math.random();
      data[i+2] = 255 * Math.random();
    }
    let texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;
    let material = new THREE.MeshPhongMaterial({
      map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  // 凹凸贴图bumpMap和法线贴图.normalMap
  normalMap(scene){

    // 1、案例一
    // let geometry = new THREE.BoxGeometry(3,3,3);

    // let textureLoader = new THREE.TextureLoader();

    // let textureNormal = textureLoader.load(tietu);

    // let material = new THREE.MeshPhongMaterial({
    //   color: 0xff0000,
    //   normalMap: textureNormal,
    //   normalScale: new THREE.Vector2(2,2)
    // });

    // 2、案例二：法线贴图
    // let geometry = new THREE.SphereGeometry(2, 25,25);

    // let textureLoader = new THREE.TextureLoader();

    // let texture = textureLoader.load(tietu3);
    // let textureNormal = textureLoader.load(tietu2);
    // let material = new THREE.MeshPhongMaterial({
    //   map: texture,
    //   normalMap: textureNormal,
    //   normalScale: new THREE.Vector2(1.2, 1.2)
    // })


    // 3、案例三： 凹凸贴图
    let geometry = new THREE.PlaneGeometry(5,5);
    console.log(geometry)
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(tietu4)
    let textureBump = textureLoader.load(tietu2);
    let material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: textureBump,
      bumpScale: 3,
      // specularMap: textureBump,   // 高光贴图
      // shininess: 30,
    })

    let mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh);
  }

  addCanvas(scene){

    let canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height=60;
    let c = canvas.getContext('2d');

    // 1、写个字
    // c.fillStyle = '#ff00ff';
    // c.fillRect(0,0,200, 60);
    // c.beginPath();

    // c.translate(100, 30);
    // c.fillStyle = '#000000';
    // c.font = 'bold 30px 宋体';
    // c.textBaseline = 'middle';
    // c.textAlign = 'center';
    // c.fillText('wjh_啦啦啦', 0, 0);

    // 2、整个图片
    let img = new Image();
    img.src = grass;
    
    document.body.appendChild(canvas);

    let texture = new THREE.CanvasTexture(canvas);

    img.onload = function(){

      c.drawImage(img, 0, 0)

      texture.needsUpdate = true;
    }

    // 3、整个视频 
    // let video1 = document.createElement('video');

    // video1.width = '320';
    // video1.height = '240';
    // video1.controls = true;

    // let source = document.createElement('source');
    // source.setAttribute('type', 'video/mp4');
    // source.setAttribute('src', video);

    // video1.appendChild(source)

    // let texture = new THREE.VideoTexture(video1);

    let geometry = new THREE.PlaneGeometry(50, 16);

    let material = new THREE.MeshPhongMaterial({
      map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh)
  }

  textureAnimation(scene){

    let curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, -2, 0),
      new THREE.Vector3(-3, 2, 0),
      new THREE.Vector3(3, 2, 0),
      new THREE.Vector3(4, -2, 0),
    ]);

    let tubeGeometry = new THREE.TubeGeometry(curve, 10, 0.6, 5, false);
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(grass);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.x = 20;

    let tubeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });

    let mesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

    scene.add(mesh);

    return texture;
  }

  texture1(scene){



    let geometry = new THREE.PlaneGeometry(10, 10);

    let texture = new THREE.TextureLoader().load(grass);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,1);

    let material = new THREE.MeshLambertMaterial({
      map: texture
    });

    let mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    mesh.rotateX(-Math.PI / 2);

  }

  // 数组材质、材质索引.materialIndex
  materialIndex(scene){

    let geometry = new THREE.BoxGeometry(2,2,2);


    let material_1 = new THREE.MeshPhongMaterial({
      color: 0xffff3f
    });

    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(lundunyan);

    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    // texture.repeat.set(4,2);
    // // 偏移效果
    // texture.offset = new THREE.Vector2(0.5, 0.5);

    texture.rotation = Math.PI/4;
    // 设置纹理的旋转中心，默认(0,0)
    // texture.center.set(0.5, 0.5);
    console.log(texture.matrix);

    let material_2 = new THREE.MeshLambertMaterial({
      map: texture
    });

    let materialArr = [material_2, material_1, material_1, material_1, material_1, material_1]

    let mesh = new THREE.Mesh(geometry, materialArr);
    
    scene.add(mesh);


  }

  // 创建纹理贴图
  texture(scene){

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = new THREE.PlaneGeometry(2,3);
    // const geometry = new THREE.SphereGeometry(3,4,5);

    let textureLoader = new THREE.TextureLoader();

    textureLoader.load(lundunyan, function(texture){

      let material = new THREE.MeshLambertMaterial({
        map: texture,
      })

      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh)
    }, undefined, function(err){
      console.error( 'An error happened.', err );
    })
  }

  // 拉伸扫描成型ExtrudeGeometry
  extrudeGeometry(scene){

    let shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(0, 1);
    shape.lineTo(1, 1);
    shape.lineTo(1, 0);
    shape.lineTo(0, 0);
    let geometry = new THREE.ExtrudeGeometry(
      shape,
      {
        amount: 3,  //拉伸长度
        bevelEnabled: false //无倒角
      }
    )
    let material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
    });
    let mesh = new THREE.Mesh(geometry, material);
    // let material = new THREE.PointsMaterial({
    //   color: 0x0000ff,
    //   size: 1.0
    // });
    // let mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
  }
  
  // Shape对象和轮廓填充ShapeGeometry
  shapeGeometry(scene){ 
    // 1.五边形
    let points = [
      new THREE.Vector2(-5, -5),
      new THREE.Vector2(-6, 0),
      new THREE.Vector2(0, 5),
      new THREE.Vector2(6, 0),
      new THREE.Vector2(5, -5),
      // new THREE.Vector2(-5, -5),
    ]

    let shape = new THREE.Shape(points);
    // shape可以理解为一个需要填充轮廓
    // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
    let geometry = new THREE.ShapeGeometry(shape, 25);

    let material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
    });
    // material.wireframe = true //线条模式渲染(查看细分数)
    // let mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // 2.圆
    let shape1 = new THREE.Shape();
    shape1.absarc(0, 0, 3, 0, 2 * Math.PI);
    let geometry1 = new THREE.ShapeGeometry(shape1, 25);
    let mesh1 = new THREE.Mesh(geometry1, material);
    // scene.add(mesh1);

    // 3.矩形
    let shape2 = new THREE.Shape();
    shape2.moveTo(0, 0);
    shape2.lineTo(0, 3);
    shape2.lineTo(3, 3);
    shape2.lineTo(3, 0);
    shape2.lineTo(0, 0);
    let geometry2 = new THREE.ShapeGeometry(shape2, 25);
    // let mesh2 = new THREE.Mesh(geometry2, material);
    // scene.add(mesh2);

    // 4.圆+矩形
    let shape3 = new THREE.Shape();
    let R=2;
    shape3.absarc(0, 0, R, 0, Math.PI);
    shape3.lineTo(-R, -4);
    shape3.absarc(0, -4, R, Math.PI, Math.PI * 2);
    shape3.lineTo(R, 0);
    let geometry3 = new THREE.ShapeGeometry(shape3, 30);
    let mesh3 = new THREE.Mesh(geometry3, material);
    // scene.add(mesh3);
    // mesh3.rotateZ(Math.PI/2);
    
    // 5.圆环
    let shape4 = new THREE.Shape();
    shape4.arc(0, 0, 6, 0, 2 * Math.PI);

    let path1 = new THREE.Path();
    path1.arc(0, 0, 2, 0, 2 * Math.PI);

    let path2 = new THREE.Path();
    path2.arc(4, 0, 1, 0, 2 * Math.PI);

    let path3 = new THREE.Path();
    path3.arc(-4, 0, 1, 0, 2 * Math.PI);

    shape4.holes.push(path1, path2, path3);
    let geometry4 = new THREE.ShapeGeometry(shape4, 30);
    let mesh4 = new THREE.Mesh(geometry4, material);
    scene.add(mesh4);
  }

  latheGeometry(scene){
    // 旋转造型LatheGeometry

    let points = [
      new THREE.Vector2(5,6),
      new THREE.Vector2(2,0),
      new THREE.Vector2(5,-6),
    ]
    let geometry = new THREE.LatheGeometry(points, 30);
    let material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide
    });
    material.wireframe = true //线条模式渲染(查看细分数)
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)

    // 样条曲线插值计算
    let shape = new THREE.Shape();
    let points1 = [
      new THREE.Vector2(5, 6),
      new THREE.Vector2(2.5, 0),
      new THREE.Vector2(5, -6),
    ]
    shape.splineThru(points1)
    let splinePoints = shape.getPoints(20);
    let geometry1 = new THREE.LatheGeometry(splinePoints, 30)
    let mesh1 = new THREE.Mesh(geometry1, material);
    scene.add(mesh1)
  }

  tubeGeometry(scene) {
    // 1.曲线路径管道成型TubeGeometry

    let path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 2, 6),
      new THREE.Vector3(-1, 4, 4),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, -3, 0),
    ]);

    // path:路径   40：沿着轨迹细分数  0.5：管道半径   25：管道截面圆细分数
    let geometry = new THREE.TubeGeometry(path, 40, 0.5, 25);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.4,
    });
    const line = new THREE.Mesh(geometry, material);
    scene.add(line);

    // 2.CurvePath多段路径生成管道案例 

    let p1 = new THREE.Vector3(-85.35, -35.36);
    let p2 = new THREE.Vector3(-50, 0, 0);
    let p3 = new THREE.Vector3(0, 50, 0);
    let p4 = new THREE.Vector3(50, 0, 0);
    let p5 = new THREE.Vector3(85.35, -35.36);
    // 创建线条一：直线
    let line1 = new THREE.LineCurve3(p1, p2);
    // 重建线条2：三维样条曲线
    let curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
    // 创建线条3：直线
    let line2 = new THREE.LineCurve3(p4, p5);
    let CurvePath = new THREE.CurvePath(); // 创建CurvePath对象
    CurvePath.curves.push(line1, curve, line2); // 插入多段线条
    //通过多段曲线路径创建生成管道
    //通过多段曲线路径创建生成管道，CCurvePath：管道路径
    let geometry2 = new THREE.TubeGeometry(CurvePath, 100, 5, 25, false);
    const line3 = new THREE.Mesh(geometry2, material);
    scene.add(line3);
  }

  curvePath(scene) {
    // 多个线条组合曲线CurvePath
    let geometry = new THREE.BufferGeometry();

    let R = 2;
    let arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);

    let line1 = new THREE.LineCurve(
      new THREE.Vector2(R, 3, 0),
      new THREE.Vector2(R, 0, 0)
    );
    let line2 = new THREE.LineCurve(
      new THREE.Vector2(-R, 0, 0),
      new THREE.Vector2(-R, 3, 0)
    );

    let curvePath = new THREE.CurvePath();

    curvePath.curves.push(line1, arc, line2);

    let points = curvePath.getPoints(500);

    geometry.setFromPoints(points);

    let material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });

    let line = new THREE.Line(geometry, material);
    scene.add(line);
  }

  catmullRomCurve(scene) {
    // 1.样条曲线
    let geometry = new THREE.BufferGeometry();

    let curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 2, 6),
      new THREE.Vector3(-1, 4, 4),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, -3, 0),
      new THREE.Vector3(2, 0, 4),
    ]);

    let points = curve.getPoints(100);

    geometry.setFromPoints(points);

    let material = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });
    let line = new THREE.Line(geometry, material);
    scene.add(line);

    // 2.贝塞尔曲线
    // 2.1.一个控制点
    let geometry1 = new THREE.BufferGeometry();
    let p1 = new THREE.Vector3(-2, 0, 0);
    let p2 = new THREE.Vector3(2, 4, 0);
    let p3 = new THREE.Vector3(3, 0, 0);

    let curve1 = new THREE.QuadraticBezierCurve3(p1, p2, p3); // 二次贝赛尔曲线的参数p1、p3是起始点，p2是控制点，控制点不在贝塞尔曲线上
    geometry1.setFromPoints(curve1.getPoints(100));
    let line1 = new THREE.Line(geometry1, material);
    scene.add(line1);

    // 2.1.两个控制点
    let geometry2 = new THREE.BufferGeometry();
    let p4 = new THREE.Vector3(2, 0, 0);

    let curve2 = new THREE.CubicBezierCurve3(p1, p2, p3, p4); // 二次贝赛尔曲线的参数p1、p4是起始点，p2、p3是控制点，控制点不在贝塞尔曲线上
    geometry2.setFromPoints(curve2.getPoints(100));
    let line2 = new THREE.Line(geometry2, material);
    scene.add(line2);
  }

  arcCurve(scene) {
    // 1.绘制曲线
    let geometry = new THREE.BufferGeometry();

    let arc = new THREE.ArcCurve(0, 0, 1, 0, 2 * Math.PI);

    let points = arc.getPoints(50);

    geometry.setFromPoints(points);

    let material = new THREE.LineBasicMaterial({
      color: 0x000000,
    });

    let line = new THREE.Line(geometry, material);
    scene.add(line);

    // 2.绘制直线
    // 2.1.直接给几何体Geometry设置两个顶点数据
    let geometry1 = new THREE.BufferGeometry();
    let p1 = new THREE.Vector3(2, 0, 0);
    let p2 = new THREE.Vector3(0, 3, 0);

    let pointsArray = new Array();
    pointsArray.push(p1);
    pointsArray.push(p2);
    geometry1.setFromPoints(pointsArray);
    let material1 = new THREE.LineBasicMaterial({
      color: 0xffff00,
    });

    let line1 = new THREE.Line(geometry1, material1);
    scene.add(line1);

    // 2.2.通过LineCurve3绘制一条三维直线
    let geometry2 = new THREE.BufferGeometry();
    let p3 = new THREE.Vector3(3, 0, 0);
    let p4 = new THREE.Vector3(0, 3, 0);
    let lineCurve = new THREE.LineCurve3(p3, p4);
    let pointsArray2 = lineCurve.getPoints(10);
    geometry2.setFromPoints(pointsArray2);

    let line2 = new THREE.Line(geometry2, material1);
    scene.add(line2);
  }

  group(scene) {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshLambertMaterial({ color: 0x0000ff });

    let group = new THREE.Group();
    let mesh1 = new THREE.Mesh(geometry, material);
    let mesh2 = new THREE.Mesh(geometry, material);
    mesh2.translateX(2);

    group.add(mesh1);
    group.add(mesh2);

    scene.add(group);

    group.translateY(1);

    group.scale.set(2, 2, 2);

    group.rotateY(Math.PI / 6);
    console.log("查看group的子对象", group.children);
  }

  setShadow(scene, mesh) {
    // mesh.castShadow = true;

    let planeGeometry = new THREE.PlaneGeometry(5, 5);

    let planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
    });

    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);

    planeMesh.rotateX(-Math.PI / 2);
    planeMesh.position.y = -1;

    // planeMesh.receiveShadow = true;

    // let directionaLight = new THREE.DirectionalLight(0xffffff, 1);

    // directionaLight.position.set(6, 10, 40);

    // scene.add(directionaLight);

    // directionaLight.castShadow = true;

    // directionaLight.shadow.camera.near = 0.5;
    // directionaLight.shadow.camera.far = 3;
    // directionaLight.shadow.camera.left = -5;
    // directionaLight.shadow.camera.right = 5;
    // directionaLight.shadow.camera.top = 2;
    // directionaLight.shadow.camera.bottom = -10;

    // 聚光光源
    // var spotLight = new THREE.SpotLight(0xffffff);
    // // 设置聚光光源位置
    // spotLight.position.set(50, 90, 50);
    // // 设置聚光光源发散角度
    // spotLight.angle = Math.PI / 6;
    // scene.add(spotLight); //光对象添加到scene场景中
    // // 设置用于计算阴影的光源对象
    // spotLight.castShadow = true;
    // // 设置计算阴影的区域，注意包裹对象的周围
    // spotLight.shadow.camera.near = 1;
    // spotLight.shadow.camera.far = 300;
    // spotLight.shadow.camera.fov = 20;
  }

  setLight(scene, mesh) {
    // 1、环境光
    // let ambient = new THREE.AmbientLight(0x444444);
    // scene.add(ambient);

    // 2、点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(500, 500, 500);

    point.castShadow = true;
    scene.add(point);

    let point1 = new THREE.PointLight(0xffffff);
    point1.position.set(-400, -500, -600);
    scene.add(point1);

    // 3、平行光  阴影
    // let directionaLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionaLight.position.set(2, 5, 1);
    // directionaLight.castShadow = true;
    // directionaLight.target = mesh;
    // scene.add(directionaLight);

    // directionaLight.shadow.mapSize.width = 512;
    // directionaLight.shadow.mapSize.height = 512;
    // directionaLight.shadow.camera.near = 0.5;
    // directionaLight.shadow.camera.far = 500;

    // let sphereGeometry = new THREE.SphereBufferGeometry(1, 30, 30);
    // let sphereMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    // let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.castShadow = true;
    // sphere.receiveShadow = false;
    // scene.add(sphere)

    // let planeGeometry = new THREE.PlaneBufferGeometry( 9, 9, 32, 32 );

    // let planeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00})
    // let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // plane.receiveShadow = true;
    // plane.position.y = -4;
    // plane.rotateX(-Math.PI / 2);
    // scene.add(plane)

    // 4、聚光源
    // let spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(1, 5, 1);

    // spotLight.target = mesh;

    // spotLight.angle = Math.PI/6;

    // scene.add(spotLight);
  }



  render() {

    let setInputValue = (inputValue) => {
      this.setState({
        inputValue
      });

      this.state.animationAction.time = inputValue;
      this.state.clip.duration = inputValue;
      this.state.animationAction.play();
    }
    return <div>


      <Button onClick={this.pos}>切换状态</Button>
      <Slider value={this.state.inputValue} onChange={setInputValue} step={0.01}/>
      <InputNumber 
        min={1}
        max={20}
        step={0.01}
        onChange={setInputValue}
        value={this.state.inputValue}/>
      
      <img src={study}/>
      
      <div id="box" style={{width: '100%', height: '800px'}}/>

    </div>;
  }
}
export default MainPage;
