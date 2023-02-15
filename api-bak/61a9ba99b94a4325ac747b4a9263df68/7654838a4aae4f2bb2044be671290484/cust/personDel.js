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

var data = {
  _id: sys.request._id,
  wx: sys.request.wx,  //wx唯一标识
  tel: sys.request.tel
}

if(!data._id && !data.wx && !data.tel){
  sys.setRetData(1);
  return;
}

personDel(data);

sys.setRetData(0);

function personDel(data){
  
  var query = {};
  
  
  if(data.wx){
    query = {
      "wx": data.wx
    };
  }
  if(data.tel){
    query["tel"] = data.tel
  }
  if(data._id){
    query["_id"] = data._id
  }
  
  coll.deleteOne(query);
  
}