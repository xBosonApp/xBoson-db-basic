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
  
  personid : sys.request.personid, // 人员ID
  
};

var r = relationGet(data);

sys.put("result", r);

sys.setRetData(0);

function relationGet(data){
  
  var r;
  
  if(data.personid){
    r = relationColl.find(
      {
        _id: data._id
      },
      {
        group: { $elemMatch: { personid: data.personid } }
      }
    );
  }else{
    r = relationColl.find(
      {
        _id: data._id
      }
    );
  }
  
  if(r && r[0]){
    
    return r[0].group; 
    
  }
  
}