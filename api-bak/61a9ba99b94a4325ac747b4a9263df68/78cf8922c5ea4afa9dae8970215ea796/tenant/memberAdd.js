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

var coll = lib.open("tenant-org");

var personColl = lib.open_crm("person");


// 参数
var data = {
  _id: sys.request.getString("tenantId"),//租户ID
  member: {
    personid: lib.genid(), // 人员ID
    name:sys.request.name,
    // pid: sys.request.getString("pid"),//租户成员ID（平台pid）
    // wx: sys.request.wx, // 租户成员个人微信账号
    // admin_flag: sys.request.admin_flag,	// 管理员标记（字典）
    post: sys.request.post,// 职称（字典）
    tel: sys.request.getString("tel"),	// 联系电话
    mark: sys.request.mark
  }
};

// 检查租户成员里是否已经有此手机号人员
var r = checkDuplicate(data);
if(r.duplicate){
  // 已存在此租户成员
  sys.put("duplicate",true);
  sys.setRetData(0);
  return;
}else if(r.personInfo){
  // 此手机号人员以存在，添加到租户成员里
  data.member.personid = r.personInfo._id;
  
  editPerson(data, r.personInfo.wxnm); // 修改人员名称,昵称
  addTenantMember(data);  // 添加到租户成员
}else{
  // 添加人员
  addPerson(data);
  
  // 添加租户成员
  addTenantMember(data);
}



sys.put("personid",data.member.personid);

sys.setRetData(0);


function addTenantMember(data){
  
  coll.updateOne(
    {_id: data._id},
    {
      $push: {
        member: {
          "personid":	data.member.personid,
          // "pid": data.member.pid,	// 租户成员ID（平台pid）
    	  	// "wx":	data.member.wx,	// 租户成员个人微信账号
    	  	// "admin_flag": data.member.admin_flag,	// 管理员标记（字典）
    	  	"post": data.member.post,	// 职称（字典）
    	  	// "tel": data.member.tel,	// 联系电话
    	  	"mark": data.member.mark,	
        }
      }
    }
  );
  
}

function addPerson(data){
  personColl.insertOne({
    _id: data.member.personid,
    tel: data.member.tel,
    name: data.member.name,
    status: "1",
    createdt: new Date(),
    updatedt: new Date()
  });
}

function editPerson(data,wxnm){
  personColl.updateOne(
    {_id: data.member.personid},
    {$set:{
      name: data.member.name,
      wxnm: wxnm ? wxnm : data.member.name
    }}
  );
}

// 查询手机号是否已存在此租户成员
function checkDuplicate(data){
  
  var result = { duplicate: false };
  
  var cntR = personColl.find({
    "tel": data.member.tel
  });
  
  if(cntR && cntR.length>0){
    
    var personid = cntR[0]._id;
    // 查询personid是否在此租户里
    var cnt = coll.count({
      _id: data._id,
      "member.personid": personid
    });
    if(cnt>0){
      result.duplicate = true; 
    }else{
      // 返回personInfo与租户成员绑定
      result.personInfo = cntR[0];
    }
    
  }
  
  return result;
}