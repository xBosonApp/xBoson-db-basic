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
var _id     = sys.request.getString('_id', 1, 255);
var prjid   = sys.request.getString('prjid', 1, 255);
var clid    = sys.request.getString('clid', 1, 99);
var name    = sys.request.getString('name', 1, 99);

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');
var reg = require("./reg");

if (! reg.hasClibModifyAuth(regcoll, clid, prjid)) {
  sys.setRetData(1, '无权修改该组件库');
  return;
}

if (!lib.attrNameCheck.test(name)) {
  sys.setRetData(1, "属性名格式无效");
  return;
}

var s = {};
s['props.'+ name] = '';

var r = regcoll.updateOne({
  _id  : _id,
  type : 'component-bind',
}, {
  $unset : s,
});

if (r.getModifiedCount()) {
  sys.setRetData(0, '属性已经删除');
} else {
  sys.setRetData(0, '属性删除失败');
}