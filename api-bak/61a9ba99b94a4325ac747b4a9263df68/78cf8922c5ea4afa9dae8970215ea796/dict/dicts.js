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

// add：分类添加
// edit：分类修改
// delete：分类删除
var op_type = sys.request.getString("op_type");

var data = {
  cd: sys.request.getString("cd"),
  parentcd: sys.request.getString("parentcd"),
  nm: sys.request.nm,
  shortkey: sys.pinyinFirstLetter(sys.request.nm),
  ver: sys.request.ver,
  status: sys.request.status,
  mark: sys.request.mark,
  url: sys.request.url,
  
  standard: sys.request.standard
}


if(op_type == "add"){
  
  type_add(data);
  
}else if(op_type == "edit"){
  
  type_edit(data);
  
}else if(op_type == "delete"){
  var r = findChildren(data);
  
  if(r){
    sys.setRetData(2, "请先删除子分类");
    return;
  }
  
  type_delete(data);
  
}

else{
  sys.setRetData(1, "op_type参数错误");
  return;
}



sys.setRetData(0, 'ok');



//字典分类添加
function type_add(data){
  if(!data.cd)
    return "缺少KEY[cd]";
  if(!data.parentcd)
    return "缺少KEY[parentcd]";
    
  var d = {
    _id: {
      cd: data.cd,
      parentcd: data.parentcd
    },
    nm: data.nm,
    shortkey: data.shortkey,
    ver: data.ver,
    status: data.status,
    mark: data.mark,
    url: data.url,
    createdt: new Date(),
    updatedt: new Date(),
    dict: []
  }
  
  collection.insertOne(d);
  
}

//字典分类修改
function type_edit(data){
  if(!data.cd)
    return "缺少KEY[cd]";
  if(!data.parentcd)
    return "缺少KEY[parentcd]";
    
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  var d = {
    
    nm: data.nm,
    shortkey: data.shortkey,
    ver: data.ver,
    status: data.status,
    mark: data.mark,
    url: data.url,
    updatedt: new Date()
  }
  
  var updateResult = collection.updateOne(
    {_id: _id},
    {$set : d}
  );
  // //符合查询条件的文档数目
  // var n1 = updateResult.getMatchedCount();
}

//字典分类删除
function type_delete(data){
  if(!data.cd)
    return "缺少KEY[cd]";
  if(!data.parentcd)
    return "缺少KEY[parentcd]";
  
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  collection.deleteOne({_id:_id});
  
}

//查询是否有子分类
function findChildren(data){
  //查询是否有子分类
  var r = collection.find(
    {
      "_id.parentcd": data.cd
    },
    {
      _id: 1
    }
  );
  
  if(r && r.length>0){
    return true; 
  }
}