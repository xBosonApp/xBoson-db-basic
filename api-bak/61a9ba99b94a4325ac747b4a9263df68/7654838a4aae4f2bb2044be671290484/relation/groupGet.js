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
var orgColl = lib.open_operate('tenant-org');  //租户表

var session = lib.getSession(sys.request, cache);

if(!session){
  sys.ret(1,"获取不到用户session");
  return;
}

var data = {
  
  _id: session.personid,//人员ID
  
  personid : sys.request.personid, // 好友ID
  
};

var r = getGroup(data)

sys.put("result", r);

sys.setRetData(0);

function getGroup(data){
  
  var r;
  
  // 只返回一条好友关系
  if(data.personid){
    
    r = coll.find(
      {
        _id: data._id
      },
      {
        group: { $elemMatch :{ personid: data.personid} }
      }
    );
    
  }else{
    // 返回所有好友关系
    r = coll.find(
      {
        _id: data._id
      }
    );
    
  }
  
  if(r && r.length > 0){
    var group = r[0].group;
    
    // 获取人员ID数组
    var pidArr = [];
    group.forEach(function(v){
      pidArr.push(v.personid);
    })
    
    // 获取人员ID数组对应的人员信息
    var personR = coll.find(
      {_id: { $in: pidArr }  }, {group:0}
    );
    var personR_Map = {};
    personR.forEach(function(v){
      personR_Map[v._id] = v;
    });
    
    // 获取人员ID数组对应的租户机构信息
    var orgR_Map = getOrgPersonidMap(pidArr);
    
    // 合并 group 和 personR_Map , orgR_Map
    group.forEach(function(v){
      v.personInfo = personR_Map[v.personid]
      v.orgInfo = orgR_Map[v.personid]
    });
    
    return group;
  }
  
  return [];
}

// 获取人员所在租户信息
function getOrgPersonidMap(personids){
  if(!personids){
    return;
  }
  var resultMap = {};
  
  var result = orgColl.find(
     // 查询条件
    { "member.personid" : { $in:personids } },
    // 返回字段
    { "_id":1, "name":1, "nickname":1 ,
      "member": {$elemMatch: { personid: {$in:personids}}}
    } 
  );
  // sys.printValue(result);
  // 格式转换 personid:{name:'', nickname:'', post:''}
  result.forEach(function(row){
    row.member.forEach(function(member){
      resultMap[member.personid] = {
        name: row.name, nickname:row.nickname, post:member.post }
    });
  });
  return resultMap;
}