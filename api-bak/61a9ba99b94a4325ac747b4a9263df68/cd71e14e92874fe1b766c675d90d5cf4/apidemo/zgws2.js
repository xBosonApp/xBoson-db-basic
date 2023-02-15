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

var httpMethod = http.method();
//POST参数
var reqjson = sys.requestJson;

//GET参数
var requestParam = JSON.parse(JSON.stringify(sys.request)).parm;
for(var key in requestParam){
  requestParam[key] = requestParam[key][0]
}
// API说明
var apiDesc = `接口说明：
    智光API代理 
智光API为GET调用时，此代理API则为GET调用;
智光API为POST调用时，此代理API则为POST调用;
authorization 请求头（即Token）后台已自动添加

参数说明：
    
   zgApiName
   
   智光API名称(pathname)，url中v1之后的部分，如statistic/energy
 http://120.194.140.172:8088/api/v1/statistic/energy
 
   然后是智光API业务参数`;


//智光api pathname
var zgApiName = sys.request.zgApiName;
// zgApiName = zgApiName || "statistic/energy";

if(!zgApiName){
  sys.put("API说明",apiDesc);
  sys.setRetData(0);
  return;
}

//if(reqjson==null)
 // return sys.setRetData(1);
  
var token = lib.toKen(cache,http);
//POST  
var url = lib.zgUri() + zgApiName;
// var parm = {
// "time": "month",
// "type": "day",
// "aids":["D6xrrYiEvrjVo49QLDNe68aD"]
// };

var ret = null;
http.setTimeout(0);
if(httpMethod == "POST"){
  
  var h = {"authorization":"Bearer "+token,"Content-Type":"application/json;charset=UTF-8"};  
  ret = http.post(url,reqjson,null,"json",h);
  
}else{
  
  var h = {"authorization":"Bearer "+token};
  ret = http.get(url,requestParam,"json",h);
  
}

sys.put('result', ret.data);
// sys.put('requestParam', requestParam);
// sys.put('result', null);
sys.setRetData(0);