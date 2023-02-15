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

var did = sys.request.getString("devid", 1);
var sid = sys.request.getString("scenes", 1);
var pid = sys.request.getString("pid", 1);

var lib = require("./lib");
lib.testId(did);
lib.checkScene(sys.getUserIdByOpenId(), sid);

var now = new Date();

var prod = lib.open("product").find({ _id : lib.productId(sid, pid) });
if (prod.length < 1) throw new Error("产品不存在 "+ pid);

var meta = {};
prod[0].meta.forEach(function(p) {
  meta[p.name] = p.defval;
});

lib.open("device").insertOne({
  _id     : lib.deviceid(sid, pid, did),
  devid   : did,
  product : pid,
  scenes  : sid,
  state   : sys.request.state || '',
  dc      : 0,
  dd      : 0,
  cd      : now,
  md      : now,
  meta    : meta,
});

sys.setRetData(0);