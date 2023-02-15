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

var lib = require("./lib");
var id = lib.genid();
var pdata = {
  _id     : lib.productId(scenesid, id),
  pid     : id,
  scenes  : scenesid,
  name    : sys.request.getString("name", 1),
  desc    : sys.request.desc || '',
  cd      : new Date(),
  md      : new Date(),
  meta    : [],
  data    : [],
  cmd     : [],
  event   : {},
}

lib.checkScene(sys.getUserIdByOpenId(), scenesid);

lib.open("product").insertOne(pdata);

var topic_conf = {
  count : 0,
  qos   : 0,
  user  : '',
  script: '',
};

lib.open("address").insertOne({
  _id   : pdata._id,
  fmt   : lib.mqid(scenesid, id),
  send  : {},
  recv  : {},
  
  data  : topic_conf,
  state : topic_conf,
  event : topic_conf,
  save  : topic_conf,
});

sys.setRetData(0);