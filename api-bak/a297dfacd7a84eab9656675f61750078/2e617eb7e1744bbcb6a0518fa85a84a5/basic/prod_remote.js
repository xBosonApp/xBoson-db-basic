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

var scenesid = sys.request.getString("scenes", 1);
var pid = sys.request.getString("pid", 1);

var lib = require("./lib");
lib.checkScene(sys.getUserIdByOpenId(), scenesid);

if (lib.open("device").count({ product: pid }) > 0) {
  sys.ret(8, '产品中有设备, 不能删除');
  return;
}

var iot = require("iot").open();
if (iot.info(scenesid, pid).length > 0) {
  iot.stopAll(scenesid, pid);
}

var id = lib.productId(scenesid, pid)
var r = lib.open("product").deleteOne({ _id: id, scenes: scenesid});
if (r.getDeletedCount() < 1) {
  sys.ret(11);
  return;
}

var r = lib.open("address").deleteOne({ _id: id });
if (r.getDeletedCount() < 1) {
  sys.ret(11);
  return;
}

sys.setRetData(0);