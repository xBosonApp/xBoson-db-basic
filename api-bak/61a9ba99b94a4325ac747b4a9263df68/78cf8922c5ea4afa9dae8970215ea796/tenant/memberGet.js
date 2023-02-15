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

var personColl = lib.open_crm("person");

// 参数
var data = {
  _id: sys.request.getString("tenantId"),//租户ID
  // keyword: sys.request.keyword || "",//关键词
  member: {
    _id: sys.request.personid
    // tel: sys.request.tel
  }
};

var r = queryTenantMember(data);

r = queryPerson(r);

sys.put("result",r);

sys.setRetData(0);


function queryTenantMember(data){
  
  
  if(data.member._id){
    
    var r = coll.find(
      {_id: data._id},
      {
        member: {$elemMatch: {"personid": data.member._id} }
      }
      
    );
    
    return r;
    
  }else{
    
    
    var r = coll.find(
      {_id: data._id}
    );
    
    return r;
    
  }
  
  
  
}

function queryPerson(r){
  
  // sys.printValue(r);
  
  if(r.length == 0 || !r[0].member || r[0].member.length==0){
    return r;
  }
  
  var personIds = [];
  
  r[0].member.forEach(function(v){
    personIds.push(v.personid);
  });
  
  if(personIds.length==0){
    return;
  }
  
  var resultPerson = personColl.find({ _id: { $in:personIds } },{group:0} );
  
  // 合并结果
  var tmpMap = {}
  resultPerson.forEach(function(v){
    tmpMap[v._id] = v;
  });
  
  r[0].member.forEach(function(v){
    var person = tmpMap[v.personid];
    if(!person) return;
    
    var keys = Object.keys(person);
    keys.forEach(function(key){
      v[key]=person[key];
    });
    // Object.assign(v,tmpMap[v.personid]);
  });
  
  return r;
  
  
}