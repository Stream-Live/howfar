/*
 * @Author: Wjh
 * @Date: 2023-02-20 08:38:40
 * @LastEditors: Wjh
 * @LastEditTime: 2023-03-01 17:22:50
 * @FilePath: \howfar\src\MainPage\WebGLStudy.js
 * @Description:
 *
 */
/*
 * @Author: Wjh
 * @Date: 2023-02-20 08:38:40
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-20 10:17:07
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
import { m3 } from "../webgl-libs/m3";
import { m4 } from "../webgl-libs/m4";
import { webglLessonsUI } from "../webgl-libs/webgl-lessons-ui";
import * as THREE from "three";
import { transition } from "d3";
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
    this.sixth(); // 三维正交、透视投影
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
