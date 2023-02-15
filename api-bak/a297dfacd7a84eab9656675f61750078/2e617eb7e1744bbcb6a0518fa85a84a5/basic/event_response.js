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

var sid     = sys.request.getString("scenes", 1);
var id      = sys.request.getString("_id", 1);
var repmsg  = sys.request.getString("repmsg", 1);

var lib = require("./lib");
lib.checkScene(sys.getUserIdByOpenId(), sid);

var where = {
  'scenes' : sid,
  '_id'    : lib.newid(id),
  'repmsg' : { $eq: null },
};

var r = lib.open("event_his").updateOne(where, {
  $set : {
    repmsg  : repmsg,
    repwho  : sys.getUserIdByOpenId(),
    reptime : new Date(),
  }
});

if (r.getMatchedCount() < 1) {
  sys.ret(11, '数据不存在或已经响应');
  return;
}

sys.setRetData(0);