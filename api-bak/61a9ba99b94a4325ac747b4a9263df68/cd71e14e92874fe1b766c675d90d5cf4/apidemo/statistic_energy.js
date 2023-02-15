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

// POST参数
var reqjson = sys.requestJson;


var param = {
  "endTime": reqjson.endTime,
  "startTime": reqjson.startTime,
  "time": reqjson.time,
  "type": reqjson.type,
  "aids": reqjson.aids
};


  
var token = lib.toKen(cache,http);
//POST  
var url = lib.zgUri() + "statistic/energy";
// var parm = {
// "time": "month",
// "type": "day",
// "aids":["D6xrrYiEvrjVo49QLDNe68aD"]
// };

http.setTimeout(0);
  
var h = {"authorization":"Bearer "+token,"Content-Type":"application/json;charset=UTF-8"};  
var ret = http.post(url,param,null,"json",h);
  

sys.put('result', ret.data);
sys.put('requestParam', param);
// sys.put('result', null);
sys.setRetData(0);