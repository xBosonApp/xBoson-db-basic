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

var lib = require("./lib");
var id = sys.request._id;

var where = { 
  $or : [
    { owner : sys.getUserIdByOpenId() },
    { share : sys.getUserIdByOpenId() },
  ]
};

var projection = {};

// 指定 _id 则返回全部属性, 否则没有 'code' 属性
if (id) {
  where._id = id;
} else {
  projection.code = 0;
}

var list = lib.open("script").find(where, projection, sys.request.pagenum, sys.request.pagesize);

if (id) {
  var iot = require("iot").open();
  iot.decrypt(list[0]);
}

sys.put("data", list);
sys.put("count", lib.open("script").count(where));
sys.ret(0);