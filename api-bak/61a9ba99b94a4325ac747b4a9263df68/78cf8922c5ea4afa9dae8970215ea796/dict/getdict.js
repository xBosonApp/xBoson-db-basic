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

// 获取数据字典 
// 参数 cds 类别编码 多个cd以逗号分隔
//     vers 版本 多个ver以逗号分隔 版本为空时取执行版本
//     cds和vers一一对应
// 返回格式 {"cd1": {ver:"", updatedt:"", data: [{id:"",name:""}] }, "cd2": {} }

var cds = sys.request.getString("cds");  //类别编码 多个cd以逗号分隔

var vers = sys.request.vers||"";  //版本 多个ver以逗号分隔 版本为空时取执行版本

var cdArr = cds.split(",");
var verArr = vers.split(","); 

var result = {};

cdArr.forEach(function(v,i){
  result[v] = getDict(v,verArr[i]);  
});

sys.put("result",result);

sys.setRetData(0);


function getDict(cd, ver){
  
  var result;
  
  if(!ver){
    
    // var cursor = collection.find2(
    //   {"_id.cd":cd}
    // )
    
    // return cursor.map(function (doc){
    //   var data = [];
    //   if(doc.dict && doc.dict.length>0){
    //     for(var i in doc.dict){
    //       if(doc.dict[i].ver == doc.ver){
    //         data = doc.dict[i].data;
    //         break;
    //       }
    //     }
    //   }
    //   return data;
    // });
    
    // 版本为空时取执行版本
    // 查询执行版本
    var verR = collection.find(
      {"_id.cd":cd},
      {
        "ver":1
      }
    )
    
    if(verR.length == 0){
      return [];
    }
    
    ver = verR[0].ver;
  }
  
  result = collection.find(
    {"_id.cd":cd},
    {
      "dict.data": 1,
      "dict": {$elemMatch: {ver: ver}}
    }
  );
  
  // sys.printValue(result);
  
  // 检查结果
  if(!result || result.length==0 || !result[0].dict || 
    result[0].dict.length == 0 || !result[0].dict[0].data){
      
    return [];
  }
  // 数据格式转换
  var r = {
    ver: ver,
    updatedt: result[0].dict[0].updatedt,
    data:[]
    
  };
  result[0].dict[0].data.forEach(function(v){
    r.data.push({
      id: v.cd,
      name: v.nm
    });
  });
  
  return r;
  
}