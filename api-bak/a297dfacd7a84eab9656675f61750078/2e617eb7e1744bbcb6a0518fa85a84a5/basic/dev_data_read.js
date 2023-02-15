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

// 完整设备 id
var did  = sys.request.getString("did");
// 数据名
var name = sys.request.getString("name");
// 数据范围类型
var type = sys.request.getInteger("type");
// 事件
var time = sys.request.getString("time");

var lib = require("./lib");
lib.checkScene(sys.getUserIdByOpenId(), lib.parseid(did).sid);

var iot = require("iot").open();
var dataid = iot.dataId(did, name, type, new Date(time).getTime());
var ret = lib.open('dev-data').find({"_id": dataid})[0];

if (ret) {
  ret.time = time;
  ret.name = name;
  ret.type = type;
}

sys.put("data", ret);
sys.setRetData(0);