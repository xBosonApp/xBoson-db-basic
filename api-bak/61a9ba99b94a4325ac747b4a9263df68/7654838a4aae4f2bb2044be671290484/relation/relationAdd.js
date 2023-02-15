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

var relationColl = lib.open("relation");

var data = {
  
  _id: sys.request.getString("_id"),//租户ID
  
  personid : sys.request.getString("personid"), // 人员ID
  
};

var r = relationAdd(data);

sys.put("result", r);

sys.setRetData(0);

function relationAdd(data){
  
  var r = relationColl.updateOne(
    {
      _id: data._id
    },
    {
      $push: {
        group: {
          personid: data.personid
        }
      }
    }
  );
  
  //返回 匹配文档数量和更新数量
  return {
    matched: r.getMatchedCount(),
    modified: r.isModifiedCountAvailable() ? r.getModifiedCount() : 0
  }
}