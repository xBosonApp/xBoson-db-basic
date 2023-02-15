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
var _id       = sys.request.getString('_id', 1, 99);
var name      = sys.request.getString('name', 1, 99);
var prjid     = sys.request.getString('prjid', 1, 255);
var isGlobal  = sys.request.isTrue('isGlobal');
var requires  = sys.requestParameterMap['requires[]'] || [];
var groups    = sys.requestParameterMap['groups[]'] || [];

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');
var reg = require("./reg");

if (! reg.hasClibModifyAuth(regcoll, _id, prjid)) {
  sys.setRetData(1, '无权修改该组件库');
  return;
}

if (regcoll.count({ name:name, type : 'component-library', _id:{$ne: _id}}) > 0) {
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
  // 组件库名字
  name : name,
  // 全局都可以访问, 或只在项目中访问
  isGlobal : isGlobal,
  // 外部脚本加载路径列表, 完整ui路径(可能以 '/ui' '/t' 为前缀)
  requires : requires,
  // 分组列表(字符串数组)
  groups : groups,
};

var up = {
  _id : _id,  
  type : 'component-library',
  $or : [
    { isGlobal: true },
    { isGlobal: false, prjid: prjid },
  ],
};

var r = regcoll.updateOne(up, {
  $set : clib,
});

if (r.getModifiedCount()) {
  sys.setRetData(0, '组件库已经更新');
} else if (r.getMatchedCount()) {
  sys.setRetData(0, '没有改动');
} else {
  sys.setRetData(1, '没有找到组件库');
}