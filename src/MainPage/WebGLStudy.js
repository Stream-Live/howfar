/*
 * @Author: Wjh
 * @Date: 2023-02-20 08:38:40
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-21 17:28:49
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
import vertex_1 from '../shaders/vertex-1'
import fragment_1 from '../shaders/fragment-1'
import vertex_2 from '../shaders/vertex-2'
import fragment_2 from '../shaders/fragment-2'
import vertex_3 from '../shaders/vertex-3'
import fragment_3 from '../shaders/fragment-3'
import vertex_4 from '../shaders/vertex-4'
import fragment_4 from '../shaders/fragment-4'
import  {m3} from '../webgl-libs/m3'
import  {webglLessonsUI} from '../webgl-libs/webgl-lessons-ui'
import * as THREE from 'three';
window.THREE = THREE;

export default class WebGLStudy extends React.Component {
  componentDidMount() {
    this.draw();
  }
  draw() {
    // this.first();    // Webgl基础概念
    // this.second();   // Webgl工作原理
    this.third();       // Webgl图像处理
    // this.fourth();      // webgl二维平移
    
  }
  fourth(){
    let {canvas, gl, program} = this.loadbasic(vertex_2, fragment_2);

    let translation = [0,0],
        width = 100,
        height = 30,
        color = [Math.random(), Math.random(), Math.random(), 1];
    
    function drawScene(){
      
    }
  }

  third(){
    let {canvas, gl, program} = this.loadbasic(vertex_3, fragment_3);

    let image = new Image();
    image.crossOrigin ="anonymous"; // 解决图片跨域问题
    image.src = 'https://webglfundamentals.org/webgl/resources/leaves.jpg';
    image.onload = () => {
      console.log('加载完成');
      var positionLocation = gl.getAttribLocation(program, "a_position");
      var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
      let positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      setRectangle(gl, 0, 0, image.width, image.height);

      // 给矩形提供纹理坐标
      let texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
      ]), gl.STATIC_DRAW);

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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      
      let textures = [];
      let framebuffers = [];
      for(let i=0;i<2;i++){

        let texture = createAndSetupTexture(gl);
        textures.push(texture);

        // 设置纹理大小和图像大小一致
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
          gl.RGBA, gl.UNSIGNED_BYTE, null
        );

        // 创建一个帧缓冲
        let fbo = gl.createFramebuffer();
        framebuffers.push(fbo);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // 绑定纹理到帧缓冲
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      }

      let resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      let textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
      let kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
      let kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
      var flipYLocation = gl.getUniformLocation(program, "u_flipY");

      // 定义几个卷积核
      var kernels = {
        normal: [
          0, 0, 0,
          0, 1, 0,
          0, 0, 0
        ],
        gaussianBlur: [
          0.045, 0.122, 0.045,
          0.122, 0.332, 0.122,
          0.045, 0.122, 0.045
        ],
        gaussianBlur2: [
          1, 2, 1,
          2, 4, 2,
          1, 2, 1
        ],
        gaussianBlur3: [
          0, 1, 0,
          1, 1, 1,
          0, 1, 0
        ],
        unsharpen: [
          -1, -1, -1,
          -1,  9, -1,
          -1, -1, -1
        ],
        sharpness: [
           0,-1, 0,
          -1, 5,-1,
           0,-1, 0
        ],
        sharpen: [
           -1, -1, -1,
           -1, 16, -1,
           -1, -1, -1
        ],
        edgeDetect: [
           -0.125, -0.125, -0.125,
           -0.125,  1,     -0.125,
           -0.125, -0.125, -0.125
        ],
        edgeDetect2: [
           -1, -1, -1,
           -1,  8, -1,
           -1, -1, -1
        ],
        edgeDetect3: [
           -5, 0, 0,
            0, 0, 0,
            0, 0, 5
        ],
        edgeDetect4: [
           -1, -1, -1,
            0,  0,  0,
            1,  1,  1
        ],
        edgeDetect5: [
           -1, -1, -1,
            2,  2,  2,
           -1, -1, -1
        ],
        edgeDetect6: [
           -5, -5, -5,
           -5, 39, -5,
           -5, -5, -5
        ],
        sobelHorizontal: [
            1,  2,  1,
            0,  0,  0,
           -1, -2, -1
        ],
        sobelVertical: [
            1,  0, -1,
            2,  0, -2,
            1,  0, -1
        ],
        previtHorizontal: [
            1,  1,  1,
            0,  0,  0,
           -1, -1, -1
        ],
        previtVertical: [
            1,  0, -1,
            1,  0, -1,
            1,  0, -1
        ],
        boxBlur: [
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111
        ],
        triangleBlur: [
            0.0625, 0.125, 0.0625,
            0.125,  0.25,  0.125,
            0.0625, 0.125, 0.0625
        ],
        emboss: [
           -2, -1,  0,
           -1,  1,  1,
            0,  1,  2
        ]
      };
      var initialSelection = 'gaussianBlur';
      let edgeDetectKernel = kernels[initialSelection];
      gl.uniform1fv(kernelLocation, edgeDetectKernel);
      gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));

      let div_effects = document.querySelector('#effects');
      for(let key in kernels){
        let item = kernels[key];
        let div_item = document.createElement('div');
        let div_input = document.createElement('input');
        div_input.value = key;
        div_input.type = 'checkbox';
        
        div_input.onchange = drawEffects;
        div_item.appendChild(div_input);
        div_item.appendChild(document.createTextNode('= ' + key))
        div_effects.appendChild(div_item);
      }
      drawEffects();
      

      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }
    function drawEffects(){
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionLocation, size, type, normalize, stride, offset);
      
      gl.enableVertexAttribArray(texcoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          texcoordLocation, size, type, normalize, stride, offset);
      
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

      gl.uniform2f(textureSizeLocation, image.width, image.height);

      gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

      // don't y flip images while drawing to the textures
      gl.uniform1f(flipYLocation, 1);

      // loop through each effect we want to apply.
      var count = 0;
      for (var ii = 0; ii < tbody.rows.length; ++ii) {
        var checkbox = tbody.rows[ii].firstChild.firstChild;
        if (checkbox.checked) {
          // Setup to draw into one of the framebuffers.
          setFramebuffer(framebuffers[count % 2], image.width, image.height);

          drawWithKernel(checkbox.value);

          // for the next draw, use the texture we just rendered to.
          gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

          // increment count so we use the other texture next time.
          ++count;
        }
      }

      // finally draw the result to the canvas.
      gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
      setFramebuffer(null, gl.canvas.width, gl.canvas.height);
      drawWithKernel("normal");
    }
    function setFramebuffer(fbo, width, height) {
      // make this the framebuffer we are rendering to.
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  
      // Tell the shader the resolution of the framebuffer.
      gl.uniform2f(resolutionLocation, width, height);
  
      // Tell webgl the viewport setting needed for framebuffer.
      gl.viewport(0, 0, width, height);
    }

    function createAndSetupTexture(gl){
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

    function computeKernelWeight(kernel){
      let weight = kernel.reduce((prev, cur) => prev + cur);
      return weight <= 0 ? 1 : weight;
    }
    
    function setRectangle(gl, x, y, width, height){

      let x2 = x + width,
          y2 = y + height;
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y,
        x2, y,
        x2, y2,
        x, y,
        x2, y2,
        x, y2
      ]), gl.STATIC_DRAW);
    }
  }
  second(){
    let {canvas, gl, program} = this.loadbasic(vertex_2, fragment_2);

    // 获取WebGL给属性分配的地址
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let colorLocation = gl.getAttribLocation(program, 'a_color');

    let matrixLocation = gl.getUniformLocation(program, 'u_matrix');

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
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    
    function setColors(){
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
            [ Math.random(), Math.random(), Math.random(), 1,
              Math.random(), Math.random(), Math.random(), 1,
              Math.random(), Math.random(), Math.random(), 1,
              Math.random(), Math.random(), Math.random(), 1,
              Math.random(), Math.random(), Math.random(), 1,
              Math.random(), Math.random(), Math.random(), 1]),
          gl.STATIC_DRAW);
    }

    function updatePosition(index) {
      return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
      };
    }

    function updateAngle(event, ui) {
      var angleInDegrees = 360 - ui.value;
      angleInRadians = angleInDegrees * Math.PI / 180;
      drawScene();
    }

    function updateScale(index) {
      return function(event, ui) {
        scale[index] = ui.value;
        drawScene();
      };
    }

    function drawScene(){

      // 告诉WebGL我们想从缓冲中提供数据
      gl.enableVertexAttribArray(positionAttributeLocation);
      // 这个命令是将缓冲绑定到 ARRAY_BUFFER 绑定点，它是WebGL内部的一个全局变量
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);    // 设置缓冲为当前使用缓冲
      // 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
      var size = 4;          // 每次迭代使用4个单位的数据
      var type = gl.FLOAT;   // 单位数据类型是32位的浮点型
      var normalize = false; // 不需要归一化数据
      var stride = 0;        // 0 = 移动距离 * 单位距离长度sizeof(type) 
                            // 每次迭代跳多少距离到下一个数据
      var offset = 0;        // 从绑定缓冲的起始处开始
      gl.vertexAttribPointer(
          colorLocation, size, type, normalize, stride, offset)
      
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

    function setGeometry(gl){
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -150, -100,
          150, -100,
         -150,  100,
          150, -100,
         -150,  100,
          150,  100
        ]),
        gl.STATIC_DRAW
      )
    }
  }
  first(){

    let {canvas, gl, program} = this.loadbasic(vertex_1, fragment_1);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 三个二维点坐标
    var positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
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
    var size = 2;          // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                          // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var positions = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30,
    ];
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
      let colorUniformLocation = gl.getUniformLocation(program, 'u_color');

      for(let i=0;i<50;i++){

        let w = window.innerWidth,
            h = window.innerHeight;

        setRectangle(gl, randomInt(w), randomInt(h), randomInt(w), randomInt(h));

        gl.uniform4f(colorUniformLocation, Math.random(),Math.random(),Math.random(),1);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      function randomInt(range){
        return Math.floor(Math.random() * range);
      }
      function setRectangle(gl, x, y, width, height){

        let x2 = x + width,
            y2 = y + height;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          x, y,
          x2, y,
          x2, y2,
          x, y,
          x2, y2,
          x, y2
        ]), gl.STATIC_DRAW);
      }
    }

  }
  loadbasic(vertex, fragment){
    let canvas = document.querySelector("#box");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let gl = canvas.getContext("webgl");
    if (!gl) {
      console.log('你不能使用WebGL');
      return
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

    return {canvas, gl, program}
  }
  render() {
    return (
      <div>
        <canvas id="box" style={{ width: "100%", height: "100%" }} />
        <div id="uiContainer">
          <div id="ui">
            <div id="x"></div>
            <div id="y"></div>
            <div id="angle"></div>
            <div id="scaleX"></div>
            <div id="scaleY"></div>
          </div>
        </div>
        <div id="effects" style={{position: 'absolute', top: 0, right: 0, width: '200px', height: '300px'}}>

        </div>
      </div>
    );
  }
}