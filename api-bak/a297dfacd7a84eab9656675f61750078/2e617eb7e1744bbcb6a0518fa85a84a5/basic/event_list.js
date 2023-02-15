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

var sid = sys.request.getString("scenes", 1);
var pid = sys.request.getString("pid", 1);

var lib = require("./lib");
lib.checkScene(sys.getUserIdByOpenId(), sid);

var where = {'product':pid, 'scenes':sid};
if (sys.request.devid) {
  where.devid = lib.deviceid(sid, pid, sys.request.devid);
}
if (sys.request.code) {
  where.code = parseInt(sys.request.code);
}
if (sys.request.level) {
  where.level = parseInt(sys.request.level);
}

switch (parseInt(sys.request.resp_type)) {
  case 1: // 已应答
    where.repwho = { $ne: null };
    break;
  case 2: // 未应答
    where.repwho = { $eq: null };
    break;
} 

//var list = lib.open("event_his").find(where, sys.request.pagenum, sys.request.pagesize)

var list = lib.open("event_his").find2(where).page(sys).sort({_id:-1}).toArray();

sys.put("data", list);
sys.put("count", lib.open("event_his").count(where));
sys.setRetData(0);