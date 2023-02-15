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


// find：查询（不包含数据），
// find_data:查询（包含数据）
var op_type = sys.request.getString("op_type"); 

var data = {
  cd: sys.request.getString("cd"),  //类别编码
  parentcd: sys.request.getString("parentcd"),  //父类别编码
  
  ver: sys.request.getString("ver"),  //明细版本
  
  download:  sys.request.download  //下载字典数据 [1,0]
  
}

if(op_type == "find"){
  var result = item_ver_find(data);
  sys.put("result",result);
}else if(op_type == "find_data"){
  var result = item_ver_find_data(data);
  
  if(data.download == "1"){
    // 下载字典数据文件
    var fileName = data.cd + "-" + data.ver + ".json";
    download(JSON.stringify(result),fileName);
    return;
  }else{
    sys.put("result",result);  
  }
  
  
}else{
  sys.setRetData(1, "op_type参数错误");
  return;
}

sys.setRetData(0, 'ok');

//字典明细版本查询
function item_ver_find(data){
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  var result = collection.find(
    {_id:_id},
    {
      "dict.ver":1,
      "dict.status": 1,
      "dict.mark":1,
      "dict.standard":1,
      "dict.createdt":1,
      "dict.updatedt":1,
      "dict": {$elemMatch: {ver: data.ver}}
    }
  )
  return result;
}

//字典明细数据查询
function item_ver_find_data(data){
  var _id = {
    cd: data.cd,
    parentcd: data.parentcd
  };
  
  var result = collection.find(
    {_id:_id},
    {
      "dict.ver":1,
      "dict.status": 1,
      "dict.mark":1,
      "dict.standard":1,
      "dict.createdt":1,
      "dict.updatedt":1,
      "dict.data":1,
      "dict": {$elemMatch: {ver: data.ver}}
    }
  );
  return result;
}

// 文本文件下载
function download(str, fileName){
  
  var outStream = sys.getResponseStream(fileName)
  outStream.write(str);
  outStream.flush();
  outStream.close();
}