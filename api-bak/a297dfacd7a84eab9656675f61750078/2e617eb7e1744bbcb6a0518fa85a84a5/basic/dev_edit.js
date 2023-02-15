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

var id = sys.request.getString("_id", 1);

var lib = require("./lib");
var inf = lib.parseid(id);
lib.checkScene(sys.getUserIdByOpenId(), inf.sid);

var prod = lib.open("product").find({ _id : lib.productId(inf.sid, inf.pid) });
if (prod.length < 1) throw new Error("产品不存在 "+ inf.pid);

var up = {
  state : sys.request.state,
  meta  : {},
};

prod[0].meta.forEach(function(p) {
  var v = sys.request.getMember(p.name);
  if ((!v) && p.notnull) {
    throw new Error("参数"+ p.name +"不能为空");
  }
  up.meta[p.name] = v;
});

var r = lib.open("device").updateOne({
  _id : id,
}, { $set: up });

if (r.getMatchedCount() < 1) {
  sys.ret(11);
  return;
}

sys.setRetData(0);