/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

module.exports = {
  createStruct : createStruct,
};

/* -----------------------------------------------------------------------
tagConfig : {
  id, note, 
  // 标签实例属性
  props:{
    // 组件实例的样式
    style, 
    // 如果是组件容器, 表示内嵌组建列表
    nestedList:[tagConfig,..]
  }, 
  // 属性原数据
  propsConfig:{[..key]:propsConfig}, 
  // 平台组件id
  cid, 
  // 组件库id
  clid,
  // 标签文本
  txt,
  // 帮助文档
  doc,
  // 不渲染 txt 文本
  removeTxt, 
  // vue 组件名, 可以是 html 标签名, 是最终渲染时的标签.
  component, 
  // 在设计时使用这个 tag 进行辅助
  helpTag, 
  // 组件的实例, 总是 true
  isInstance, 
  // true 表示一个组件容器, 容器中可拖拽组件
  isContainer,
  // 绑定 root.styles 中的样式
  bindStyle:{[..key]:true},
  // 特殊 vue 属性, key: [v-if, v-for, key] 等
  vspecial: { key: { value, propsConfig } },
}

propsConfig : {
  // attribute 标签属性 / design 设计时属性 / event 绑定事件函数
  type : 'attribute',
  // type==attribute: 
  //      constant 常量 / variable 变量 / function 函数引用 / call 函数调用 / expr 表达式
  // type==event: 
  //      function 函数引用 / call 函数调用 / expr 表达式
  varType : 'constant', 
  // varType 当为变量或函数引用时, 变量名或函数名, 
  ref : null,
  // varType==expr 是表达式的值
  expr : null,
  // varType==call 函数调用时实参列表
  callParams : [callFuncParam,..],
  // attribute==event 时有效, 事件修饰符列表
  modifiers: ['.stop', null, '', ...],
  // type==attribute 用v-bind 绑定属性
  isExprAttr : false,
}

callFuncParam: {
  // 0: v为原始值, 不做任何处理; 1: 字符串, 用引号包裹
  t : 0, 
  v : '',
  // 参数名, 绑定函数时确定
  n : '',
}

variable : { 
  name  中文变量名, 
  num   全局唯一序号, 
  def   变量初始值, 
  type  变量类型 'Number/String/Object/Array/Boolean/Date',
}
        
func : { 
  name, 
  num       全局唯一序号, 
  code      无头代码, 
  innerRef  内置函数引用,
  type      函数类型 'inner 内置类型/code 代码',
  params    形参列表:[defineFuncParam,..]
}

argumentProp : {
  name      中文名, 
  num       全局唯一序号,
  type      变量类型 'Number/String/Object/Array/Boolean/Date',
  def       默认值,
  required  bool 必填项,
}

computeProp : {
  name      中文名, 
  num       全局唯一序号,
  scode     setter 函数代码(无头) Function(v:设置的值)
  gcode     getter 函数代码(无头) Function()
}

watchProp : {
  name      中文名, 
  num       全局唯一序号,
  code      无头代码, 监听器 Function(nv:新值, ov:旧值)
}

// 函数定义时参数
defineFuncParam: {
  name  中文名字
  pn    形参名
}

styleCfg: { 
  name    中文名称, 
  num     全局唯一序号, 
  val     style 配置项, 
  prefix  查询前缀 ‘.’ 等 
}

pageSetting: {
  "resolution": { 分辨率, 可以为 null
      "name": "魅族 16th",
      "w": 360,
      "h": 720
  },
  "hasBorder": true,
  "border": { 可以为 null
      "name": "样式1",
      "file": "device/m1m.svg",
      "p": [x, y, w, h] 边框的边距
  },
  "unit": "pt",
  "index": {} 为还原选项画面的属性 
}
----------------------------------------------------------------------- */

function createStruct() {
  return {
    list:[
      // tagConfig
    ], 
    root:{ 
      id: 0,
      vars: {
        // key(渲染变量名 v$): variable
      },
      funcs: {
        // key(渲染函数名 fc$): func
      },
      styles: {
        // key(渲染class名): styleCfg
      },
      plugins: {
        // 编辑器需要的外部插件, 或合成组件内部依赖
        // key(vue组件id, 渲染器忽略): path
      },
      requires: {
        // 加载外部组件, 文件列表
        // 文件名: 1
      },
      argProps: { 
        // key(渲染属性名): argumentProp
      },
      computeProps: {
        // key(渲染属性名 cp$): computeProp
      },
      watchs: {
        // key(监听属性名 [wt$]与 vars/argProps 重名): watchProp
      },
      // 初始化钩子函数列表
      mounted: [ /* functionKeyRef */ ],
      // 销毁钩子函数列表
      beforeDestroy: [ /* functionKeyRef */ ],
      // 页面设置, 不设置, 由前端 (store.js) 初始化默认设置
      // pageSetting: { index:{} /* pageSetting */},
    }
  };
}