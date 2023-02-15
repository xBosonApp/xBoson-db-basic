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

var lib = require('./lib');

var collection = lib.open("dicts");

// add：添加，
// edit：修改，
// delete：删除，
var op_type = sys.request.getString("op_type"); 


var data = {
  cd: sys.request.getString("cd"),  //类别编码
  parentcd: sys.request.getString("parentcd"),  //父类别编码
  
  ver: sys.request.getString("ver"),  //明细版本
  status: sys.request.status, //明细版本状态
  mark: sys.request.mark, //明细版本说明
  
  standard: sys.request.standard //明细版本标准
}

if(op_type == "add"){
  
  var r = item_ver_add(data);
  if(r){
    sys.setRetData(1, r);
    return;
  }
  
}else if(op_type == "edit"){
  item_ver_edit(data);
}else if(op_type == "delete"){
  item_ver_delete(data);
}else{
  sys.setRetData(1, "op_type参数错误");
  return;
}

sys.setRetData(0, 'ok');


//字典明细版本添加
function item_ver_add(data){
  
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  var d = {
    ver: data.ver,
    status: data.status,
    mark: data.mark,
    standard: data.standard,
    createdt: new Date(),
    updatedt: new Date(),
    data: []
  }
  
  //查看dict.ver是否存在
  var cnt = collection.count(
    {
      _id: _id,
      "dict.ver": d.ver
    }
  );
  
  if(cnt > 0){
    return "字典明细版本已存在";
  }
  
  collection.updateOne(
    {_id: _id},
    {
      $push:{"dict":d}
      
    }
  );
}

//字典明细版本修改
function item_ver_edit(data){
  
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  // sys.printValue(data);
  
  collection.updateOne(
    {_id: _id},
    {
      $set: {
        "dict.$[dic].status": data.status,
        "dict.$[dic].mark": data.mark,
        "dict.$[dic].standard": data.standard,
        "dict.$[dic].updatedt": new Date(),
      }
      
    },
    {arrayFilters:[{"dic.ver":data.ver}]}
  );
}

//字典明细版本删除
function item_ver_delete(data){
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  collection.updateOne(
    {_id: _id},
    {
      $pull: {
        "dict":{ver: data.ver}
      }
      
    }
  );
}