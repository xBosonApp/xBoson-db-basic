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
var name      = sys.request.getString('name', 1, 99);
var prjid     = sys.request.getString('prjid', 1, 255);
var isGlobal  = sys.request.isTrue('isGlobal');
var requires  = sys.requestParameterMap['requires[]'] || [];
var groups    = sys.requestParameterMap['groups[]'] || [];

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');

if (regcoll.count({ name:name, type : 'component-library', }) > 0) {
  sys.setRetData(1, '组件库名称重复');
  return;
}

var msg = lib.checkArray(requires);
if (msg) {
  return sys.setRetData(1, '依赖项'+ msg);
}

var msg = lib.checkArray(groups);
if (msg) {
  return sys.setRetData(1, '分组项'+ msg);
}

var clib = {
  _id : lib.uuid(),
  // 组件库名字
  name : name,
  // 固定, 组件库
  type : 'component-library',
  // 与项目绑定
  prjid : prjid,
  // 全局都可以访问, 或只在项目中访问
  isGlobal : isGlobal,
  // 外部脚本加载路径列表, 完整ui路径(可能以 '/ui' '/t' 为前缀)
  requires : requires,
  // 分组列表(字符串数组)
  groups : groups,
};
regcoll.insert(clib);

sys.setRetData(0, '组件库已经创建');