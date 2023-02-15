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
    // tel: sys.request.getString("tel"),//
  }
};


// 删除人员
// deletePerson(data);


// 删除租户成员
deleteTenantMember(data);



sys.setRetData(0);


function deleteTenantMember(data){
  
  coll.updateOne(
    {
      _id: data._id,
      
    },
    {
      $pull: {
        "member": {"personid": data.member._id  }
      }
    }
  );
  
}

// function deletePerson(data){
  
//   personColl.deleteOne({_id: data.member._id});
  
// }