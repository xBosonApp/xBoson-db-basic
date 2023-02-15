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

// 获取租户信息（带搜索条件：返回列表/单个详细信息）

var lib = require("./lib");

var coll = lib.open("tenant-org");


// 参数
var data = {
  _id: sys.request._id,//租户ID
  keyword: sys.request.keyword || "",//关键词
  status: sys.request.status,// 状态
  personid: sys.request.personid
};

var r = queryTenantOrg(data);

sys.put("result",r);

sys.setRetData(0);


function queryTenantOrg(data){
  
  var query, projection = {member:0};
  
  if(data._id){
    
    query = {
      _id: data._id
    };
    
  }else if(data.personid){
    query = {
      "member.personid": data.personid
    };
    projection = {
      _id: 1,
      name: 1,
      nickname: 1,
      member: {$elemMatch: {"personid": data.personid} },
    }
  }else{
    
    // 关键词
    var regex = ".*"+data.keyword+".*";
    
    query = {
      $or:[
        {"name": {$regex:regex, $options: "is"}},
        {nickname: {$regex:regex, $options: "is"}},
        {add: {$regex:regex, $options: "is"}},
        {pid: {$regex:regex, $options: "is"}},
        {"mark": {$regex:regex, $options: "is"}}
      ]
    }
    
    // 状态
    if(data.status){
      query.status = data.status;
    }
    
  }
  
  var r = coll.find(
    query,
    projection
  );
  
  
  // // 添加userid
  // r.forEach(function(v){
  //   if(v.pid)
  //     v.userid = sys.getUserIdByPID(v.pid);
  // });
  
  return r;
  
  
  
}