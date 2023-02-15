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
var size2M = 2 *1024*1024;

var id        = sys.request.getString('_id', 1, 99);
var txt       = sys.request.getString('txt', 1, 99);
var doc       = sys.request.doc;
var prjid     = sys.request.getString('prjid', 1, 255);
var component = sys.request.getString('component', 1, 255);
var clid      = sys.request.getString('clid', 1, 99);
var style     = sys.request.getString('style', 1, size2M);
var helpTag   = sys.request.getString('helpTag', 0, 99);
var plugins   = sys.request.getString('plugins', 1, size2M);
var groupName = sys.request.getString('groupName', 1, 99);
var removeTxt = sys.request.isTrue('removeTxt');
var isContainer = sys.request.isTrue('isContainer');

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');
var reg = require("./reg");

if (! reg.hasClibModifyAuth(regcoll, clid, prjid)) {
  sys.setRetData(1, '无权修改该组件库');
  return;
}

var comp = {
  // 组件名, 也是显示内容
  txt : txt,
  // 组件文档
  doc : doc,
  // 不渲染组件名 (比如 <hr>)
  removeTxt : removeTxt,
  // 组件 id, 可以是 dom 或 vue 组件, 是最终渲染的组件
  component : component,
  // 分组名, 位于 component-library 中
  groupName : groupName,
  // 样式表对象, 参数是 json 字符串, 存储解析后的对象, 影响渲染样式
  style : JSON.parse(style),
  // 是容器组件
  isContainer : isContainer,
  // 设计时辅助 vue 组件名, 必须要时必须从外部加载组件文件.
  helpTag : helpTag,
  // 设计时辅助组件加载器, {key 组件名: path 组件路径}
  plugins : JSON.parse(plugins),
};

var r = regcoll.updateOne({
  _id : id, 
  type : 'component-bind',
  clid : clid,
}, {
  $set: comp,
});

sys.put("_id", id);
if (r.getModifiedCount()) {
  sys.setRetData(0, '修改成功');
} else if (r.getMatchedCount()) {
  sys.setRetData(0, '没有改动');
} else {
  sys.setRetData(1, '对象不存在');
}