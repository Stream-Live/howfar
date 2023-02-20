/*
 * @Author: Wjh
 * @Date: 2022-07-26 09:30:34
 * @LastEditors: Wjh
 * @LastEditTime: 2023-02-20 15:22:42
 * @FilePath: \howfar\src\index.js
 * @Description: 
 * 
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'antd/dist/antd.css';
import './webgl-libs/webgl-tutorials.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
