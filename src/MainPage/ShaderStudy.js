import React from "react";
import * as THREE from "three";
import { MeshLambertMaterial } from "three";
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import gsap from "gsap";
import { Vector3 } from "three";
import * as _ from "lodash";
// import {RayMarching} from './Helper'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm//renderers/CSS2DRenderer.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm//renderers/CSS3DRenderer";
import TWEEN from "tween.js";
import shuData from "../assets/shu";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { BoxGeometry } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { PathPointList } from "../libs/PathPointList";
import { PathGeometry } from "../libs/PathGeometry";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Scene } from "three";
import * as Nodes from "three/examples/jsm/nodes/Nodes";

import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry.js";
// import { nodeFrame } from 'three/examples/jsm/nodes/Nodes';

import { MyGeometry } from "../libs/MyGeometry";
import { TheGeometry } from "../libs/TheGeometry";

export default class ShaderStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    const canvas = document.querySelector("#c2d");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // 抗锯齿
    });

    // 开启Hidpi设置
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // this.shader_fly_line(renderer, canvas)
    // this.shader_particle(renderer, canvas)

    // this.particle_system(renderer, canvas)

    // 取代木棉树的API
    // this.fence(renderer, canvas) // 创建围栏
    this.animationPath(renderer, canvas)  // 创建动画路径
    // this.CSS2DAnd3D(renderer, canvas) // 创建dom元素标签  和镜头聚焦 和标签拖拽
    // this.axisChange(renderer, canvas) // 世界坐标转屏幕坐标
    // this.lightLine(renderer, canvas)   // 创建流光溢彩线
    // this.virtualize(renderer, canvas)   // 目标模型虚化
    // this.createLine2(renderer, canvas)     // 路径1  大佬的代码

    // this.createPath(renderer, canvas); // 路径2  自己写的，没写完
    // this.showFire(renderer, canvas)     // 火，搞不起来啊

    // this.light_test(renderer, canvas)     // 灯光测试
    // this.func_study(renderer, canvas)   // shader的方法学习

    // this.simplex(renderer, canvas)

    // this.simple_effects(renderer, canvas)

    // this.optimizeTree(renderer, canvas)  // 优化树

    // this.pipeAnimation(renderer, canvas)
  }

  showFire(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 70, 0);
    scene.add(light);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    let loader = new GLTFLoader();
    let _this = this;

    loader.load("/bdzzcjgd3.gltf", function (gltf) {
      scene.add(gltf.scene);

      let obj = gltf.scene.getObjectByName("gaoyashiwaiqiang_1");

      let fire = _this.createFire(obj);
      scene.add(fire);
    });

    let n = new Nodes.NodeFrame();
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      n?.update();
    }

    render();
  }

  createFire(mesh) {
    const sphereGeometry = new THREE.SphereGeometry(50, 130, 16);

    const geometry = new THREE.BufferGeometry();

    // buffers

    const speed = [];
    const intensity = [];
    const size = [];

    const positionAttribute = mesh.geometry.getAttribute("position");
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

    const fireMap = new THREE.TextureLoader().load(
      "textures/sprites/firetorch_1.jpg"
    );

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

    return particles;
  }

  createPath(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const light = new THREE.HemisphereLight(0xfff0f0, 0x606066);
    light.position.set(1, 1, 1);
    scene.add(light);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    let curvePath = this.getLine(
      [
        [-15, 0, -5],
        [15, 0, -5],
        [30, 10, 5],
        [15, 10, 10],
      ],
      {
        // divisions: 4000,
        isStraight: false,
      }
    ).curvePath;

    // const geometry = new MyGeometry( curvePath, 100,);
    const geometry = new TheGeometry(curvePath, 100);
    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    // material.wireframe = true;
    scene.add(mesh);

    new THREE.TextureLoader().load("lightLine.png", (texture) => {
      material.map = texture;
    });

    console.log(mesh);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  func_study(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    let geometry = new THREE.PlaneGeometry(30, 30);

    let shader = new THREE.ShaderMaterial({
      uniforms: {
        u_time: {
          type: "f",
          value: 1.0,
        },

        // u_resolution (画布尺寸)
        u_resolution: {
          type: "v2",
          value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
        },
      },
      vertexShader: `
        precision lowp float;
        varying vec2 vUv;
        void main(){
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec2 u_resolution;
        uniform float u_time;

        float plot(vec2 st){
          return smoothstep(0.02, 0.0, abs(st.y - st.x));
        }

        void main(){
          // 1、利用取模函数mod()达到反复渐变效果
          // float strength = mod(vUv.y * 10.0, 1.0);
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 2、利用step(edge, x)实现斑马线条纹效果
          // float strength = mod(vUv.x * 10.0, 1.0);
          // strength = step(0.8, strength);  // 该step(edge,x)函数中,如果x < edge,返回0.0,否则返回1.0
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 3、利用取最小值min()实现渐变
          // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 4、利用取最小值min()实现渐变
          // float strength = floor(vUv.y *  10.0) / 10.0;
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 5、使用length返回向量长度()沿半径计算长度
          // float strength = length(vUv);
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 6、使用distance函数计算两个向量之间的距离
          // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
          // gl_FragColor = vec4(strength, strength, strength, 1.0);

          // 7、利用相除,实现光点效果
          // float strength = 0.15 / distance(vUv,vec2(0.5,0.5)) - 1.0;
          // gl_FragColor = vec4(strength,strength,strength,1.0);

          // 8、把规范化后的 x,y 坐标映射(map)到红色和绿色通道
          // vec2 st = gl_FragCoord.xy / u_resolution;
          // gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);

          // 9、绘制一条绿色的线
          vec2 st = gl_FragCoord.xy / u_resolution;

          float y = st.x;

          vec3 color = vec3(y);

          float pct = plot(st);
          color = (1.0-pct)*color+pct*vec3(0.0, 1.0, 0.0);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    let mesh = new THREE.Mesh(geometry, shader);
    scene.add(mesh);

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  light_test(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    new THREE.ObjectLoader().load(
      // 资源的URL
      "model1.json",

      // onLoad回调
      // Here the loaded data is assumed to be an object
      function (obj) {
        // Add the loaded object to the scene
        scene.add(obj);
      },

      // onProgress回调
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      // onError回调
      function (err) {
        console.error("An error happened");
      }
    );

    // let pmremGenerator = new THREE.PMREMGenerator( renderer );
    // pmremGenerator.compileEquirectangularShader();

    // scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    let loader = new GLTFLoader();

    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('/draco/');
    // loader.setDRACOLoader(dracoLoader);

    loader.load("/scene1.gltf", function (gltf) {
      scene.add(gltf.scene);
    });

    function render(time) {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  simple_effects(renderer, canvas) {
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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let light = new THREE.PointLight(0xaaccff);
    light.position.set(50, 50, 0);
    // scene.add(light)

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    // 地球外层的点
    let sphere = new THREE.SphereGeometry(15, 70, 70);

    let geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", sphere.getAttribute("position"));

    let material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: 0.5,
        },
        uColor: {
          value: new THREE.Color("rgb(21,57,88)"),
        },
        pointTexture: {
          value: new THREE.TextureLoader().load("gradient.png"),
        },
        alphaTest: {
          value: 0.9,
        },
      },
      vertexShader: `
        uniform float size;
        void main(){

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          gl_PointSize = size * (300.0 / -mvPosition.z);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float alphaTest;
        uniform sampler2D pointTexture;
        void main(){

          gl_FragColor = vec4(uColor, 1.0);

          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);

          if(gl_FragColor.a < alphaTest) discard;
        }

      `,
    });

    let mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // 地球
    let R = 13;
    let sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(R, 32, 32),
      new THREE.MeshLambertMaterial({
        color: 0xcccccc,
        map: new THREE.TextureLoader().load("earth.jpg"),
      })
    );
    scene.add(sphereMesh);

    new THREE.TextureLoader().load("glow.png", function (texture) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        color: 0x4390d1,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(R * 3.0, R * 3.0, 1);
      scene.add(sprite);
    });

    function render(time) {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }
  simplex(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let light = new THREE.PointLight(0xaaccff);
    light.position.set(400, 0, 0);
    scene.add(light);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    let simplex = new SimplexNoise();

    let mat = new THREE.MeshPhongMaterial({
      color: 0xdfdfdf,
      flatShading: true,
    });

    let width = 600,
      height = 600,
      centerWidth = 200,
      centerHeight = 200;

    let cw = centerWidth / 2,
      ch = centerHeight / 2;

    let geometry = new THREE.PlaneGeometry(width, height, 600, 600);

    let array = geometry.attributes.position.array;
    let arr = [];
    for (let i = 0; i < array.length; i += 3) {
      let v = new THREE.Vector3(array[i], array[i + 1], array[i + 2]);

      if (v.x > -cw && v.x < cw && v.y > -ch && v.y < ch) {
      } else {
        v.z = getNoise(v.x * 0.01, v.y * 0.01, v.z * 0.01, 0) * 30;
        v.z += getNoise(v.x * 0.03, v.y * 0.03, v.z * 0.03, 0) * 5;
        v.z += getNoise(v.x * 0.1, v.y * 0.125, v.z * 0.125, 0);
      }

      arr.push(v.x, v.y, v.z);
    }
    console.log(geometry);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));

    let mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.set(0, -100, -150);
    scene.add(mesh);

    function getNoise(x, y, z, t) {
      return simplex.noise4d(x, y, z, t);
    }

    console.log(geometry);

    function render(time) {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  getLine(points, paramsOption) {
    const defOption = {
      isStraight: true, // 是否是直线
      divisions: 2000, // 路径对应的分段数
      color1: "#e9b860",
      color2: "#ffffff",
      pointSize: 10,
      speed: 1, // 速度，实际意义是每一帧运动的长度
      segment: 200, // 实际意义是每块部分的长度
      showArea: 0.5, // 每条线在对应部分的显示区域，0-1之间
      isClosed: false,
    };

    const option = Object.assign(defOption, paramsOption || {});

    let vec3Points = points.map(
      (item) => new THREE.Vector3(item[0], item[1], item[2])
    );

    // 1、绘制三维线条
    let curvePath = new THREE.CurvePath();
    if (option.isStraight) {
      vec3Points.reduce((p1, p2) => {
        const lineCurve = new THREE.LineCurve3(p1, p2);
        curvePath.add(lineCurve);
        return p2;
      });
      // 闭合直线
      option.isClosed &&
        curvePath.add(
          new THREE.LineCurve3(vec3Points[vec3Points.length - 1], vec3Points[0])
        );
    } else {
      let curve = new THREE.CatmullRomCurve3(vec3Points);
      // 闭合曲线
      if (option.isClosed) {
        curve.curveType = "centripetal";
        curve.closed = true;
      }
      curvePath.add(curve);
    }
    let pointsArr = curvePath.getPoints(option.divisions);

    const geometry1 = new THREE.BufferGeometry().setFromPoints(pointsArr);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry1, material);
    return { line, curvePath };
  }

  virtualize(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    let loader = new GLTFLoader();

    loader.load("/bdzzcjgd3.gltf", function (gltf) {
      scene.add(gltf.scene);
    });

    window.Controller = {
      wireframe: () => {
        scene.traverse((mesh) => {
          mesh.material.wireframe = !mesh.material.wireframe;
        });
      },
      virtualize: () => {
        scene.traverse((mesh) => {
          mesh.userData.material = mesh.material;
          mesh.material = new THREE.MeshLambertMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.4,
          });
        });
      },
      reset: () => {
        scene.traverse((mesh) => {
          mesh.material = mesh.userData.material;
        });
      },
    };

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    scene.add(new THREE.DirectionalLight(0xffffff));

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  lightLine(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    let line = this.createLightLine(
      [
        [-5, 0, -5],
        [5, 0, -5],
        [6, 0, 5],
        [5, 0, 10],
        [-5, 0, 10],
        [-5, 0, -3],
      ],
      {
        isStraight: true,
        speed: 1,
      }
    );

    scene.add(line);

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
    }

    render();
  }

  createLine2(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    // random vector3 points
    var points = [
      new THREE.Vector3(-15, 0, 15),
      new THREE.Vector3(15, 0, -15),
      new THREE.Vector3(6, 0, 15),
      new THREE.Vector3(15, 0, 10),
    ];

    // create PathPointList
    var pathPointList = new PathPointList();
    pathPointList.set(points, 2, 10, new THREE.Vector3(0, 1, 0), false);

    // create geometry
    var width = 0.4;
    var geometry = new PathGeometry();
    geometry.update(pathPointList, {
      width: width,
      arrow: false,
      progress: 1,
    });

    var texture = new THREE.TextureLoader().load(
      "/lightLine.png",
      function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // texture.anisotropy = 16;

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
      }
    );

    var material = new THREE.MeshPhongMaterial({
      // color : 0x58DEDE,
      depthWrite: true,
      transparent: true,
      // opacity: 0.9,
      side: THREE.DoubleSide,
    });
    material.map = texture;

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render(time) {
      requestAnimationFrame(render);
      controls.update();

      texture.offset.x -= 0.01;
      texture.repeat.x = 0.01;

      renderer.render(scene, camera);
    }

    render();
  }

  // 创建流光溢彩线
  createLightLine(points, paramsOption) {
    const defOption = {
      isStraight: true, // 是否是直线
      divisions: 2000, // 路径对应的分段数
      color1: "#e9b860",
      color2: "#ffffff",
      pointSize: 10,
      speed: 1, // 速度，实际意义是每一帧运动的长度
      segment: 200, // 实际意义是每块部分的长度
      showArea: 1, // 每条线在对应部分的显示区域，0-1之间
      isClosed: false,
    };

    const option = Object.assign(defOption, paramsOption || {});

    let vec3Points = points.map(
      (item) => new THREE.Vector3(item[0], item[1], item[2])
    );

    // 1、绘制三维线条
    let curvePath = new THREE.CurvePath();
    if (option.isStraight) {
      vec3Points.reduce((p1, p2) => {
        const lineCurve = new THREE.LineCurve3(p1, p2);
        curvePath.add(lineCurve);
        return p2;
      });
      // 闭合直线
      option.isClosed &&
        curvePath.add(
          new THREE.LineCurve3(vec3Points[vec3Points.length - 1], vec3Points[0])
        );
    } else {
      let curve = new THREE.CatmullRomCurve3(vec3Points);
      // 闭合曲线
      if (option.isClosed) {
        curve.curveType = "centripetal";
        curve.closed = true;
      }
      curvePath.add(curve);
    }
    let pointsArr = curvePath.getPoints(option.divisions);

    const geometry1 = new THREE.BufferGeometry().setFromPoints(pointsArr);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry1, material);

    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    for (let i = 0; i < option.divisions; i++) {
      attrCnumber.push(i);

      let index = i / (option.divisions - 1);

      let p = curvePath.getPointAt(index);
      attrPositions.push(p.x, p.y, p.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(attrPositions, 3)
    );
    geometry.setAttribute(
      "current",
      new THREE.Float32BufferAttribute(attrCnumber, 1)
    );

    const shader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new THREE.Color(option.color2),
        },
        uColor1: {
          value: new THREE.Color(option.color1),
        },
        uSize: {
          value: option.pointSize,
        },
        segment: {
          value: option.segment,
        },
        showArea: {
          value: option.showArea,
        },
        transition: {
          value: 0,
        },
      },
      vertexShader: `
        attribute float current;
        uniform float transition;
        uniform float uSize;
        uniform vec3 uColor;
        uniform vec3 uColor1;
        uniform float segment;
        uniform float showArea;
        varying vec3 vColor;
        varying float vOpacity;
        void main(){
          float size = uSize;
          
          float location = mod((current+transition)/segment, 1.0);

          if(location < showArea){
            vOpacity = 1.0-location;
          }else{
            vOpacity = 0.0;
          }

          // 顶点着色器计算后的Position
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          //大小
          gl_PointSize = vOpacity * size * 20.0 / (-mvPosition.z);
        }
        
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uColor1;
        varying float vOpacity;
        void main(){
          gl_FragColor = vec4(mix(uColor1, uColor, vOpacity), vOpacity);
        }
      `,
    });

    const point = new THREE.Points(geometry, shader);

    setInterval(() => {
      shader.uniforms.transition.value += option.speed;
    });

    return point;
  }

  pipeAnimation(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 30, 30);
    camera.lookAt(0, 0, 0);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/model.gltf",
      function (gltf) {
        scene.add(gltf.scene);

        let pipe = scene.getObjectByName("NG-0209-500-10A1-H001");
        window.pipe = pipe;

        let attrCnumber = [];
        for (let i = 0; i < pipe.geometry.attributes.position.count; i++) {
          attrCnumber.push(i);
        }

        pipe.geometry.setAttribute(
          "current",
          new THREE.Float32BufferAttribute(attrCnumber, 1)
        );

        let shader = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          uniforms: {
            uColor: {
              value: new THREE.Color("#00ff00"),
            },
            uColor1: {
              value: new THREE.Color("#ffffff"),
            },
            transition: {
              value: 0,
            },
          },
          vertexShader: `
            attribute float current;
            uniform vec3 uColor;
            uniform vec3 uColor1;
            uniform float transition;
            varying vec3 vColor;
            void main(){

              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPosition;

              // float index = mod(current/50.0, 1.0);

              if(current < 250.0){
                vColor = uColor;
              }else{
                vColor = uColor1;
              }
              // vColor = uColor1;

              //大小
              // gl_PointSize = 10.0 * 300.0 / (-mvPosition.z);
            }
            
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main(){
    
              gl_FragColor = vec4(vColor, 1.0);
            }
          `,
        });

        pipe.material = shader;
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

    // 添加光
    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
    scene.add(pointLight);

    let stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      stats.update();
    }

    render();
  }

  optimizeTree(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 30, 30);
    camera.lookAt(0, 0, 0);

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let loader = new GLTFLoader();

    loader.load("/shu1.gltf", function (gltf) {
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
    });

    function getLod(meshList) {
      const lod = new THREE.LOD();

      for (let item of meshList) {
        lod.addLevel(item);
      }
      return lod;
    }

    function getMergedMesh1(children, index) {
      console.log(children);
      let transform = new THREE.Object3D();
      let geometries = [];
      let material;
      for (let i = 0; i < children.length; i += 6) {
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
      return mergedMesh;
    }
    function getMergedMesh(mesh) {
      console.log(mesh, 1, window.performance.memory);
      let geometries = [];
      let material = mesh.material;
      let total = shuData.length;
      let transform = new THREE.Object3D();
      for (let index = 0; index < total; index += 10) {
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
      console.log(2, window.performance.memory, total);
      return mergedMesh;
    }

    function getInsMesh(mesh) {
      let insGeometry = mesh.geometry;
      let material = mesh.material;
      let total = shuData.length;
      //创建具有多个实例的实例化几何体
      let insMesh = new THREE.InstancedMesh(insGeometry, material, total);
      //修改位置
      let transform = new THREE.Object3D();
      for (let index = 0; index < total; index += 5) {
        let translation = shuData[index].translation;
        let scale = shuData[index].scale;
        transform.position.set(translation[0], translation[1], translation[2]);
        transform.scale.set(scale[0], scale[1], scale[2]);

        transform.updateMatrix();
        //修改实例化几何体中的单个实例的矩阵以改变大小、方向、位置等
        insMesh.setMatrixAt(index, transform.matrix);
      }
      return insMesh;
    }

    let stats = new Stats();
    document.body.appendChild(stats.domElement);
    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      stats.update();
    }

    render();
  }

  focusTo(controls, camera, cameraPosition, targetPosition, duration) {
    let d = duration || 1;

    gsap.to(controls.target, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: d,
      onUpdate() {
        controls.update();
      },
    });
    gsap.to(camera.position, {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,

      duration: d,
      onUpdate() {
        controls.update();
      },
    });
  }

  axisChange(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let infos = [
      {
        position: [5, 5, 5],
        dom: document.getElementById("label"),
      },
    ];

    let loader = new GLTFLoader();

    loader.load("/bdzzcjgd3.gltf", function (gltf) {
      scene.add(gltf.scene);
    });

    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
      for (let item of infos) {
        const standardVec = new THREE.Vector3(
          item.position[0],
          item.position[1],
          item.position[2]
        ).project(camera);

        const screenX = Math.round(centerX * standardVec.x + centerX);
        const screenY = Math.round(-centerY * standardVec.y + centerY);

        item.dom.style.left = screenX + "px";
        item.dom.style.top = screenY + "px";
      }
    }

    render();
  }
  CSS2DAnd3D(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

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

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    let _this = this;

    let infos = [
      {
        position: [-15, 5, -15],
        dom: document.getElementsByClassName("label")[0],
        onAddObject(item) {
          let label = item.object;
          item.dom.addEventListener("pointerdown", function () {
            // _this.focusTo(controls, camera, new THREE.Vector3(label.position.x,label.position.y+10,label.position.z+10), label.position)
          });
          // 设置标签不可见
          // label.visible = false;
        },
      },
      {
        position: [15, 7, 15],
        dom: document.getElementsByClassName("label")[1],
      },
      {
        position: [-15, 15, 15],
        dom: document.getElementsByClassName("label")[2],
      },
    ];

    // let loader = new GLTFLoader();

    // loader.load('/bdzzcjgd3.gltf', function(gltf){

    //   scene.add(gltf.scene)

    // })

    let labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    canvas.parentNode.appendChild(labelRenderer.domElement);

    this.createCSS3D(scene, infos);

    let controls1;

    let controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.update();

    let dragstart = function (event) {
      controls.enabled = false;
    };

    let dragend = function (event) {
      controls.enabled = true;
    };

    window.Controller = {
      startDrag() {
        // 1、关闭CSS3DRenderer
        labelRenderer.domElement.style.display = "none";

        // 2、把所有标签替换成小方块，加进DragControls
        let objects = [];
        let i = 0;
        infos.forEach((item) => {
          let mesh = new THREE.Mesh(
            new BoxGeometry(2, 2, 2),
            new THREE.MeshLambertMaterial({ color: 0x0000ff })
          );
          mesh.position.copy(item.object.position);
          scene.add(mesh);

          objects.push(mesh);

          item.mesh = mesh;

          item.index = i;
          item.dom.innerHTML = i;
          i++;

          console.log(item.object);
        });
        controls1 = new DragControls(objects, camera, renderer.domElement);
        controls1.addEventListener("drag", render1);

        // 3、把OrbitControls的dom元素替换掉
        controls.dispose();
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // 4、避免两个控制器冲突
        controls1.addEventListener("dragstart", dragstart);

        controls1.addEventListener("dragend", dragend);
      },
      endDrag() {
        // 1、开启CSS3DRenderer
        labelRenderer.domElement.style.display = "block";

        let obj = {};

        // 2、把所有小方块替换成标签
        infos.forEach((item) => {
          item.object.position.copy(item.mesh.position);

          item.mesh.removeFromParent();

          obj[item.index] = Object.values(item.mesh.position);
        });

        console.log(obj);

        // 3、关闭拖拽控制器
        controls1.removeEventListener("dragstart", dragstart);
        controls1.removeEventListener("dragend", dragend);
        controls1.dispose();

        // 4、还原OrbitControls
        controls.dispose();
        controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.update();
      },
    };

    function render1() {
      renderer.render(scene, camera);
    }

    function render() {
      requestAnimationFrame(render);

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }

    render();
  }
  // 创建3D标签
  // infos：Array<{dom:Object, position: Array<Integer>(3), callback: Function}>
  // return：Array<{dom:Object, position: Array<Integer>(3), callback: Function, object: CSS3DObject}>
  createCSS3D(scene, infos) {
    let objects = [];
    for (let item of infos) {
      const label = new CSS2DObject(item.dom);
      label.position.set(item.position[0], item.position[1], item.position[2]);

      scene.add(label);

      // 缩小dom元素
      label.scale.x = 0.1;
      label.scale.y = 0.1;
      label.scale.z = 0.1;

      item.object = label;

      item.onAddObject && item.onAddObject(item);

      objects.push(label);
    }
    return infos;
  }

  animationPath(renderer, canvas) {
    renderer.setClearColor(0xb9d3ff, 1); // 背景颜色

    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 30, 30);
    camera.lookAt(0, 0, 0);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);
    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

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

    const box1 = new Mesh(
      new BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xffff00 })
    );
    scene.add(box1);
    box1.position.set(-5, -2, -3);

    // 给物体头上添加摄像头
    // const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, 20);
    // const helper = new THREE.CameraHelper(camera1);
    // scene.add(helper)
    // boxMesh.add(camera1)
    // camera1.lookAt(0,-3,3)
    // camera1.position.y = 2;
    // camera1.rotateY(Math.PI)

    let animation = this.createAnimationPath(
      [
        [-5, -5, -5],
        [5, -3, -5],
        [6, -3, 5],
        [5, 5, 10],
        [-5, 5, 10],
      ],
      {
        mesh: boxMesh,
        speed: 1,
        isStraight: true,
        isClosed: false,
      },
      {
        onFinish: function () {
          // console.log('跑完一圈');
          animation.stop();
        },
        onUpdate: _.throttle(
          (mesh) => {
            // console.log('update',position);
          },
          800,
          { leading: true }
        ),
      }
    );
    animation.start();

    scene.add(animation.line);

    let isCamera1 = false;
    window.Controller = {
      toggleCamera() {
        isCamera1 = !isCamera1;
      },
    };

    function render() {
      // isCamera1 ? renderer.render(scene, camera1) : renderer.render(scene, camera)
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }

  // 创建动画路径 API
  createAnimationPath(points, paramsOption, listener) {
    const defOption = {
      speedSegment: 1000, // 速度对应的分段数，范围是大于0
      speed: 1, // 范围在0-segment之间，实际意义是每一帧跑多远
      mesh: null,
      isStraight: true, // 是否是直线
      divisions: 100, // 路径对应的分段数
      isClosed: false,
      radius: 0.1, // 圆角，范围是0-1，实际意义是利用占比radius的线条来画圆角
    };

    const option = Object.assign(defOption, paramsOption || {});

    let vec3Points = points.map(
      (item) => new THREE.Vector3(item[0], item[1], item[2])
    );

    // 1、绘制三维线条
    let curvePath = new THREE.CurvePath();
    if (option.isStraight) {
      let linePoints = [];
      let lineCount = vec3Points.length - 1;
      // 闭合直线
      if (option.isClosed) {
        vec3Points.push(vec3Points[0].clone());
      }
      vec3Points.reduce((p1, p2) => {
        const lineCurve = new THREE.LineCurve3(p1, p2);

        let front1 = lineCurve.getPointAt(option.radius / 2); // 起点
        let front = lineCurve.getPointAt(option.radius); // 第一个控制点
        let last = lineCurve.getPointAt(1 - option.radius); // 第二个控制点
        let last1 = lineCurve.getPointAt(1 - option.radius / 2); // 终点

        linePoints.push(front1);
        linePoints.push(front);
        linePoints.push(last);
        linePoints.push(last1);

        return p2;
      });

      for (let i = 0; i < linePoints.length; i++) {
        // 直线
        if (i % 4 === 1) {
          let p1 = linePoints[i],
            p2 = linePoints[(i + 1) % linePoints.length];
          const lineCurve = new THREE.LineCurve3(p1, p2);
          curvePath.add(lineCurve);
        } else if (i % 4 === 2) {
          // 线条不闭合，并且到最后一个点时
          if (!option.isClosed && (i + 2) / 4 === lineCount) {
            break;
          }
          // 贝塞尔曲线
          let p1 = linePoints[i],
            p2 = linePoints[(i + 1) % linePoints.length],
            p3 = linePoints[(i + 2) % linePoints.length],
            p4 = linePoints[(i + 3) % linePoints.length];
          const lineCurve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
          curvePath.add(lineCurve);
        }
      }
    } else {
      let curve = new THREE.CatmullRomCurve3(vec3Points);
      // 闭合曲线
      if (option.isClosed) {
        curve.curveType = "centripetal";
        curve.closed = true;
      }
      curvePath.add(curve);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(
      curvePath.getPoints(option.divisions)
    );
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);

    // 2、获取每个分段数对应的时间点，每个时间点之间的间距是 option.speed
    const timeArray = [];
    for (let i = 0; i < option.speedSegment; i += option.speed) {
      timeArray.push(i / (option.speedSegment - 1));
    }

    const targetPosition = new THREE.Vector3();
    const meshPosition = new THREE.Vector3();

    // 3、控制动画是否开始
    const obj = {
      line,
      isStarted: false,
      start() {
        this.isStarted = true;
        render();
      },
      stop() {
        this.isStarted = false;
      },
    };

    let index = 0;
    function render() {
      obj.isStarted && requestAnimationFrame(render);

      // 一圈运动结束
      if (index === timeArray.length - 1) {
        listener?.onFinish && listener.onFinish();
      }
      if (!obj.isStarted) return;

      // 限制 index 范围
      index = index % (timeArray.length - 1);

      // 获取当前时间段的 路径 坐标
      curvePath.getPointAt(timeArray[index], meshPosition);
      option.mesh.position.set(meshPosition.x, meshPosition.y, meshPosition.z);

      // 获取 路径 前一点坐标
      curvePath.getPointAt(timeArray[index + 1], targetPosition);
      option.mesh.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);

      listener?.onUpdate && listener?.onUpdate(option.mesh);

      index++;
    }

    return obj;
  }

  // 创建围栏 API
  createFence(points, paramsOption, callback) {
    const defOption = {
      height: 10,
      bgColor: "#00FF00",
      warnColor: "#FF0000",
      lineColor: "#FFFF00",
      segment: 1.5, // 线条密度，实际意义是线条之间的间距
      maxOpacity: 1, // 最大透明度
      meshList: [], // 要闯入围栏的物体列表
      duration: 2000,
    };

    const option = Object.assign(defOption, paramsOption);

    const height = option.height;
    const translateY = {
      value: 0,
    };

    const group = new THREE.Group();
    const planeBoxMap = {};
    const meshBoxMap = {};

    // 给要闯入围栏的物体加包围盒
    for (let item of option.meshList) {
      let box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      box.setFromObject(item);
      meshBoxMap[item.uuid] = { box: box, mesh: item };
    }

    let vec3Points = points.map(
      (item) => new THREE.Vector3(item[0], item[1], item[2])
    );

    vec3Points.reduce((p1, p2) => {
      const geometry = new THREE.BufferGeometry();
      // 创建一个简单的矩形. 在这里我们右上和左下顶点被复制了两次。
      // 因为在两个三角面片里，这两个顶点都需要被用到。
      const vertices = new Float32Array([
        p1.x,
        p1.y + height,
        p1.z, // 左上角
        p1.x,
        p1.y,
        p1.z, // 左下角
        p2.x,
        p2.y + height,
        p2.z, // 右上角

        p2.x,
        p2.y + height,
        p2.z, // 右上角
        p1.x,
        p1.y,
        p1.z, // 左下角
        p2.x,
        p2.y,
        p2.z, // 右下角
      ]);

      const points = new Float32Array([
        p1.x,
        p1.y,
        p1.z,
        p1.x,
        p1.y,
        p1.z,
        p2.x,
        p2.y,
        p2.z,
        p2.x,
        p2.y,
        p2.z,
        p1.x,
        p1.y,
        p1.z,
        p2.x,
        p2.y,
        p2.z,
      ]);

      // itemSize = 3 因为每个顶点都是一个三元组。
      geometry.setAttribute("myposition", new THREE.BufferAttribute(points, 3));
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
      });

      const shader = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uColor: {
            value: new THREE.Color(option.bgColor),
          },
          uColor1: {
            value: new THREE.Color(option.lineColor),
          },
          uSize: {
            value: 10,
          },
          maxOpacity: {
            value: +option.maxOpacity.toFixed(1),
          },
          height: {
            value: +option.height.toFixed(1),
          },
          segment: {
            value: +option.segment.toFixed(1),
          },
          translateY,
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
        `,
      });
      const mesh = new THREE.Mesh(geometry, shader);
      group.add(mesh);

      let triangle1 = new THREE.Triangle(
        new THREE.Vector3(p1.x, p1.y + height, p1.z),
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y + height, p2.z)
      );
      let triangle2 = new THREE.Triangle(
        new THREE.Vector3(p2.x, p2.y + height, p2.z),
        new THREE.Vector3(p1.x, p1.y, p1.z),
        new THREE.Vector3(p2.x, p2.y, p2.z)
      );

      planeBoxMap[mesh.uuid] = { mesh, triangle1, triangle2 };

      return p2;
    });

    // 恢复
    const reset = _.throttle(
      (plane, mesh) => {
        plane.mesh.material.uniforms.uColor.value = new THREE.Color(
          option.bgColor
        );
      },
      option.duration,
      { leading: false, trailing: true }
    );

    // 告警
    const warn = _.debounce(
      (plane, mesh) => {
        plane.mesh.material.uniforms.uColor.value = new THREE.Color(
          option.warnColor
        );
        callback(mesh.mesh, plane.mesh);

        // plane.timer && clearTimeout(plane.timer)
        // plane.timer = setTimeout(function(){
        //   plane.mesh.material.uniforms.uColor.value = new THREE.Color(option.bgColor);
        // }, option.duration)
      },
      150,
      { leading: true }
    );

    function animation() {
      translateY.value -= 0.02;
      requestAnimationFrame(animation);

      for (let meshKey in meshBoxMap) {
        meshBoxMap[meshKey].box.setFromObject(meshBoxMap[meshKey].mesh);
      }

      for (let planeKey in planeBoxMap) {
        for (let meshKey in meshBoxMap) {
          const plane = planeBoxMap[planeKey],
            mesh = meshBoxMap[meshKey];
          if (
            plane.triangle1.intersectsBox(mesh.box) ||
            plane.triangle2.intersectsBox(mesh.box)
          ) {
            warn(plane, mesh);
          } else {
            plane.mesh.material.uniforms.uColor.value = new THREE.Color(
              option.bgColor
            );
          }
        }
      }
    }
    animation();

    return group;
  }

  fence(renderer, canvas) {
    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();
    // 场景
    const scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(100);
    scene.add(axis);

    const width = 20,
      height = 10; // 圈圈之间的间隔高度

    const attrCindex = [];

    for (let i = 0; i < height; i++) {
      attrCindex.push(i / (height - 1));
    }

    const geometry = new THREE.PlaneGeometry(width, height);
    geometry.setAttribute(
      "index",
      new THREE.Float32BufferAttribute(attrCindex, 1)
    );

    const box = new THREE.BoxGeometry(1, 1, 1);
    const boxMesh = new Mesh(box, new MeshLambertMaterial({ color: 0x0000ff }));
    scene.add(boxMesh);

    boxMesh.position.z = 8;

    gsap.to(boxMesh.position, {
      z: -1,
      duration: 5,
      repeat: -1,
      yoyo: true,
      onUpdate: () => {},
    });

    let ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    let group = this.createFence(
      [
        // [-6,-1],
        [5, -1, -1],
        [5, 4, 1],
        [-6, -1, 6],
      ],
      {
        height: 10,
        meshList: [boxMesh],
        startHeight: -5,
        maxOpacity: 1,

        bgColor: "#00FF00",
        warnColor: "#FF0000",
        lineColor: "#FFFF00",
        segment: 4, // 线条密度
        duration: 1000,
      },
      function (mesh) {
        // console.log('碰撞了');
      }
    );
    scene.add(group);

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }

  particle_system(renderer, canvas) {
    // renderer.setClearColor(0xb9d3ff, 1)
    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();
    // 场景
    const scene = new THREE.Scene();

    const vertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({ color: 0x888888 });

    const points = new THREE.Points(geometry, material);

    scene.add(points);

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }
  ray_marching(renderer, canvas) {
    const left = -1,
      right = 1,
      top = 1,
      bottom = -1,
      near = 0,
      far = 1,
      zoom = 1;
    // 透视投影相机
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();

    // 场景
    const scene = new THREE.Scene();

    let ambiColor = "#ffffff";
    let ambientLight = new THREE.AmbientLight(ambiColor);

    scene.add(ambientLight);

    // 添加光
    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
    scene.add(pointLight);

    // 创建平面
    const geometry = new THREE.PlaneBufferGeometry(2, 2, 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    scene.add(new Mesh(geometry, material));

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }
  shader_fly_line(renderer, canvas) {
    // renderer.setClearColor(0xb9d3ff, 1)
    const fov = 40; // 视野范围
    const aspect = 2; // 相机默认值 画布的宽高比
    const near = 0.1; // 近平面
    const far = 10000; // 远平面
    // 透视投影相机
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 300);
    camera.lookAt(0, 0, 0);
    // 控制相机
    const controls = new OrbitControls(camera, canvas);
    controls.update();
    // 场景
    const scene = new THREE.Scene();

    const positions = [];
    const attrPositions = [];
    const attrCindex = [];
    const attrCnumber = [];

    // 粒子位置计算
    const source = -500;
    const target = 500;
    const number = 1000;
    const height = 300;
    const total = target - source;

    for (let i = 0; i < number; i++) {
      // 在0-1之间取1000个值
      const index = i / (number - 1);
      // 在-500-500之间取1000个x坐标
      const x = total * index - total / 2;
      const y = Math.sin(index * Math.PI) * height;
      positions.push({
        x,
        y,
        z: 0,
      });
      attrCindex.push(index);
      attrCnumber.push(i);
    }

    positions.forEach((p) => {
      attrPositions.push(p.x, p.y, p.z);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(attrPositions, 3)
    );
    geometry.setAttribute(
      "index",
      new THREE.Float32BufferAttribute(attrCindex, 1)
    );
    geometry.setAttribute(
      "current",
      new THREE.Float32BufferAttribute(attrCnumber, 1)
    );

    const shader = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new THREE.Color("#FF0000"),
        },
        uColor1: {
          value: new THREE.Color("#FFFFFF"),
        },
        uRange: {
          value: 100,
        },
        uSize: {
          value: 20,
        },
        uTotal: {
          value: number,
        },
        time: {
          value: 0,
        },
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
      `,
    });

    const point = new THREE.Points(geometry, shader);

    scene.add(point);

    setInterval(() => {
      shader.uniforms.time.value += 0.001;
    });

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }

  handleClick() {
    console.log("click 1");
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <canvas id="c2d" style={{ width: "100%", height: "100%" }}></canvas>

        <div
          className="label"
          draggable={true}
          style={{
            width: "100px",
            height: "50px",
            position: "absolute",
            background: "antiquewhite",
          }}
          onMouseDown={this.handleClick}
        >
          这是标签
        </div>
        <div
          className="label"
          draggable={true}
          style={{
            width: "100px",
            height: "50px",
            position: "absolute",
            background: "antiquewhite",
          }}
          onMouseDown={this.handleClick}
        >
          这是标签
        </div>
        <div
          className="label"
          draggable={true}
          style={{
            width: "100px",
            height: "50px",
            position: "absolute",
            background: "antiquewhite",
          }}
          onMouseDown={this.handleClick}
        >
          这是标签
        </div>
      </div>
    );
  }
}
