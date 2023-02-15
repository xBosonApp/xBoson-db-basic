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

var lib = require("../cust/lib");

var coll = lib.open("person");

var session = lib.getSession(sys.request, cache);

if(!session){
  sys.ret(1,"获取不到用户session");
  return;
}

var reqJson = sys.requestJson;

if(!reqJson.personid){
  sys.ret(1,"缺少personid参数");
  return;
}

var data = {
  
  _id: session.personid,//人员ID
  
  personid : reqJson.personid, // 好友ID
  tag: reqJson.tag, // 标签
  mark : reqJson.mark //备注
  
};

var r = editGroup(data)

sys.put("result", r);

sys.setRetData(0);

function editGroup(data){
  var setField = {};
  
  if(data.tag){
     setField["group.$.tag"] = data.tag;
  }
  if(data.mark){
     setField["group.$.mark"] = data.mark;
  }
  //修改好友备注
  var r = coll.updateOne(
    {
      _id: data._id,
      "group.personid": data.personid
    },
    {
      $set: setField
    }
  );
  
  //返回 匹配文档数量和更新数量
  return {
    matched: r.getMatchedCount(),
    modified: r.isModifiedCountAvailable() ? r.getModifiedCount() : 0
  }
}