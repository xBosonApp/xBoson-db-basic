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
var _id   = sys.request.getString('_id', 1, 99);
var prjid = sys.request.getString('prjid', 1, 255);
var clid  = sys.request.getString('clid', 1, 99);

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');
var reg = require("./reg");

if (! reg.hasClibModifyAuth(regcoll, clid, prjid)) {
  sys.setRetData(1, '无权修改该组件库');
  return;
}

var d = regcoll.deleteOne({
  _id  : _id,
  clid : clid,
  type : 'component-bind',
});

if (d.getDeletedCount()) {
  sys.setRetData(0, '绑定组件已删除');
} else {
  sys.setRetData(1, '删除绑定组件失败');
}