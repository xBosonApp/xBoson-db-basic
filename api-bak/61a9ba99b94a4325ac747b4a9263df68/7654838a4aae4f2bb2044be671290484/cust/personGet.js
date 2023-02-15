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
var orgColl = lib.open_operate('tenant-org');  //租户表

var data = {
  _id: sys.request._id,
  tel: sys.request.tel,
  wx: sys.request.wx,  //wx唯一标识
  keyword: sys.request.keyword // 关键词
}

// var crypto = require('crypto');
// sys.printValue(crypto.algorithmNames())
// sys.printValue(lib.test());
// sys.printValue(sys.request.a);

if(!data._id && !data.wx && !data.tel && !data.keyword){
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

var r = personGet(data);
sys.put("result",r);

if(r[0]){
  var orgInfo = queryTenantOrg(r[0]._id);
  sys.put('orgInfo',orgInfo);
}

sys.setRetData(0);

function personGet(data){
  
  var query = {};
  
  if(data._id){
    query["_id"] = data._id
  }
  if(data.wx){
    query["wx"] = data.wx;
  }
  if(data.tel){
    query["tel"] = data.tel
  }
  
  // 关键词
  if(data.keyword){
    var regex = ".*"+data.keyword+".*";
    query["or"] = [
      {"tel": {$regex:regex, $options: "is"}},
      {wxnm: {$regex:regex, $options: "is"}},
      {name: {$regex:regex, $options: "is"}},
      {add: {$regex:regex, $options: "is"}}
    ]
  }
  
  var r = coll.find(query,{group:0});
  
  return r;
}

function queryTenantOrg(personid){
  
  var query, projection;
  
  query = {
    "member.personid": personid
  };
  projection = {
    _id: 1,
    name: 1,
    nickname: 1,
    member: {$elemMatch: {"personid": personid} },
  }
    
  var r = orgColl.find(
    query,
    projection
  );
  
  if(r && r.length>0){
    return {
      name: r[0].name,
      nickname: r[0].nickname,
      post: r[0].member[0].post
    }
  }
  
}