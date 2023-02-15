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

var userid = sys.getUserIdByOpenId();
var scenesid = id.split('.')[1];
lib.checkScene(userid, scenesid);

var send={}, recv={};
var sett = { 
  send          : send, 
  recv          : recv,
  auto_restart  : Boolean(sys.request.auto_restart),
  auto_auth     : userid,
};

if (sys.requestParameterMap.send) {
  var arr = sys.requestParameterMap.send;
  for (var i=0; i<arr.length; ++i) {
    send[arr[i]] = 1;
  }
}

if (sys.requestParameterMap.recv) {
  var arr = sys.requestParameterMap.recv;
  for (var i=0; i<arr.length; ++i) {
    recv[arr[i]] = 1;
  }
}

topic_set("data", false, true);
topic_set("state");
topic_set("event");
topic_set("save");

var r = lib.open("address").updateOne({_id:id}, { $set : sett });

if (r.getMatchedCount() < 1) {
  sys.ret(11);
  return;
}

sys.setRetData(0);


function topic_set(name, isSend, hasScript) {
  var cnt  = sys.request.getInteger(name +"_count", true);
  var q    = sys.request.getInteger(name +"_qos", true);
  var user = sys.request.getMember(name +"_user");
  var st   = sys.request.getMember(name +"_script");
  
  if (cnt > 0) {
    if (!user) {
      throw new Error("必须设置消息访问设备账户" + name);
    }
    if (isSend) {
      if (!send[user]) throw new Error("设备账户不在可发送消息列表中 "+ name);
    } else {
      if (!recv[user]) throw new Error("设备账户不在可接收消息列表中 "+ name);
    }
    if (hasScript && (!st)) {
      throw new Error("必须设置脚本 "+ name);
    }
  }
  
  // 脚本权限检查
  if (st) {
    var filter = {_id: st, $or:[ { owner: userid }, { share: userid } ]};
    if (lib.open('script').count(filter) < 1) {
      throw new Error("当前用户无权设置脚本 "+ st);
    }
  }
  
  sett[name] = {
    count : cnt,
    qos   : q,
    user  : user,
    script: st,
  }
}