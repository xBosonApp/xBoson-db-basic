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

var id = sys.request.getString("_id");
var cql = sys.request.getString("cql", 1, 99999999);
var limit = sys.request.getInteger('limit', true) || 5000;
var lib = require("../basic/lib");

var conninfo = lib.db("conn-list").find({_id: id})[0];
if (!conninfo) {
  return sys.ret(1, "不是有效连接 "+ id);
}

var sess = lib.open(conninfo.uri, conninfo.authUser, conninfo.authPass);
var res = sess.query(cql);

var data = [];
var rcount = 0;
// 使用限制时, 数据出现不一致!
while (res.hasNext() && rcount < limit) {
  ++rcount;
  data.push(res.next());
}

if (rcount >= limit) {
  sys.put("warn", "数据超过"+ limit +'行, 部分数据被截断');
}
sys.put("data", data);
sys.ret(0);