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

var relationColl = lib.open_crm("relation");  // 租户客户表


// 参数
var data = {
  _id: sys.request.getString("_id"),//租户ID
};

// 租户表
deleteTenantOrg(data);

// 租户客户表
deleteTenantRelation(data);

sys.setRetData(0);


function deleteTenantOrg(data){
  
  coll.deleteOne({_id:data._id});
  
}

function deleteTenantRelation(data){
  relationColl.deleteOne({_id: data._id});
}