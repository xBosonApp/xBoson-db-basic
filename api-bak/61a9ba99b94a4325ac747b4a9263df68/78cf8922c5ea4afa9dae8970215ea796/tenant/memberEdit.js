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
    _id: sys.request.getString("personid"),
    name:sys.request.name,
    // pid: sys.request.getString("pid"),//租户成员ID（平台pid）
    // wx: sys.request.wx, // 租户成员个人微信账号
    // admin_flag: sys.request.admin_flag,	// 管理员标记（字典）
    post: sys.request.post,// 职称（字典）
    // tel: sys.request.getString("tel"),	// 联系电话
    mark: sys.request.mark // 备注
  }
};

editPerson(data);

editTenantMember(data);

sys.setRetData(0);


function editTenantMember(data){
  
  coll.updateOne(
    {
      _id: data._id,
      "member.personid": data.member._id
    },
    {
      $set: {
        // "member.$.name":	data.member.name,
        
        // "member.$.wx":	data.member.wx,	// 租户成员个人微信账号
  	  	// "member.$.admin_flag": data.member.admin_flag,	// 管理员标记（字典）
  	  	"member.$.post": data.member.post,	// 职称（字典）
  	  	"member.$.mark":	data.member.mark,
      }
    }
  );
  
}

function editPerson(data){
  
  personColl.updateOne(
    {_id: data.member._id},
    {
      $set: {
        name: data.member.name
      }
    }
  );
  
}