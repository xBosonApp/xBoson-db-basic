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

// add:字典明细添加
// edit：字典明细修改
// delete：字典明细删除
var op_type = sys.request.getString("op_type"); 

// 参数
var data = {
  cd: sys.request.getString("typecd"),  //分类编码
  parentcd: sys.request.getString("parentcd"),  //父分类编码
  ver: sys.request.getString("ver"),  //字典明细版本
}

// // POST JSON数据[cd,nm,mark...]
// var dict_data = sys.requestJson;  //postJSON数据

var dict_data = {
  cd: sys.request.getString("cd"),  //字典编码
  nm: sys.request.nm,  //中文名
  shortkey: sys.request.shortkey,  //
  mark: sys.request.mark,  //
}

// if(!dict_data){
//   sys.setRetData(1, "缺少参字典明细JSON");
//   return;
// }

// if(!dict_data.cd || !dict_data.nm){
//   sys.setRetData(1, "字典明细JSON中缺少参数[cd或nm]");
//   return;
// }

dict_data.shortkey = sys.pinyinFirstLetter(dict_data.nm);
  


if(op_type == "add"){
  
  item_add(data,dict_data);
  
}else if(op_type == "edit"){
  
  item_edit(data,dict_data);
  
}else if(op_type == "delete"){
  
  item_delete(data,dict_data);
  
}else{
  sys.setRetData(1, "op_type参数错误");
  return;
}

sys.setRetData(0, 'ok');

//字典项添加
function item_add(data,dict_data){
  
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  // sys.printValue(data);
  // sys.printValue(dict_data);
  
  var result = collection.updateOne(
    {_id:_id},
    {$push:{"dict.$[dict].data": dict_data}},
    {
      arrayFilters:[
        {"dict.ver": data.ver}
      ]
    }
  );
  // sys.printValue(result.getMatchedCount());
}

//字典项修改
function item_edit(data,dict_data){
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  collection.updateOne(
    {_id:_id},
    {$set:{"dict.$[dict].data.$[data]": dict_data}},
    {
      arrayFilters:[
        {"dict.ver": data.ver},
        {"data.cd": dict_data.cd}
      ]
    }
  );
}

//字典项删除
function item_delete(data,dict_data){
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  collection.updateOne(
    {_id:_id},
    {$pull:{"dict.$[dict].data": {cd:dict_data.cd} }},
    {
      arrayFilters:[
        {"dict.ver": data.ver}
      ]
    }
  );
}