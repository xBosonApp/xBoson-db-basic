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

// 参数
var param = {
  cd: sys.request.getString("cd"),  //分类编码
  parentcd: sys.request.getString("parentcd"),  //父分类编码
  ver: sys.request.getString("ver"),  //字典明细版本
}

// 上传的文件内容为JSON字符串 [ {cd:'',name:'',mark:'', ...} ]

var dataArr = JSON.parse(sys.request.getString("dataArr"));

// sys.request.multipart(function(item){
//   sys.printValue(item.header);
//   // 文件名称, 如果是文件才有这个参数
//   if(item.header.filename){
//     // file_name = item.header.filename;
//     // 获取文件内容
//     var content = item.readString();
    
//     dataArr = JSON.parse(content);
    
    
//   }
  
// });

// 数据必要字段检查
var checkR = dataCheck(dataArr);
if(checkR){
  // sys.put("");
  sys.setRetData(2,checkR);
  return;
}

// push字典数据
pushDictData(param,dataArr);

sys.setRetData(0);

// 数据检查
function dataCheck(dataArr){
  // 需包含cd字段
  for(var i in dataArr){
    var obj = dataArr[i];
    if(!obj.cd) 
      return obj;   
  }
}

// push字典数据
function pushDictData(param,dataArr){
  
  var _id = {
    cd: param.cd,
    parentcd: param.parentcd
  };
  
  collection.updateOne(
    {_id:_id},
    {$push:{"dict.$[dict].data": {"$each": dataArr} }},
    {
      arrayFilters:[
        {"dict.ver": param.ver}
      ]
    }
  );
  
}