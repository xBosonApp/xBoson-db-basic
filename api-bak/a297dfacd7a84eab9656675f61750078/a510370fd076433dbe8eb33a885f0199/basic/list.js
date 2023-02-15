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
//
// 文件列表只显示当前用户的文件
// 使用 mongodb 开发
//
var filename = sys.request.filename;
var userid = sys.getUserIdByPID();
var lib = require("./lib");
var doc = lib.opendoc();

var where = { uid: userid };
if (filename) {
  where._id = new RegExp(".*"+filename+".*");
}

var data = doc.find(where, 
  { desc:1, createTime:1, updateTime:1, access:1 }, 
  sys.request.pagenum || 1,
  sys.request.pagesize || 20);
  
sys.put("count", doc.count(where));
sys.addRetData('data', data);
sys.setRetData(0, 'ok', 'data');