import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export default class EditPage extends React.Component{
  componentDidMount(){
    this.draw();
    console.log(22);
  }
  draw(){
    const canvas = document.querySelector('#c2d');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true   // 抗锯齿
    });

    // 开启Hidpi设置
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    this.perspectiveCamera(renderer, canvas)

  }

  tankMove(renderer, canvas){

    // 相机公用方法
    function makeCamera(fov=40){

      const aspect = 2;
      const zNear = 0.1;
      const zFar = 1000;
      return new THREE.perspectiveCamera(fov, aspect, zNear, zFar)
    }

    const camera = makeCamera();

    camera.position.set(8,4,10).multiplyScaler(3);
    camera.lookAt(0,0,0);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const scene = new THREE.Scene()
  }

  perspectiveCamera(renderer, canvas){


    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black')

    const fov = 40  // 视野范围
    const aspect = 2  // 相机默认值 画布的宽高比
    const near = 0.1  //近平面
    const far = 1000  // 远平面

    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0,10,20)
    camera.lookAt(0,0,0)

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
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8f4b2e'})
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
    function render(){
      renderer.render(scene, camera)
      requestAnimationFrame(render)

      controls.update()
      cameraHelper.update()
    }

    render()



  }
  render(){
    return (
      <canvas id="c2d" style={{width: '100%', height: '100%'}}>
        
      </canvas>
    )
  }
}