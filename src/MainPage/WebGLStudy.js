/*
 * @Author: Wjh
 * @Date: 2023-03-22 21:09:11
 * @LastEditors: Wjh
 * @LastEditTime: 2023-04-16 13:40:58
 * @FilePath: \howfar\src\MainPage\WebGLStudy.js
 * @Description: 
 * 
 */
import React from "react";
import vertex_1 from "../shaders/vertex-1";
import fragment_1 from "../shaders/fragment-1";
import vertex_2 from "../shaders/vertex-2";
import fragment_2 from "../shaders/fragment-2";
import vertex_3 from "../shaders/vertex-3";
import fragment_3 from "../shaders/fragment-3";
import vertex_4 from "../shaders/vertex-4";
import fragment_4 from "../shaders/fragment-4";
import vertex_5 from "../shaders/vertex-5";
import fragment_5 from "../shaders/fragment-5";
import vertex_6 from "../shaders/vertex-6";
import fragment_6 from "../shaders/fragment-6";
import vertex_7 from "../shaders/vertex-7";
import fragment_7 from "../shaders/fragment-7";
import vertex_8 from "../shaders/vertex-8";
import fragment_8 from "../shaders/fragment-8";
import vertex_9 from "../shaders/vertex-9";
import fragment_9 from "../shaders/fragment-9";
import vertex_10 from "../shaders/vertex-10";
import fragment_10 from "../shaders/fragment-10";
import vertex_11 from "../shaders/vertex-11";
import fragment_11 from "../shaders/fragment-11";
import vertex_12 from "../shaders/vertex-12";
import fragment_12 from "../shaders/fragment-12";
import vertex_13 from "../shaders/vertex-13";
import fragment_13 from "../shaders/fragment-13";
import vertex_13_color from "../shaders/vertex-13-color";
import fragment_13_color from "../shaders/fragment-13-color";
import vertex_14 from "../shaders/vertex-14";
import fragment_14 from "../shaders/fragment-14";
import vertex_14_color from "../shaders/vertex-14-color";
import fragment_14_color from "../shaders/fragment-14-color";
import { m3 } from "../webgl-libs/m3";
import { webglLessonsUI } from "../webgl-libs/webgl-lessons-ui";
import * as THREE from "three";
import { transition } from "d3";

import { m4 } from "../webgl-libs/m4";
import * as twgl from 'twgl.js'
import {primitives} from 'twgl.js'
import {textureUtils} from '../webgl-libs/texture-utils'
import chroma from '../webgl-libs/chroma.min.js'
import ftexture from '../assets/f-texture.png'
window.THREE = THREE;
window.m3 = m3;

export default class WebGLStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    // this.first();    // Webgl基础概念
    // this.second();   // Webgl工作原理
    // this.third();       // Webgl图像处理  帧缓冲有点懵懵的呢
    // this.fourth(); // webgl二维平移、旋转、缩放
    // this.fifth(); // 二维矩阵
    // this.sixth(); // 三维正交、透视投影、三维相机
    // this.seventh();   // 三维方向光、点光源、聚光灯
    // this.eighth();    // 码少趣多
    // this.ninth();     // 绘制多个物体
    // this.primitives_test();
    // this.tenth();   // WebGL三维纹理、码少趣多
    // this.eleventh();  // WebGL多视图、多画布
    // this.twelfth();   // WebGL可视化相机
    this.thirteen();    // WebGL平面的和透视的投影映射
  }
  thirteen(){
    let gl = document.querySelector('#box').getContext('webgl');

    const textureProgramInfo = twgl.createProgramInfo(gl, [vertex_14, fragment_14]);
    const colorProgramInfo = twgl.createProgramInfo(gl, [vertex_14_color, fragment_14_color]);

    const sphereBufferInfo = primitives.createSphereBufferInfo(
      gl,
      1,  // radius
      12, // subdivisions around
      6,  // subdivisions down
    );
    const planeBufferInfo = primitives.createPlaneBufferInfo(
        gl,
        20,  // width
        20,  // height
        1,   // subdivisions across
        1,   // subdivisions down
    );
    const cubeLinesBufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: [
        -1, -1, -1,
        1, -1, -1,
        -1,  1, -1,
        1,  1, -1,
        -1, -1,  1,
        1, -1,  1,
        -1,  1,  1,
        1,  1,  1,
      ],
      indices: [
        0, 1,
        1, 3,
        3, 2,
        2, 0,

        4, 5,
        5, 7,
        7, 6,
        6, 4,

        0, 4,
        1, 5,
        3, 7,
        2, 6,
      ],
    });

    // make a 8x8 checkerboard texture
    const checkerboardTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.LUMINANCE,     // internal format
        8,                // width
        8,                // height
        0,                // border
        gl.LUMINANCE,     // format
        gl.UNSIGNED_BYTE, // type
        new Uint8Array([  // data
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
          0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
        ]));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    function loadImageTexture(url) {
      // Create a texture.
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Fill the texture with a 1x1 blue pixel.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));
      // Asynchronously load an image
      const image = new Image();
      image.src = url;
      image.crossOrigin = 'anonymous';
      image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        // assumes this texture is a power of 2
        gl.generateMipmap(gl.TEXTURE_2D);
        render();
      });
      return texture;
    }

    const imageTexture = loadImageTexture('https://webglfundamentals.org/webgl/resources/f-texture.png');  

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    const settings = {
      cameraX: 2.75,
      cameraY: 5,
      posX: 2.5,
      posY: 4.8,
      posZ: 4.3,
      targetX: 2.5,
      targetY: 0,
      targetZ: 3.5,
      projWidth: 1,
      projHeight: 1,
      perspective: true,
      fieldOfView: 45,
    };
    webglLessonsUI.setupUI(document.querySelector('#ui'), settings, [
      { type: 'slider',   key: 'cameraX',    min: -10, max: 10, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'cameraY',    min:   1, max: 20, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'posX',       min: -10, max: 10, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'posY',       min:   1, max: 20, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'posZ',       min:   1, max: 20, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'targetX',    min: -10, max: 10, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'targetY',    min:   0, max: 20, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'targetZ',    min: -10, max: 20, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'projWidth',  min:   0, max:  2, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'projHeight', min:   0, max:  2, change: render, precision: 2, step: 0.001, },
      { type: 'checkbox', key: 'perspective', change: render, },
      { type: 'slider',   key: 'fieldOfView', min:  1, max: 179, change: render, },
    ]);

    const fieldOfViewRadians = degToRad(60);

    // Uniforms for each object.
    const planeUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],  // lightblue
      u_texture: checkerboardTexture,
      u_world: m4.translation(0, 0, 0),
    };
    const sphereUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],  // pink
      u_texture: checkerboardTexture,
      u_world: m4.translation(2, 3, 4),
    };

    function drawScene(projectionMatrix, cameraMatrix) {
      // Make a view matrix from the camera matrix.
      const viewMatrix = m4.inverse(cameraMatrix);

      const textureWorldMatrix = m4.lookAt(
          [settings.posX, settings.posY, settings.posZ],          // position
          [settings.targetX, settings.targetY, settings.targetZ], // target
          [0, 1, 0],                                              // up
      );
      const textureProjectionMatrix = settings.perspective
          ? m4.perspective(
              degToRad(settings.fieldOfView),
              settings.projWidth / settings.projHeight,
              0.1,  // near
              200)  // far
          : m4.orthographic(
              -settings.projWidth / 2,   // left
              settings.projWidth / 2,   // right
              -settings.projHeight / 2,  // bottom
              settings.projHeight / 2,  // top
              0.1,                      // near
              200);                     // far

      let textureMatrix = m4.identity();
      textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
      textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
      textureMatrix = m4.multiply(textureMatrix, textureProjectionMatrix);
      // use the inverse of this world matrix to make
      // a matrix that will transform other positions
      // to be relative this world space.
      textureMatrix = m4.multiply(
          textureMatrix,
          m4.inverse(textureWorldMatrix));

      gl.useProgram(textureProgramInfo.program);

      // set uniforms that are the same for both the sphere and plane
      twgl.setUniforms(textureProgramInfo, {
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_textureMatrix: textureMatrix,
        u_projectedTexture: imageTexture,
      });

      // ------ Draw the sphere --------

      // Setup all the needed attributes.
      twgl.setBuffersAndAttributes(gl, textureProgramInfo, sphereBufferInfo);

      // Set the uniforms unique to the sphere
      twgl.setUniforms(textureProgramInfo, sphereUniforms);

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(gl, sphereBufferInfo);

      // ------ Draw the plane --------

      // Setup all the needed attributes.
      twgl.setBuffersAndAttributes(gl, textureProgramInfo, planeBufferInfo);

      // Set the uniforms we just computed
      twgl.setUniforms(textureProgramInfo, planeUniforms);

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(gl, planeBufferInfo);

      // ------ Draw the cube ------

      gl.useProgram(colorProgramInfo.program);

      // Setup all the needed attributes.
      twgl.setBuffersAndAttributes(gl, colorProgramInfo, cubeLinesBufferInfo);

      // scale the cube in Z so it's really long
      // to represent the texture is being projected to
      // infinity
      const mat = m4.multiply(
          textureWorldMatrix, m4.inverse(textureProjectionMatrix));

      // Set the uniforms we just computed
      twgl.setUniforms(colorProgramInfo, {
        u_color: [0, 0, 0, 1],
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_world: mat,
      });

      // calls gl.drawArrays or gl.drawElements
      twgl.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
    }

    // Draw the scene.
    function render() {
      twgl.resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Compute the projection matrix
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      // Compute the camera's matrix using look at.
      const cameraPosition = [settings.cameraX, settings.cameraY, 7];
      const target = [0, 0, 0];
      const up = [0, 1, 0];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);

      drawScene(projectionMatrix, cameraMatrix);
    }
    render();
    
  }
  twelfth(){
    let gl = document.querySelector('#box').getContext('webgl');

    const vertexColorProgramInfo = twgl.createProgramInfo(gl, [vertex_13, fragment_13]);
    const solidColorProgramInfo = twgl.createProgramInfo(gl, [vertex_13_color, fragment_13_color]);

    const fBufferInfo = primitives.create3DFBufferInfo(gl);

    function createClipspaceCubeBufferInfo(gl) {
      // 首先，让我们添加一个立方体。它的范围是 1 到 3，
      // 因为相机看向的是 -Z 方向，所以我们想要相机在 Z = 0 处开始。
      // 我们会把一个圆锥放到该立方体的前面，
      // 且该圆锥的开口方向朝 -Z 方向。
      const positions = [
        -1, -1, -1,  // 立方体的顶点
         1, -1, -1,
        -1,  1, -1,
         1,  1, -1,
        -1, -1,  1,
         1, -1,  1,
        -1,  1,  1,
         1,  1,  1,
      ];
      const indices = [
        0, 1, 1, 3, 3, 2, 2, 0, // 立方体的索引
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 3, 7, 2, 6,
      ];
      return twgl.createBufferInfoFromArrays(gl, {
        position: positions,
        indices,
      });
    }

    // create geometry for a camera
    function createCameraBufferInfo(gl, scale = 1) {
      // first let's add a cube. It goes from 1 to 3
      // because cameras look down -Z so we want
      // the camera to start at Z = 0. We'll put a
      // a cone in front of this cube opening
      // toward -Z
      const positions = [
        -1, -1,  1,  // cube vertices
        1, -1,  1,
        -1,  1,  1,
        1,  1,  1,
        -1, -1,  3,
        1, -1,  3,
        -1,  1,  3,
        1,  1,  3,
        0,  0,  1,  // cone tip
      ];
      const indices = [
        0, 1, 1, 3, 3, 2, 2, 0, // cube indices
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 3, 7, 2, 6,
      ];
      // add cone segments
      const numSegments = 6;
      const coneBaseIndex = positions.length / 3;
      const coneTipIndex =  coneBaseIndex - 1;
      for (let i = 0; i < numSegments; ++i) {
        const u = i / numSegments;
        const angle = u * Math.PI * 2;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        positions.push(x, y, 0);
        // line from tip to edge
        indices.push(coneTipIndex, coneBaseIndex + i);
        // line from point on edge to next point on edge
        indices.push(coneBaseIndex + i, coneBaseIndex + (i + 1) % numSegments);
      }
      positions.forEach((v, ndx) => {
        positions[ndx] *= scale;
      });
      return twgl.createBufferInfoFromArrays(gl, {
        position: positions,
        indices,
      });
    }

    const cameraScale = 20;
    const cameraBufferInfo = createCameraBufferInfo(gl, cameraScale);

    const clipspaceCubeBufferInfo = createClipspaceCubeBufferInfo(gl);

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    const settings = {
      rotation: 150,  // in degrees
      cam1FieldOfView: 60,  // in degrees
      cam1PosX: 0,
      cam1PosY: 0,
      cam1PosZ: -200,
      cam1Near: 30,
      cam1Far: 500,
    };
    webglLessonsUI.setupUI(document.querySelector('#ui'), settings, [
      { type: 'slider',   key: 'rotation',     min: 0, max: 360, change: render, precision: 2, step: 0.001, },
      { type: 'slider',   key: 'cam1FieldOfView',  min: 1, max: 170, change: render, },
      { type: 'slider',   key: 'cam1PosX',     min: -200, max: 200, change: render, },
      { type: 'slider',   key: 'cam1PosY',     min: -200, max: 200, change: render, },
      { type: 'slider',   key: 'cam1PosZ',     min: -200, max: 200, change: render, },
    ]);

    function drawScene(projectionMatrix, cameraMatrix, worldMatrix) {
      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Make a view matrix from the camera matrix.
      const viewMatrix = m4.inverse(cameraMatrix);

      let mat = m4.multiply(projectionMatrix, viewMatrix);
      mat = m4.multiply(mat, worldMatrix);

      gl.useProgram(vertexColorProgramInfo.program);

      // ------ Draw the F --------

      // Setup all the needed attributes.
      twgl.setBuffersAndAttributes(gl, vertexColorProgramInfo, fBufferInfo);

      // Set the uniforms
      twgl.setUniforms(vertexColorProgramInfo, {
        u_matrix: mat,
      });

      twgl.drawBufferInfo(gl, fBufferInfo);
    }

    function render() {
      twgl.resizeCanvasToDisplaySize(gl.canvas);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.SCISSOR_TEST);

      // we're going to split the view in 2
      const effectiveWidth = gl.canvas.clientWidth / 2;
      const aspect = effectiveWidth / gl.canvas.clientHeight;
      const near = 1;
      const far = 2000;

      // Compute a perspective projection matrix
      const perspectiveProjectionMatrix =
          m4.perspective(degToRad(settings.cam1FieldOfView), aspect, settings.cam1Near, settings.cam1Far);

      // Compute the camera's matrix using look at.
      const cameraPosition = [
          settings.cam1PosX,
          settings.cam1PosY,
          settings.cam1PosZ,
      ];
      const target = [0, 0, 0];
      const up = [0, 1, 0];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);

      let worldMatrix = m4.yRotation(degToRad(settings.rotation));
      worldMatrix = m4.xRotate(worldMatrix, degToRad(settings.rotation));
      // center the 'F' around its origin
      worldMatrix = m4.translate(worldMatrix, -35, -75, -5);

      const {width, height} = gl.canvas;
      const leftWidth = width / 2 | 0;

      // draw on the left with orthographic camera
      gl.viewport(0, 0, leftWidth, height);
      gl.scissor(0, 0, leftWidth, height);
      gl.clearColor(1, 0.8, 0.8, 1);

      drawScene(perspectiveProjectionMatrix, cameraMatrix, worldMatrix);

      // draw on right with perspective camera
      const rightWidth = width - leftWidth;
      gl.viewport(leftWidth, 0, rightWidth, height);
      gl.scissor(leftWidth, 0, rightWidth, height);
      gl.clearColor(0.8, 0.8, 1, 1);

      // compute a second projection matrix and a second camera
      const perspectiveProjectionMatrix2 =
          m4.perspective(degToRad(60), aspect, near, far);

      // Compute the camera's matrix using look at.
      const cameraPosition2 = [-600, 400, -400];
      const target2 = [0, 0, 0];
      const cameraMatrix2 = m4.lookAt(cameraPosition2, target2, up);

      drawScene(perspectiveProjectionMatrix2, cameraMatrix2, worldMatrix);

      // draw object to represent first camera
      {
        // Make a view matrix from the 2nd camera matrix.
        const viewMatrix = m4.inverse(cameraMatrix2);

        let mat = m4.multiply(perspectiveProjectionMatrix2, viewMatrix);
        // use the first's camera's matrix as the matrix to position
        // the camera's representative in the scene
        mat = m4.multiply(mat, cameraMatrix);

        gl.useProgram(solidColorProgramInfo.program);

        // ------ Draw the Camera Representation --------

        // Setup all the needed attributes.
        twgl.setBuffersAndAttributes(gl, solidColorProgramInfo, cameraBufferInfo);

        // Set the uniforms
        twgl.setUniforms(solidColorProgramInfo, {
          u_matrix: mat,
          u_color: [0, 0, 0, 1],
        });

        twgl.drawBufferInfo(gl, cameraBufferInfo, gl.LINES);

        // 绘制视椎体
        mat = m4.multiply(mat, m4.inverse(perspectiveProjectionMatrix));

        twgl.setBuffersAndAttributes(gl, solidColorProgramInfo, clipspaceCubeBufferInfo);

        twgl.setUniforms(solidColorProgramInfo, {
          u_matrix: mat,
          u_color: [0,0,0,1],
        });

        twgl.drawBufferInfo(gl, clipspaceCubeBufferInfo, gl.LINES);
      }
    }
    render();

    // 为一个相机创建几何
    function createCameraBufferInfo(gl, scale = 1) {
      // first let's add a cube. It goes from 1 to 3
      // because cameras look down -Z so we want
      // the camera to start at Z = 0. We'll put a
      // a cone in front of this cube opening
      // toward -Z
      const positions = [
        -1, -1,  1,  // cube vertices
         1, -1,  1,
        -1,  1,  1,
         1,  1,  1,
        -1, -1,  3,
         1, -1,  3,
        -1,  1,  3,
         1,  1,  3,
         0,  0,  1,  // cone tip
      ];
      const indices = [
        0, 1, 1, 3, 3, 2, 2, 0, // cube indices
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 3, 7, 2, 6,
      ];
      // add cone segments
      const numSegments = 6;
      const coneBaseIndex = positions.length / 3;
      const coneTipIndex =  coneBaseIndex - 1;
      for (let i = 0; i < numSegments; ++i) {
        const u = i / numSegments;
        const angle = u * Math.PI * 2;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        positions.push(x, y, 0);
        // line from tip to edge
        indices.push(coneTipIndex, coneBaseIndex + i);
        // line from point on edge to next point on edge
        indices.push(coneBaseIndex + i, coneBaseIndex + (i + 1) % numSegments);
      }
      positions.forEach((v, ndx) => {
        positions[ndx] *= scale;
      });
      return twgl.createBufferInfoFromArrays(gl, {
        position: positions,
        indices,
      });
    }
  }
  eleventh(){
    let gl = document.querySelector('#box').getContext('webgl');
    const programInfo = twgl.createProgramInfo(gl, [vertex_12, fragment_12]);

    const bufferInfo = primitives.create3DFBufferInfo(gl);

    function degToRad(d){
      return d * Math.PI / 180;
    }

    const settings = {
      rotation: 150
    }
    webglLessonsUI.setupUI(document.querySelector('#ui'), settings, [
      { type: 'slider',   key: 'rotation',   min: 0, max: 360, change: render, precision: 2, step: 0.001, },
    ]);
    const fieldOfViewRadians = degToRad(120);

    render();

    function drawScene(projectionMatrix, cameraMatrix, worldMatrix){
      // 清楚画布和深度缓冲区
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const viewMatrix = m4.inverse(cameraMatrix);

      let mat = m4.multiply(projectionMatrix, viewMatrix);
      mat = m4.multiply(mat, worldMatrix);

      gl.useProgram(programInfo.program);

      twgl.setBuffersAndAttributes(gl, programInfo.attribSetters, bufferInfo);

      twgl.setUniforms(programInfo, {
        u_matrix: mat,
      });

      twgl.drawBufferInfo(gl, bufferInfo);
    }

    function render(){
      twgl.resizeCanvasToDisplaySize(gl.canvas);

      // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.SCISSOR_TEST);
      
      // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const effectiveWidth = gl.canvas.clientWidth / 2;
      const aspect = effectiveWidth / gl.canvas.clientHeight;
      
      const near = 1;
      const far = 2000;
      const perspectiveProjectionMatrix = m4.perspective(fieldOfViewRadians, aspect, near, far);

      // 计算正射投影矩阵
      const halfHeightUnits = 120;
      const orthographicProjectionMatrix = m4.orthographic(
        -halfHeightUnits * aspect,  // 左边
        halfHeightUnits * aspect,  // 正确的
        -halfHeightUnits,           // 底部
        halfHeightUnits,           // 顶部
        -75,                       // 靠近
        2000);                     // 远的

      const cameraPosition = [0, 0, -75];
      const target = [0,0,0];
      const up = [0,1,0];
      const cameraMatrix = m4.lookAt(cameraPosition, target, up);

      let worldMatrix = m4.yRotation(degToRad(settings.rotation));
      worldMatrix = m4.xRotate(worldMatrix, degToRad(settings.rotation));
      worldMatrix = m4.translate(worldMatrix, -35, -75, -5);

      const {width, height} = gl.canvas;
      const leftWidth = width / 2 | 0;
      // 使用正交相机在左侧绘制
      gl.viewport(0,0,leftWidth, height);
      gl.scissor(0,0, leftWidth, height);
      gl.clearColor(1,0,0,1);
      drawScene(orthographicProjectionMatrix, cameraMatrix, worldMatrix);

      // 用透视相机在右侧绘制
      const rightWidth = width - leftWidth;
      gl.viewport(leftWidth, 0, rightWidth, height);
      gl.scissor(leftWidth, 0, rightWidth, height);
      gl.clearColor(0,0,1,1);
      drawScene(perspectiveProjectionMatrix, cameraMatrix, worldMatrix);
    }
    
  }
  async tenth(){

    let gl = document.querySelector('#box').getContext('webgl');

    let programInfo = twgl.createProgramInfo(gl, [vertex_11, fragment_11]);
    let {program, uniformSetters, attribSetters} = programInfo;

    // let uniformSetters = twgl.createUniformSetters(gl, program);
    // let attribSetters = twgl.createAttributeSetters(gl, program);

    // let attribs = {
    //   a_position: { buffer: setGeometry(gl), numComponents: 3 },
    //   a_texcoord: { buffer: setTexcoords(gl), numComponents: 2 },
    // }

    // twgl.setAttributes(attribSetters, attribs);

    let arrays = {
      a_position: { data: setGeometry(gl), numComponents: 3 },
      a_texcoord: { data: setTexcoords(gl), numComponents: 2 },
    }
    let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    let texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255]));
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.src='https://webglfundamentals.org/webgl/resources/f-texture.png';
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);

    }

    function degToRad(d){
      return d * Math.PI / 180;
    }

    var fieldOfViewRadians = degToRad(60);
    var modelXRotationRadians = degToRad(0);
    var modelYRotationRadians = degToRad(0);

    let then = 0;

    requestAnimationFrame(drawScene);

    function drawScene(now){

      now *= 0.001;

      let deltaTime = now - then;
      then = now;

      twgl.resizeCanvasToDisplaySize(gl.canvas);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      modelXRotationRadians += 1.2 * deltaTime;
      modelYRotationRadians += 0.7 * deltaTime;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);

      // twgl.setAttributes(attribSetters, attribs);
      twgl.setBuffersAndAttributes(gl, attribSetters, bufferInfo);

      let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      let cameraPosition = [0,0, 200];
      let up = [0,1,0];
      let target = [0,0,0];

      let cameraMatrix = m4.lookAt(cameraPosition, target, up);

      let viewMatrix = m4.inverse(cameraMatrix);

      let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      let matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
      matrix = m4.yRotate(matrix, modelYRotationRadians);

      let uniforms = {
        u_matrix: matrix,
        u_texture: texture
      }
      twgl.setUniforms(uniformSetters, uniforms);

      // gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);

      twgl.drawBufferInfo(gl, bufferInfo);
      requestAnimationFrame(drawScene);
    }

    function setGeometry(gl) {
      
      // let positionBuffer = gl.createBuffer();
      // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      var positions = new Float32Array([
              // left column front
              0,   0,  0,
              0, 150,  0,
              30,   0,  0,
              0, 150,  0,
              30, 150,  0,
              30,   0,  0,
    
              // top rung front
              30,   0,  0,
              30,  30,  0,
              100,   0,  0,
              30,  30,  0,
              100,  30,  0,
              100,   0,  0,
    
              // middle rung front
              30,  60,  0,
              30,  90,  0,
              67,  60,  0,
              30,  90,  0,
              67,  90,  0,
              67,  60,  0,
    
              // left column back
                0,   0,  30,
               30,   0,  30,
                0, 150,  30,
                0, 150,  30,
               30,   0,  30,
               30, 150,  30,
    
              // top rung back
               30,   0,  30,
              100,   0,  30,
               30,  30,  30,
               30,  30,  30,
              100,   0,  30,
              100,  30,  30,
    
              // middle rung back
               30,  60,  30,
               67,  60,  30,
               30,  90,  30,
               30,  90,  30,
               67,  60,  30,
               67,  90,  30,
    
              // top
                0,   0,   0,
              100,   0,   0,
              100,   0,  30,
                0,   0,   0,
              100,   0,  30,
                0,   0,  30,
    
              // top rung right
              100,   0,   0,
              100,  30,   0,
              100,  30,  30,
              100,   0,   0,
              100,  30,  30,
              100,   0,  30,
    
              // under top rung
              30,   30,   0,
              30,   30,  30,
              100,  30,  30,
              30,   30,   0,
              100,  30,  30,
              100,  30,   0,
    
              // between top rung and middle
              30,   30,   0,
              30,   60,  30,
              30,   30,  30,
              30,   30,   0,
              30,   60,   0,
              30,   60,  30,
    
              // top of middle rung
              30,   60,   0,
              67,   60,  30,
              30,   60,  30,
              30,   60,   0,
              67,   60,   0,
              67,   60,  30,
    
              // right of middle rung
              67,   60,   0,
              67,   90,  30,
              67,   60,  30,
              67,   60,   0,
              67,   90,   0,
              67,   90,  30,
    
              // bottom of middle rung.
              30,   90,   0,
              30,   90,  30,
              67,   90,  30,
              30,   90,   0,
              67,   90,  30,
              67,   90,   0,
    
              // right of bottom
              30,   90,   0,
              30,  150,  30,
              30,   90,  30,
              30,   90,   0,
              30,  150,   0,
              30,  150,  30,
    
              // bottom
              0,   150,   0,
              0,   150,  30,
              30,  150,  30,
              0,   150,   0,
              30,  150,  30,
              30,  150,   0,
    
              // left side
              0,   0,   0,
              0,   0,  30,
              0, 150,  30,
              0,   0,   0,
              0, 150,  30,
              0, 150,   0]);
    
      // Center the F around the origin and Flip it around. We do this because
      // we're in 3D now with and +Y is up where as before when we started with 2D
      // we had +Y as down.
    
      // We could do by changing all the values above but I'm lazy.
      // We could also do it with a matrix at draw time but you should
      // never do stuff at draw time if you can do it at init time.
      var matrix = m4.identity();// m4.xRotation(Math.PI);
      matrix = m4.translate(matrix, -50, -75, -15);
    
      for (var ii = 0; ii < positions.length; ii += 3) {
        var vector = m4.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
        positions[ii + 0] = vector[0];
        positions[ii + 1] = vector[1];
        positions[ii + 2] = vector[2];
      }
    
      // gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      return positions;
    }
    
    // Fill the buffer with texture coordinates the F.
    function setTexcoords(gl) {
      
      // let texcoordBuffer = gl.createBuffer();
      // gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

      let texcoords = new Float32Array([
        // left column front
         38 / 255,  44 / 255,
         38 / 255, 223 / 255,
        113 / 255,  44 / 255,
         38 / 255, 223 / 255,
        113 / 255, 223 / 255,
        113 / 255,  44 / 255,

        // top rung front
        113 / 255, 44 / 255,
        113 / 255, 85 / 255,
        218 / 255, 44 / 255,
        113 / 255, 85 / 255,
        218 / 255, 85 / 255,
        218 / 255, 44 / 255,

        // middle rung front
        113 / 255, 112 / 255,
        113 / 255, 151 / 255,
        203 / 255, 112 / 255,
        113 / 255, 151 / 255,
        203 / 255, 151 / 255,
        203 / 255, 112 / 255,

        // left column back
         38 / 255,  44 / 255,
        113 / 255,  44 / 255,
         38 / 255, 223 / 255,
         38 / 255, 223 / 255,
        113 / 255,  44 / 255,
        113 / 255, 223 / 255,

        // top rung back
        113 / 255, 44 / 255,
        218 / 255, 44 / 255,
        113 / 255, 85 / 255,
        113 / 255, 85 / 255,
        218 / 255, 44 / 255,
        218 / 255, 85 / 255,

        // middle rung back
        113 / 255, 112 / 255,
        203 / 255, 112 / 255,
        113 / 255, 151 / 255,
        113 / 255, 151 / 255,
        203 / 255, 112 / 255,
        203 / 255, 151 / 255,

        // top
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        // top rung right
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1,

        // under top rung
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,

        // between top rung and middle
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,

        // top of middle rung
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,

        // right of middle rung
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,

        // bottom of middle rung.
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,

        // right of bottom
        0, 0,
        1, 1,
        0, 1,
        0, 0,
        1, 0,
        1, 1,

        // bottom
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,

        // left side
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        1, 1,
        1, 0,
      ]);
      // gl.bufferData(
      //     gl.ARRAY_BUFFER,
      //     texcoords,
      //     gl.STATIC_DRAW);
      
      return texcoords;
    }

  }
  primitives_test(){
    twgl.setDefaults({attribPrefix: "a_"});
    const m4 = twgl.m4;
    const gl = document.querySelector("#box").getContext("webgl");
    const programInfo = twgl.createProgramInfo(gl, [vertex_10, fragment_10]);

    const shapes = [
      twgl.primitives.createCubeBufferInfo(gl, 2),
      twgl.primitives.createSphereBufferInfo(gl, 1, 24, 12),
      twgl.primitives.createPlaneBufferInfo(gl, 2, 2),
      twgl.primitives.createTruncatedConeBufferInfo(gl, 1, 0, 2, 24, 1),
      twgl.primitives.createCresentBufferInfo(gl, 1, 1, 0.5, 0.1, 24),
      twgl.primitives.createCylinderBufferInfo(gl, 1, 2, 24, 2),
      twgl.primitives.createDiscBufferInfo(gl, 1, 24),
      twgl.primitives.createTorusBufferInfo(gl, 1, 0.4, 24, 12),
    ];

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    // Shared values
    const lightWorldPosition = [1, 8, -10];
    const lightColor = [1, 1, 1, 1];
    const camera = m4.identity();
    const view = m4.identity();
    const viewProjection = m4.identity();

    const tex = twgl.createTexture(gl, {
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: [
        255, 255, 255, 255,
        192, 192, 192, 255,
        192, 192, 192, 255,
        255, 255, 255, 255,
      ],
    });

    const objects = [];
    const drawObjects = [];
    const numObjects = 100;
    const baseHue = rand(0, 360);
    for (let ii = 0; ii < numObjects; ++ii) {
      const uniforms = {
        u_lightWorldPos: lightWorldPosition,
        u_lightColor: lightColor,
        u_diffuseMult: chroma.hsv((baseHue + rand(0, 60)) % 360, 0.4, 0.8).gl(),
        u_specular: [1, 1, 1, 1],
        u_shininess: 50,
        u_specularFactor: 1,
        u_diffuse: tex,
        u_viewInverse: camera,
        u_world: m4.identity(),
        u_worldInverseTranspose: m4.identity(),
        u_worldViewProjection: m4.identity(),
      };
      drawObjects.push({
        programInfo: programInfo,
        bufferInfo: shapes[ii % shapes.length],
        uniforms: uniforms,
      });
      objects.push({
        translation: [rand(-10, 10), rand(-10, 10), rand(-10, 10)],
        ySpeed: rand(0.1, 0.3),
        zSpeed: rand(0.1, 0.3),
        uniforms: uniforms,
      });
    }

    function render(time) {
      time *= 0.001;
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 100);
      const eye = [1, 4, -20];
      const target = [0, 0, 0];
      const up = [0, 1, 0];

      m4.lookAt(eye, target, up, camera);
      m4.inverse(camera, view);
      m4.multiply(projection, view, viewProjection);

      objects.forEach(function(obj) {
        const uni = obj.uniforms;
        const world = uni.u_world;
        m4.identity(world);
        m4.rotateY(world, time * obj.ySpeed, world);
        m4.rotateZ(world, time * obj.zSpeed, world);
        m4.translate(world, obj.translation, world);
        m4.rotateX(world, time, world);
        m4.transpose(m4.inverse(world, uni.u_worldInverseTranspose), uni.u_worldInverseTranspose);
        m4.multiply(viewProjection, uni.u_world, uni.u_worldViewProjection);
      });

      twgl.drawObjectList(gl, drawObjects);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  ninth(){

    // let { canvas, gl, program } = this.loadbasic(vertex_9, fragment_9);

    var canvas = document.querySelector("#box");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    let programInfo = twgl.createProgramInfo(gl, [vertex_9, fragment_9]);

    const sphereBufferInfo = primitives.createSphereBufferInfo(gl, 10, 12, 6);
    const cubeBufferInfo = primitives.createCubeBufferInfo(gl, 20);
    const coneBufferInfo = primitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1, true, false)

    function degToRad(d){
      return d * Math.PI / 180;
    }
    let fieldOfViewRadians = degToRad(60);

    let sphereUniforms = {
      u_colorMult: [0.5, 1, 0.5, 1],
      u_matrix: m4.identity(),
    }
    let cubeUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],
      u_matrix: m4.identity(),
    }
    let coneUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],
      u_matrix: m4.identity(),
    }

    var sphereTranslation = [  0, 0, 0];
    var cubeTranslation   = [-40, 0, 0];
    var coneTranslation   = [ 40, 0, 0];

    function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation){

      let matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
      matrix = m4.xRotate(matrix, xRotation);
      return m4.yRotate(matrix, yRotation);
    }

    requestAnimationFrame(drawScene);

    function drawScene(time){

      time *= 0.0005;

      twgl.resizeCanvasToDisplaySize(gl.canvas);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      let cameraPosition = [0, 0, 100];
      let target = [0,0,0];
      let up = [0, 1, 0];
      let cameraMatrix = m4.lookAt(cameraPosition, target, up);

      let viewMatrix = m4.inverse(cameraMatrix);

      let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      var sphereXRotation =  time;
      var sphereYRotation =  time;
      var cubeXRotation   = -time;
      var cubeYRotation   =  time;
      var coneXRotation   =  time;
      var coneYRotation   = -time;

      // ------ Draw the sphere --------

      gl.useProgram(programInfo.program);

      twgl.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);

      sphereUniforms.u_matrix = computeMatrix(viewProjectionMatrix, sphereTranslation, sphereXRotation, sphereYRotation);

      twgl.setUniforms(programInfo, sphereUniforms);

      gl.drawArrays(gl.TRIANGLES, 0, sphereBufferInfo.numElements);

      // ------ Draw the cube --------

      twgl.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);

      cubeUniforms.u_matrix = computeMatrix(viewProjectionMatrix, cubeTranslation, cubeXRotation, cubeYRotation);

      twgl.setUniforms(programInfo.program, cubeUniforms);

      gl.drawArrays(gl.TRIANGLES, 0, cubeBufferInfo.numElements);

      // ------ Draw the cone --------

      twgl.setBuffersAndAttributes(gl, programInfo, coneBufferInfo);

      coneUniforms.u_matrix = computeMatrix(viewProjectionMatrix, coneTranslation, coneXRotation, coneYRotation);

      twgl.setUniforms(programInfo, coneUniforms);

      gl.drawArrays(gl.TRIANGLES, 0, coneBufferInfo.numElements);

      requestAnimationFrame(drawScene);

    }

  

  }
  eighth(){
    let { canvas, gl, program } = this.loadbasic(vertex_8, fragment_8);
    console.log(twgl);

    var buffers = primitives.createSphereBuffers(gl, 10, 48, 24);

    var uniformSetters = twgl.createUniformSetters(gl, program);
    var attribSetters  = twgl.createAttributeSetters(gl, program);

    var attribs = {
      a_position: { buffer: buffers.position, numComponents: 3, },
      a_normal:   { buffer: buffers.normal,   numComponents: 3, },
      a_texcoord: { buffer: buffers.texcoord, numComponents: 2, },
    };

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    var cameraAngleRadians = degToRad(0);
    var fieldOfViewRadians = degToRad(60);
    var cameraHeight = 50;

    var uniformsThatAreTheSameForAllObjects = {
      u_lightWorldPos:         [-50, 30, 100],
      u_viewInverse:           m4.identity(),
      u_lightColor:            [1, 1, 1, 1],
    };

    var uniformsThatAreComputedForEachObject = {
      u_worldViewProjection:   m4.identity(),
      u_world:                 m4.identity(),
      u_worldInverseTranspose: m4.identity(),
    };

    var rand = function(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + Math.random() * (max - min);
    };

    var randInt = function(range) {
      return Math.floor(Math.random() * range);
    };

    var textures = [
      textureUtils.makeStripeTexture(gl, { color1: "#FFF", color2: "#CCC", }),
      textureUtils.makeCheckerTexture(gl, { color1: "#FFF", color2: "#CCC", }),
      textureUtils.makeCircleTexture(gl, { color1: "#FFF", color2: "#CCC", }),
    ];

    var objects = [];
    var numObjects = 300;
    var baseColor = rand(240);
    for (var ii = 0; ii < numObjects; ++ii) {
      objects.push({
        radius: rand(150),
        xRotation: rand(Math.PI * 2),
        yRotation: rand(Math.PI),
        materialUniforms: {
          u_colorMult:             chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
          u_diffuse:               textures[randInt(textures.length)],
          u_specular:              [1, 1, 1, 1],
          u_shininess:             rand(500),
          u_specularFactor:        rand(1),
        },
      });
    }

    requestAnimationFrame(drawScene);

    // Draw the scene.
    function drawScene(time) {
      time = time * 0.0001 + 5;

      twgl.resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      // Compute the camera's matrix using look at.
      var cameraPosition = [0, 0, 100];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      var cameraMatrix = m4.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);

      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      gl.useProgram(program);

      // Setup all the needed attributes.
      twgl.setAttributes(attribSetters, attribs);

      // Bind the indices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

      // Set the uniforms that are the same for all objects.
      twgl.setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);

      // Draw objects
      objects.forEach(function(object) {

        // Compute a position for this object based on the time.
        var worldMatrix = m4.xRotation(object.xRotation * time);
        worldMatrix = m4.yRotate(worldMatrix, object.yRotation * time);
        worldMatrix = m4.translate(worldMatrix, 0, 0, object.radius);
        uniformsThatAreComputedForEachObject.u_world = worldMatrix;

        // Multiply the matrices.
        m4.multiply(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
        m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

        // Set the uniforms we just computed
        twgl.setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

        // Set the uniforms that are specific to the this object.
        twgl.setUniforms(uniformSetters, object.materialUniforms);

        // Draw the geometry.
        gl.drawElements(gl.TRIANGLES, buffers.numElements, gl.UNSIGNED_SHORT, 0);
      });

      requestAnimationFrame(drawScene);
    }
  }
  seventh(){
    
    let { canvas, gl, program } = this.loadbasic(vertex_7, fragment_7);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    let normalLocation = gl.getAttribLocation(program, "a_normal");
    // let matrixLocation = gl.getUniformLocation(program, "u_matrix");
    let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
    let colorLocation = gl.getUniformLocation(program, "u_color");
    let worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    let worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
    let worldLocation = gl.getUniformLocation(program, "u_world");
    let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
    let viewWorldPositionLocation = gl.getUniformLocation(program, 'u_viewWorldPosition');
    let shininessLocation = gl.getUniformLocation(program, 'u_shininess');
    let lightColorLocation = gl.getUniformLocation(program, 'u_lightColor');
    let specularColorLocation = gl.getUniformLocation(program, 'u_specularColor');
    var lightDirectionLocation = gl.getUniformLocation(program, "u_lightDirection");
    var limitLocation = gl.getUniformLocation(program, "u_limit");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // let colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // setColors(gl);

    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);

    gl.uniform3fv(lightWorldPositionLocation, [40, 60, 120]);
    gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]);
    gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]))
    gl.uniform3fv(lightColorLocation, m4.normalize([1, 0.6, 0.6]))
    gl.uniform3fv(specularColorLocation, m4.normalize([1, 0.6, 0.6]))

    var fieldOfViewRadians = degToRad(60);
    var fRotationRadians = 0;
    var shininess = 150;
    var lightRotationX = 0;
    var lightRotationY = 0;
    var lightDirection = [0, 0, 1];  // this is computed in updateScene
    var limit = degToRad(10);
    
    webglLessonsUI.setupSlider("#fRotation", {value: radToDeg(fRotationRadians), slide: updateRotation, min: -360, max: 360});
    webglLessonsUI.setupSlider("#lightRotationX", {value: lightRotationX, slide: updatelightRotationX, min: -2, max: 2, precision: 2, step: 0.001});
    webglLessonsUI.setupSlider("#lightRotationY", {value: lightRotationY, slide: updatelightRotationY, min: -2, max: 2, precision: 2, step: 0.001});
    webglLessonsUI.setupSlider("#limit", {value: radToDeg(limit), slide: updateLimit, min: 0, max: 180});

    function updateRotation(event, ui) {
      fRotationRadians = degToRad(ui.value);
      drawScene();
    }
  
    function updatelightRotationX(event, ui) {
      lightRotationX = ui.value;
      drawScene();
    }
  
    function updatelightRotationY(event, ui) {
      lightRotationY = ui.value;
      drawScene();
    }
  
    function updateLimit(event, ui) {
      limit = degToRad(ui.value);
      drawScene();
    }

    function updateShininess(event, ui){
      shininess = ui.value;
      gl.uniform1f(shininessLocation, shininess);
      // 绘制
      var primitiveType = gl.TRIANGLES;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, 0, count);

    }

    function updateRotation(event, ui) {
      fRotationRadians = degToRad(ui.value);
      drawScene();
    }

    drawScene();
    
    function drawScene() {

      gl.enable(gl.CULL_FACE);  // “剔除”背面三角形

      // 清空画布和深度缓冲，清除深度缓冲为 1.0
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST); // 开启深度缓冲
      
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      let size = 3; // 每次迭代使用 3 个单位的数据
      let type = gl.FLOAT; // 单位数据类型是32位的浮点型
      let normalize = false; // 不需要归一化数据
      let stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
      let offset = 0; // 从绑定缓冲的起始处开始
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );
      
      // 启用法向量属性
      gl.enableVertexAttribArray(normalLocation);
      
      // 绑定法向量缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      
      // 告诉法向量属性怎么从 normalBuffer (ARRAY_BUFFER) 中读取值
      gl.vertexAttribPointer(
          normalLocation, size, type, normalize, stride, offset)
      
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
  
      // Compute the camera's matrix
      var camera = [100, 150, 200];
      var target = [0, 35, 0];
      var up = [0, 1, 0];
      var cameraMatrix = m4.lookAt(camera, target, up);

      gl.uniform3fv(viewWorldPositionLocation, camera);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
  
      // Compute a view projection matrix
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      // Draw a F at the origin
      var worldMatrix = m4.yRotation(fRotationRadians);
  
      // Multiply the matrices.
      var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
      let worldInverseMatrix = m4.inverse(worldMatrix);
      let worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);
      
      gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
      gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
      gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);

      gl.uniform1f(shininessLocation, shininess);

      const lightPosition = [40, 60, 120];
      gl.uniform3fv(lightWorldPositionLocation, lightPosition);
      {
        var lmat = m4.lookAt(lightPosition, target, up);
        lmat = m4.multiply(m4.xRotation(lightRotationX), lmat);
        lmat = m4.multiply(m4.yRotation(lightRotationY), lmat);
        // get the zAxis from the matrix
        // negate it because lookAt looks down the -Z axis
        lightDirection = [-lmat[8], -lmat[9],-lmat[10]];
      }
      gl.uniform3fv(lightDirectionLocation, lightDirection);
      gl.uniform1f(limitLocation, Math.cos(limit));

      // 绘制
      var primitiveType = gl.TRIANGLES;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }
    function updateFRotationRadians(event, ui){
      fRotationRadians = degToRad(ui.value);
      drawScene();
    }
    function radToDeg(r) {
      return r * (180 / Math.PI);
    }
    function degToRad(d) {
      return d * (Math.PI / 180);
    }
    function setGeometry(gl) {
      var positions = new Float32Array([
              // left column front
              0,   0,  0,
              0, 150,  0,
              30,   0,  0,
              0, 150,  0,
              30, 150,  0,
              30,   0,  0,
    
              // top rung front
              30,   0,  0,
              30,  30,  0,
              100,   0,  0,
              30,  30,  0,
              100,  30,  0,
              100,   0,  0,
    
              // middle rung front
              30,  60,  0,
              30,  90,  0,
              67,  60,  0,
              30,  90,  0,
              67,  90,  0,
              67,  60,  0,
    
              // left column back
                0,   0,  30,
               30,   0,  30,
                0, 150,  30,
                0, 150,  30,
               30,   0,  30,
               30, 150,  30,
    
              // top rung back
               30,   0,  30,
              100,   0,  30,
               30,  30,  30,
               30,  30,  30,
              100,   0,  30,
              100,  30,  30,
    
              // middle rung back
               30,  60,  30,
               67,  60,  30,
               30,  90,  30,
               30,  90,  30,
               67,  60,  30,
               67,  90,  30,
    
              // top
                0,   0,   0,
              100,   0,   0,
              100,   0,  30,
                0,   0,   0,
              100,   0,  30,
                0,   0,  30,
    
              // top rung right
              100,   0,   0,
              100,  30,   0,
              100,  30,  30,
              100,   0,   0,
              100,  30,  30,
              100,   0,  30,
    
              // under top rung
              30,   30,   0,
              30,   30,  30,
              100,  30,  30,
              30,   30,   0,
              100,  30,  30,
              100,  30,   0,
    
              // between top rung and middle
              30,   30,   0,
              30,   60,  30,
              30,   30,  30,
              30,   30,   0,
              30,   60,   0,
              30,   60,  30,
    
              // top of middle rung
              30,   60,   0,
              67,   60,  30,
              30,   60,  30,
              30,   60,   0,
              67,   60,   0,
              67,   60,  30,
    
              // right of middle rung
              67,   60,   0,
              67,   90,  30,
              67,   60,  30,
              67,   60,   0,
              67,   90,   0,
              67,   90,  30,
    
              // bottom of middle rung.
              30,   90,   0,
              30,   90,  30,
              67,   90,  30,
              30,   90,   0,
              67,   90,  30,
              67,   90,   0,
    
              // right of bottom
              30,   90,   0,
              30,  150,  30,
              30,   90,  30,
              30,   90,   0,
              30,  150,   0,
              30,  150,  30,
    
              // bottom
              0,   150,   0,
              0,   150,  30,
              30,  150,  30,
              0,   150,   0,
              30,  150,  30,
              30,  150,   0,
    
              // left side
              0,   0,   0,
              0,   0,  30,
              0, 150,  30,
              0,   0,   0,
              0, 150,  30,
              0, 150,   0]);
    
      // Center the F around the origin and Flip it around. We do this because
      // we're in 3D now with and +Y is up where as before when we started with 2D
      // we had +Y as down.
    
      // We could do by changing all the values above but I'm lazy.
      // We could also do it with a matrix at draw time but you should
      // never do stuff at draw time if you can do it at init time.
      var matrix = m4.xRotation(Math.PI);
      matrix = m4.translate(matrix, -50, -75, -15);
    
      for (var ii = 0; ii < positions.length; ii += 3) {
        var vector = m4.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
        positions[ii + 0] = vector[0];
        positions[ii + 1] = vector[1];
        positions[ii + 2] = vector[2];
      }
    
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }
    
    function setNormals(gl) {
      var normals = new Float32Array([
              // left column front
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
    
              // top rung front
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
    
              // middle rung front
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
              0, 0, 1,
    
              // left column back
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
    
              // top rung back
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
    
              // middle rung back
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
              0, 0, -1,
    
              // top
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
    
              // top rung right
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
    
              // under top rung
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
    
              // between top rung and middle
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
    
              // top of middle rung
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
              0, 1, 0,
    
              // right of middle rung
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
    
              // bottom of middle rung.
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
    
              // right of bottom
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
              1, 0, 0,
    
              // bottom
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
              0, -1, 0,
    
              // left side
              -1, 0, 0,
              -1, 0, 0,
              -1, 0, 0,
              -1, 0, 0,
              -1, 0, 0,
              -1, 0, 0]);
      gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    }
  }
  sixth() {
    let { canvas, gl, program } = this.loadbasic(vertex_6, fragment_6);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    let matrixLocation = gl.getUniformLocation(program, "u_matrix");
    let colorLocation = gl.getUniformLocation(program, "u_color");
    let fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor');

    let translation = [-150, 0, -360],
        rotation = [degToRad(190), degToRad(40), degToRad(320)],
        scale = [1, 1, 1],
        color = [Math.random(), Math.random(), Math.random(), 1],
        fudgeFactor = 1,
        fieldOfViewRadians = degToRad(60),
        cameraAngleRadians = degToRad(0);
    
    gl.uniform4fv(colorLocation, color);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl)

    drawScene();

    webglLessonsUI.setupSlider("#cameraAngle", {value: radToDeg(cameraAngleRadians), slide: updateCameraAngle, min: -360, max: 360});
    // webglLessonsUI.setupSlider("#fudgeFactor", {value: fudgeFactor, slide: updateFudgeFactor, max: 2, step: 0.001, precision: 3 });
    // webglLessonsUI.setupSlider("#fieldOfViewRadians", {value: fieldOfViewRadians, slide: updateFieldOfView, min: 1, max: 179 });
    // webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    // webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    // webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height, min: -gl.canvas.height});
    // webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
    // webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
    // webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    // webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    // webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
    // webglLessonsUI.setupSlider("#scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

    function drawScene() {

      gl.enable(gl.CULL_FACE);  // “剔除”背面三角形

      // 清空画布和深度缓冲，清除深度缓冲为 1.0
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST); // 开启深度缓冲
      
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      let size = 3; // 每次迭代使用 3 个单位的数据
      let type = gl.FLOAT; // 单位数据类型是32位的浮点型
      let normalize = false; // 不需要归一化数据
      let stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type)  每次迭代跳多少距离到下一个数据
      let offset = 0; // 从绑定缓冲的起始处开始
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // 启用颜色属性
      gl.enableVertexAttribArray(colorAttributeLocation);
      
      // 绑定颜色缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      
      // 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
      let type1 = gl.UNSIGNED_BYTE; // 单位数据类型是8位无符号数值类型
      let normalize1 = true; // 需要归一化数据(从0-255 到 0-1)
      gl.vertexAttribPointer(
          colorAttributeLocation, size, type1, normalize1, stride, offset)

      let numFs = 5,
          radius = 200;
      
      // let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
      
      // 在大多数三维数学库中没有负责像素空间与裁剪空间转换的 projection 方法。 代替的是叫做 ortho 或 orthographic 的方法
      var left = 0;
      var right = gl.canvas.clientWidth;
      var bottom = gl.canvas.clientHeight;
      var top = 0;
      var near = 400;
      var far = -400;

      // let matrix = m4.multiply(makeZToWMatrix(fudgeFactor), m4.orthographic(left, right, bottom, top, near, far)) 
      // let matrix = m4.orthographic(left, right, bottom, top, near, far);

      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

      let cameraMatrix = m4.yRotation(cameraAngleRadians);
      cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);
      
      let fPosition = [radius, 0, 0];

      let cameraPosition = [
        cameraMatrix[12],
        cameraMatrix[13],
        cameraMatrix[14],
      ];
  
      let up = [0, 1, 0];

      cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
      
      let viewMatrix = m4.inverse(cameraMatrix);
      let viewProjectionMatrix = m4.multiply(matrix, viewMatrix);

      for(let i=0; i< numFs; ++i){

        let angle = i * Math.PI * 2 / numFs;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;

        let matrix = m4.translate(viewProjectionMatrix, x, 0, y);

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        var primitiveType = gl.TRIANGLES;
        var count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);

      }

      // matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
      // matrix = m4.xRotate(matrix, rotation[0]);
      // matrix = m4.yRotate(matrix, rotation[1]);
      // matrix = m4.zRotate(matrix, rotation[2]);
      // matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

      // gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // gl.uniform1f(fudgeLocation, fudgeFactor)

      // 绘制
      // var primitiveType = gl.TRIANGLES;
      // var count = 16 * 6;
      // gl.drawArrays(primitiveType, offset, count);
    }
    function makeZToWMatrix(fudgeFactor) {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, fudgeFactor,
        0, 0, 0, 1,
      ];
    }
    function updateFieldOfView(event, ui) {
      fieldOfViewRadians = degToRad(ui.value);
      drawScene();
    }
    function updateCameraAngle(event, ui) {
      cameraAngleRadians = degToRad(ui.value);
      drawScene();
    }
    function updateFudgeFactor(event, ui) {
      fudgeFactor = ui.value;
      drawScene();
    }
    function updatePosition(index) {
      return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
      };
    }
  
    function updateRotation(index) {
      return function(event, ui) {
        var angleInDegrees = ui.value;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[index] = angleInRadians;
        drawScene();
      };
    }
  
    function updateScale(index) {
      return function(event, ui) {
        scale[index] = ui.value;
        drawScene();
      };
    }

    function radToDeg(r) {
      return r * (180 / Math.PI);
    }
    function degToRad(d) {
      return d * (Math.PI / 180);
    }
    // 填充当前 ARRAY_BUFFER 缓冲
    // 使用组成 'F' 的数据填充缓冲.
    function setGeometry(gl) {
      var positions = new Float32Array([
              // left column front
              0,   0,  0,
              0, 150,  0,
              30,   0,  0,
              0, 150,  0,
              30, 150,  0,
              30,   0,  0,
    
              // top rung front
              30,   0,  0,
              30,  30,  0,
              100,   0,  0,
              30,  30,  0,
              100,  30,  0,
              100,   0,  0,
    
              // middle rung front
              30,  60,  0,
              30,  90,  0,
              67,  60,  0,
              30,  90,  0,
              67,  90,  0,
              67,  60,  0,
    
              // left column back
                0,   0,  30,
               30,   0,  30,
                0, 150,  30,
                0, 150,  30,
               30,   0,  30,
               30, 150,  30,
    
              // top rung back
               30,   0,  30,
              100,   0,  30,
               30,  30,  30,
               30,  30,  30,
              100,   0,  30,
              100,  30,  30,
    
              // middle rung back
               30,  60,  30,
               67,  60,  30,
               30,  90,  30,
               30,  90,  30,
               67,  60,  30,
               67,  90,  30,
    
              // top
                0,   0,   0,
              100,   0,   0,
              100,   0,  30,
                0,   0,   0,
              100,   0,  30,
                0,   0,  30,
    
              // top rung right
              100,   0,   0,
              100,  30,   0,
              100,  30,  30,
              100,   0,   0,
              100,  30,  30,
              100,   0,  30,
    
              // under top rung
              30,   30,   0,
              30,   30,  30,
              100,  30,  30,
              30,   30,   0,
              100,  30,  30,
              100,  30,   0,
    
              // between top rung and middle
              30,   30,   0,
              30,   60,  30,
              30,   30,  30,
              30,   30,   0,
              30,   60,   0,
              30,   60,  30,
    
              // top of middle rung
              30,   60,   0,
              67,   60,  30,
              30,   60,  30,
              30,   60,   0,
              67,   60,   0,
              67,   60,  30,
    
              // right of middle rung
              67,   60,   0,
              67,   90,  30,
              67,   60,  30,
              67,   60,   0,
              67,   90,   0,
              67,   90,  30,
    
              // bottom of middle rung.
              30,   90,   0,
              30,   90,  30,
              67,   90,  30,
              30,   90,   0,
              67,   90,  30,
              67,   90,   0,
    
              // right of bottom
              30,   90,   0,
              30,  150,  30,
              30,   90,  30,
              30,   90,   0,
              30,  150,   0,
              30,  150,  30,
    
              // bottom
              0,   150,   0,
              0,   150,  30,
              30,  150,  30,
              0,   150,   0,
              30,  150,  30,
              30,  150,   0,
    
              // left side
              0,   0,   0,
              0,   0,  30,
              0, 150,  30,
              0,   0,   0,
              0, 150,  30,
              0, 150,   0]);
    
      // Center the F around the origin and Flip it around. We do this because
      // we're in 3D now with and +Y is up where as before when we started with 2D
      // we had +Y as down.
    
      // We could do by changing all the values above but I'm lazy.
      // We could also do it with a matrix at draw time but you should
      // never do stuff at draw time if you can do it at init time.
      var matrix = m4.xRotation(Math.PI);
      matrix = m4.translate(matrix, -50, -75, -15);
    
      for (var ii = 0; ii < positions.length; ii += 3) {
        var vector = m4.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
        positions[ii + 0] = vector[0];
        positions[ii + 1] = vector[1];
        positions[ii + 2] = vector[2];
      }
    
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    }
    
    // Fill the buffer with colors for the 'F'.
    function setColors(gl) {
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Uint8Array([
              // left column front
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
    
              // top rung front
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
    
              // middle rung front
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
            200,  70, 120,
    
              // left column back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
    
              // top rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
    
              // middle rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
    
              // top
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
    
              // top rung right
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
    
              // under top rung
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
    
              // between top rung and middle
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
    
              // top of middle rung
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
    
              // right of middle rung
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
    
              // bottom of middle rung.
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
    
              // right of bottom
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
    
              // bottom
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
    
              // left side
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220]),
          gl.STATIC_DRAW);
    }
  }
  fifth() {
    let { canvas, gl, program } = this.loadbasic(vertex_5, fragment_5);

    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 上传几何体然后在着色器中进行平移
    setGeometry(gl);

    let translation = [0, 0],
      scale = [1, 1],
      angleInRadians = 0,
      color = [Math.random(), Math.random(), Math.random(), 1],
      u_matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    // 设置分辨率
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // 设置颜色
    gl.uniform4fv(colorLocation, color);

    gl.uniformMatrix3fv(matrixLocation, false, u_matrix);

    let matrixMap = {
      translation: function (tx, ty) {
        return [1, 0, 0, 0, 1, 0, tx, ty, 1];
      },

      rotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [c, -s, 0, s, c, 0, 0, 0, 1];
      },

      scaling: function (sx, sy) {
        return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
      },
    };

    drawScene();

    webglLessonsUI.setupSlider("#x", {
      value: translation[0],
      slide: updatePosition(0),
      max: gl.canvas.width,
    });
    webglLessonsUI.setupSlider("#y", {
      value: translation[1],
      slide: updatePosition(1),
      max: gl.canvas.height,
    });
    webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
    webglLessonsUI.setupSlider("#scaleX", {
      value: scale[0],
      slide: updateScale(0),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });
    webglLessonsUI.setupSlider("#scaleY", {
      value: scale[1],
      slide: updateScale(1),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });

    function updatePosition(index) {
      return (event, ui) => {
        translation[index] = ui.value;
        drawScene();
      };
    }
    function updateScale(index) {
      return (event, ui) => {
        scale[index] = ui.value;
        drawScene();
      };
    }
    function updateAngle(event, ui) {
      var angleInDegrees = 360 - ui.value;
      angleInRadians = (angleInDegrees * Math.PI) / 180;
      drawScene();
    }

    function drawScene() {
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
      var size = 2; // 每次迭代运行提取两个单位数据
      var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
      var normalize = false; // 不需要归一化数据
      var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      var offset = 0; // 从缓冲起始位置开始读取
      gl.vertexAttribPointer(
        positionLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      let translationMatrix = matrixMap.translation(
        translation[0],
        translation[1]
      );
      let rotationMatrix = matrixMap.rotation(angleInRadians);
      let scaleMatrix = matrixMap.scaling(scale[0], scale[1]);

      // 1、画一个F
      {
        // 计算矩阵
        let projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);

        // 创建一个矩阵，可以将原点移动到 'F' 的中心, 改变旋转的中心
        let moveOriginMatrix = m3.translation(-50, -75);
        // u_matrix = m3.multiply(projectionMatrix, translationMatrix);
        // u_matrix = m3.multiply(u_matrix, rotationMatrix);
        // u_matrix = m3.multiply(u_matrix, scaleMatrix);
        // u_matrix = m3.multiply(u_matrix, moveOriginMatrix);

        // 推荐这种写法
        u_matrix = m3.translate(
          projectionMatrix,
          translation[0],
          translation[1]
        );
        u_matrix = m3.rotate(u_matrix, angleInRadians);
        u_matrix = m3.scale(u_matrix, scale[0], scale[1]);
        u_matrix = m3.translate(u_matrix, -50, -75);

        gl.uniformMatrix3fv(matrixLocation, false, u_matrix);

        // 绘制矩形
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;
        gl.drawArrays(primitiveType, offset, count);
      }

      // 2、画五个F, 并且每个 'F' 都以前一个的矩阵为基础, 越后面的F变换效果越明显
      // {
      //   u_matrix = m3.identity();

      //   for (var i = 0; i < 5; ++i) {
      //   // Multiply the matrices.
      //     u_matrix = m3.multiply(u_matrix, translationMatrix);
      //     u_matrix = m3.multiply(u_matrix, rotationMatrix);
      //     u_matrix = m3.multiply(u_matrix, scaleMatrix);

      //     // Set the matrix.
      //     gl.uniformMatrix3fv(matrixLocation, false, u_matrix);

      //     // Draw the geometry.
      //     var primitiveType = gl.TRIANGLES;
      //     var offset = 0;
      //     var count = 18;  // 6 triangles in the 'F', 3 points per triangle
      //     gl.drawArrays(primitiveType, offset, count);
      //   }

      // }
    }

    function setGeometry(gl) {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // 左竖
          0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

          // 上横
          30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

          // 中横
          30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
        ]),
        gl.STATIC_DRAW
      );
    }
  }
  fourth() {
    let { canvas, gl, program } = this.loadbasic(vertex_4, fragment_4);

    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");
    var scaleLocation = gl.getUniformLocation(program, "u_scale");

    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 上传几何体然后在着色器中进行平移
    setGeometry(gl);

    let translation = [0, 0],
      rotation = [0, 1],
      scale = [1, 1],
      width = 100,
      height = 30,
      color = [Math.random(), Math.random(), Math.random(), 1];

    // 设置分辨率
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // 设置颜色
    gl.uniform4fv(colorLocation, color);

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {
      value: translation[0],
      slide: updatePosition(0),
      max: gl.canvas.width,
    });
    webglLessonsUI.setupSlider("#y", {
      value: translation[1],
      slide: updatePosition(1),
      max: gl.canvas.height,
    });
    webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
    webglLessonsUI.setupSlider("#scaleX", {
      value: scale[0],
      slide: updateScale(0),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });
    webglLessonsUI.setupSlider("#scaleY", {
      value: scale[1],
      slide: updateScale(1),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });

    function updatePosition(index) {
      return (event, ui) => {
        translation[index] = ui.value;
        drawScene();
      };
    }
    function updateScale(index) {
      return (event, ui) => {
        scale[index] = ui.value;
        drawScene();
      };
    }
    function updateAngle(event, ui) {
      var angleInDegrees = 360 - ui.value;
      var angleInRadians = (angleInDegrees * Math.PI) / 180;
      rotation[0] = Math.sin(angleInRadians);
      rotation[1] = Math.cos(angleInRadians);
      drawScene();
    }

    function drawScene() {
      // 启用属性
      gl.enableVertexAttribArray(positionLocation);

      // 绑定位置缓冲
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // 设置矩形参数
      // setRectangle(gl, translation[0], translation[1], width, height);

      // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
      var size = 2; // 每次迭代运行提取两个单位数据
      var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
      var normalize = false; // 不需要归一化数据
      var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      var offset = 0; // 从缓冲起始位置开始读取
      gl.vertexAttribPointer(
        positionLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      gl.uniform2fv(translationLocation, translation);
      gl.uniform2fv(rotationLocation, rotation);
      gl.uniform2fv(scaleLocation, scale);

      // 绘制矩形
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 18;
      gl.drawArrays(primitiveType, offset, count);
    }
    function setGeometry(gl) {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          // 左竖
          0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

          // 上横
          30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

          // 中横
          30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
        ]),
        gl.STATIC_DRAW
      );
    }
    function setRectangle(gl, x, y, width, height) {
      let x2 = x + width,
        y2 = y + height;

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x, y, x2, y, x2, y2, x, y, x2, y2, x, y2]),
        gl.STATIC_DRAW
      );
    }
  }

  third() {
    let { canvas, gl, program } = this.loadbasic(vertex_3, fragment_3);

    let image = new Image();
    image.crossOrigin = "anonymous"; // 解决图片跨域问题
    image.src = "https://webglfundamentals.org/webgl/resources/leaves.jpg";
    image.onload = () => {
      console.log("加载完成");
      var positionLocation = gl.getAttribLocation(program, "a_position");
      var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
      let positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      setRectangle(gl, 0, 0, image.width, image.height);

      // 给矩形提供纹理坐标
      let texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ]),
        gl.STATIC_DRAW
      );

      // 创建纹理
      {
        // let texture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // // 设置参数，让我们可以绘制任何尺寸的图像
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      }

      let originalImageTexture = createAndSetupTexture(gl);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      let textures = [];
      let framebuffers = [];
      for (let i = 0; i < 2; i++) {
        let texture = createAndSetupTexture(gl);
        textures.push(texture);

        // 设置纹理大小和图像大小一致
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          image.width,
          image.height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );

        // 创建一个帧缓冲
        let fbo = gl.createFramebuffer();
        framebuffers.push(fbo);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // 绑定纹理到帧缓冲
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0
        );
      }

      let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      let textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
      let kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
      let kernelWeightLocation = gl.getUniformLocation(
        program,
        "u_kernelWeight"
      );
      var flipYLocation = gl.getUniformLocation(program, "u_flipY");

      // 定义几个卷积核
      var kernels = {
        normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
        gaussianBlur: [
          0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045,
        ],
        gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
        gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
        unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
        sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
        edgeDetect: [
          -0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125,
        ],
        edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
        edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
        edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
        edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
        edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
        sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
        sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
        previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
        previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
        boxBlur: [
          0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111,
        ],
        triangleBlur: [
          0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625,
        ],
        emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
      };
      var initialSelection = "gaussianBlur";
      let edgeDetectKernel = kernels[initialSelection];
      gl.uniform1fv(kernelLocation, edgeDetectKernel);
      gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));

      let div_effects = document.querySelector("#effects");
      div_effects.style.display = "block";
      for (let key in kernels) {
        let item = kernels[key];
        let div_item = document.createElement("div");
        let div_input = document.createElement("input");
        div_input.value = key;
        div_input.type = "checkbox";

        div_input.onchange = drawEffects;
        div_item.appendChild(div_input);
        div_item.appendChild(document.createTextNode("= " + key));
        div_effects.appendChild(div_item);
      }
      drawEffects();

      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offset, count);

      function drawEffects() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(
          positionLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(
          texcoordLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        gl.uniform2f(textureSizeLocation, image.width, image.height);

        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        // 在渲染效果时不翻转y轴
        gl.uniform1f(flipYLocation, 1);

        let div_effects = document.querySelector("#effects");
        let count = 0;
        for (let item of div_effects.children) {
          let div_input = item.getElementsByTagName("input")[0];
          if (div_input.checked) {
            setFramebuffer(framebuffers[count % 2], image.width, image.height);

            drawWithKernel(div_input.value);
            gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

            ++count;
          }
        }

        // 最后将结果绘制到画布
        gl.uniform1f(flipYLocation, -1);
        // 调用 gl.bindFramebuffer 设置为 null是告诉WebGL 你想在画布上绘制，而不是在帧缓冲上
        setFramebuffer(null, gl.canvas.width, gl.canvas.height);
        drawWithKernel("normal");
      }
      function setFramebuffer(fbo, width, height) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        gl.uniform2f(resolutionLocation, width, height);

        gl.viewport(0, 0, width, height);
      }
      function drawWithKernel(name) {
        gl.uniform1fv(kernelLocation, kernels[name]);
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }
    };

    function createAndSetupTexture(gl) {
      // 创建纹理
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // 设置参数，让我们可以绘制任何尺寸的图像
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      return texture;
    }

    function computeKernelWeight(kernel) {
      let weight = kernel.reduce((prev, cur) => prev + cur);
      return weight <= 0 ? 1 : weight;
    }

    function setRectangle(gl, x, y, width, height) {
      let x2 = x + width,
        y2 = y + height;

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x, y, x2, y, x2, y2, x, y, x2, y2, x, y2]),
        gl.STATIC_DRAW
      );
    }
  }
  second() {
    let { canvas, gl, program } = this.loadbasic(vertex_2, fragment_2);

    // 获取WebGL给属性分配的地址
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let colorLocation = gl.getAttribLocation(program, "a_color");

    let matrixLocation = gl.getUniformLocation(program, "u_matrix");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setGeometry(gl);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors();

    let translation = [200, 150];
    let angleInRadians = 0;
    let scale = [1, 1];
    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {
      value: translation[0],
      slide: updatePosition(0),
      max: gl.canvas.width,
    });
    webglLessonsUI.setupSlider("#y", {
      value: translation[1],
      slide: updatePosition(1),
      max: gl.canvas.height,
    });
    webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
    webglLessonsUI.setupSlider("#scaleX", {
      value: scale[0],
      slide: updateScale(0),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });
    webglLessonsUI.setupSlider("#scaleY", {
      value: scale[1],
      slide: updateScale(1),
      min: -5,
      max: 5,
      step: 0.01,
      precision: 2,
    });

    function setColors() {
      // 生成两个随机颜色
      var r1 = Math.random();
      var b1 = Math.random();
      var g1 = Math.random();

      var r2 = Math.random();
      var b2 = Math.random();
      var g2 = Math.random();

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          // [ r1, b1, g1, 1,
          //   r1, b1, g1, 1,
          //   r1, b1, g1, 1,
          //   r2, b2, g2, 1,
          //   r2, b2, g2, 1,
          //   r2, b2, g2, 1]),
          [
            Math.random(),
            Math.random(),
            Math.random(),
            1,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
            Math.random(),
            Math.random(),
            Math.random(),
            1,
          ]
        ),
        gl.STATIC_DRAW
      );
    }

    function updatePosition(index) {
      return function (event, ui) {
        translation[index] = ui.value;
        drawScene();
      };
    }

    function updateAngle(event, ui) {
      var angleInDegrees = 360 - ui.value;
      angleInRadians = (angleInDegrees * Math.PI) / 180;
      drawScene();
    }

    function updateScale(index) {
      return function (event, ui) {
        scale[index] = ui.value;
        drawScene();
      };
    }

    function drawScene() {
      // 告诉WebGL我们想从缓冲中提供数据
      gl.enableVertexAttribArray(positionAttributeLocation);
      // 这个命令是将缓冲绑定到 ARRAY_BUFFER 绑定点，它是WebGL内部的一个全局变量
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      var size = 2; // 2 components per iteration
      var type = gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); // 设置缓冲为当前使用缓冲
      // 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
      var size = 4; // 每次迭代使用4个单位的数据
      var type = gl.FLOAT; // 单位数据类型是32位的浮点型
      var normalize = false; // 不需要归一化数据
      var stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type)
      // 每次迭代跳多少距离到下一个数据
      var offset = 0; // 从绑定缓冲的起始处开始
      gl.vertexAttribPointer(
        colorLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // Compute the matrix
      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, translation[0], translation[1]);
      matrix = m3.rotate(matrix, angleInRadians);
      matrix = m3.scale(matrix, scale[0], scale[1]);

      // Set the matrix.
      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      // 绘制几何体
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }

    function setGeometry(gl) {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100,
        ]),
        gl.STATIC_DRAW
      );
    }
  }
  first() {
    let { canvas, gl, program } = this.loadbasic(vertex_1, fragment_1);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 三个二维点坐标
    var positions = [0, 0, 0, 0.5, 0.7, 0];
    // gl.STATIC_DRAW提示WebGL我们不会经常改变这些数据
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 这样就告诉WebGL裁剪空间的 -1 -> +1 分别对应到x轴的 0 -> gl.canvas.width 和y轴的 0 -> gl.canvas.height
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // // 清空画布
    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // 告诉它用我们之前写好的着色程序（一个着色器对）
    // gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // 将绑定点绑定到缓冲数据（positionBuffer）
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    var size = 2; // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0; // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    var resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );
    var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // 设置全局变量 分辨率
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // {
    //   var primitiveType = gl.TRIANGLES;
    //   var offset = 0;
    //   var count = 6;
    //   gl.drawArrays(primitiveType, offset, count);
    // }

    {
      let colorUniformLocation = gl.getUniformLocation(program, "u_color");

      for (let i = 0; i < 50; i++) {
        let w = window.innerWidth,
          h = window.innerHeight;

        setRectangle(
          gl,
          randomInt(w),
          randomInt(h),
          randomInt(w),
          randomInt(h)
        );

        gl.uniform4f(
          colorUniformLocation,
          Math.random(),
          Math.random(),
          Math.random(),
          1
        );

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      function randomInt(range) {
        return Math.floor(Math.random() * range);
      }
      function setRectangle(gl, x, y, width, height) {
        let x2 = x + width,
          y2 = y + height;

        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([x, y, x2, y, x2, y2, x, y, x2, y2, x, y2]),
          gl.STATIC_DRAW
        );
      }
    }
  }
  loadbasic(vertex, fragment) {
    let canvas = document.querySelector("#box");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let gl = canvas.getContext("webgl");
    if (!gl) {
      console.log("你不能使用WebGL");
      return;
    }
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 清空画布
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    function createProgram(gl, vertexShader, fragmentShader) {
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      var success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (success) {
        return program;
      }

      console.log(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }
    // 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
    function createShader(gl, type, source) {
      let shader = gl.createShader(type); // 创建着色器对象
      gl.shaderSource(shader, source); // 提供数据源
      gl.compileShader(shader); // 编译 -> 生成着色器
      let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }

      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }

    return { canvas, gl, program };
  }
  render() {
    return (
      <div>
        <canvas id="box" style={{ width: "100%", height: "100%" }} />
        <div id="uiContainer">
          <div id="ui">
            <div id="cameraX"></div>
            <div id="cameraY"></div>
            <div id="rotation"></div>
            <div id="cam1FieldOfView"></div>
            <div id="cam1PosX"></div>
            <div id="cam1PosY"></div>
            <div id="cam1PosZ"></div>
            <div id="fRotation"></div>
            <div id="lightRotationX"></div>
            <div id="lightRotationY"></div>
            <div id="limit"></div>
            <div id="shininess"></div>
            <div id="fRotationRadians"></div>
            <div id="cameraAngle"></div>
            <div id="fudgeFactor"></div>
            <div id="fieldOfViewRadians"></div>
            <div id="x"></div>
            <div id="y"></div>
            <div id="z"></div>
            <div id="angleX"></div>
            <div id="angleY"></div>
            <div id="angleZ"></div>
            <div id="scaleX"></div>
            <div id="scaleY"></div>
            <div id="scaleZ"></div>
          </div>
        </div>
        <div
          id="effects"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "300px",
            display: "none",
          }}
        ></div>
      </div>
    );
  }
}
