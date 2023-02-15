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

var coll = lib.open("person");

// 使用post
var requestJson = sys.requestJson || {};

// sys.printValue(JSON.stringify(sys.request));

// if(!requestJson){
//   sys.setRetData(1,"获取不到post JSON数据");
//   return;
// }

var data = {
  _id: requestJson._id || sys.request._id, //人员ID
  wx: requestJson.wx || sys.request.wx,  //wx唯一标识
  tel: requestJson.tel || sys.request.tel, // 手机号
  wxnm: requestJson.wxnm || sys.request.wxnm, // 微信昵称
  name: requestJson.name || sys.request.name, // 姓名
  sex: requestJson.sex || sys.request.sex, // 性别
  bdate: requestJson.bdate || sys.request.bdate, // 出生日期
  add: requestJson.add || sys.request.add, // 地址
  tag: requestJson.tag, // 标签 
  gps: {
    long: requestJson.long || sys.request.long,
    lat: requestJson.lat || sys.request.lat
  },
  status: requestJson.status || sys.request.status
}

// 人员ID，wxID，手机号
if(!data._id && !data.wx && !data.tel){
  // 从wx登录用户session里获取信息
  var session = lib.getSession(sys.request, cache);

  if(!session){
    sys.ret(1,"获取不到用户session");
    return;
  }
  if(!session.personid){
    sys.ret(1,"获取不到用户session中的personid，请重新登录");
    return;
  }
  data._id = session.personid;
}

// sys.printValue(sys.requestJson);
// sys.printValue(sys.request.getMember("a"));
// sys.printValue(sys.request.name);

var r = personEdit(data);

sys.put("result", r);

sys.setRetData(0);

function personEdit(data){
  
  // 更新查询条件
  var query = {};
  if(data._id != null){
    query["_id"] = data._id;
  }
  else if(data.wx != null){
    query["wx"] = data.wx;
  }
  else if(data.tel != null){
    query["tel"] = data.tel;
  }
  
  // 更新内容
  var setField = {};
  if(data.wx != null){
    setField.wx = data.wx;  //wx唯一标识
  }
  if(data.tel != null){
    setField.tel = data.tel;  //手机号
  }
  if(data.wxnm != null){
    setField.wxnm = data.wxnm; // 微信昵称
  }
  if(data.name != null){
    setField.name = data.name;  //姓名
  }
  if(data.sex != null){
    setField.sex = data.sex;  //
  }
  if(data.bdate != null){
    setField.bdate = data.bdate; // 出生日期
  }
  if(data.add != null){
    setField.add = data.add; //地址
  }
  if(data.tag != null){
    setField.tag = data.tag; //标签
  }
  if(data.gps != null){
    setField.gps = data.gps; 
  }
  if(data.status != null){
    setField.status = data.status; // 状态
  }
  setField.updatedt = new Date();
  
  var r = coll.updateOne(
    query,
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