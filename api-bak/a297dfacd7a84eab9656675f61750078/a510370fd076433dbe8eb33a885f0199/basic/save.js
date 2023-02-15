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

var id = sys.request.getString('id', 1, 45);

var lib = require("./lib");
var doc = lib.opendoc();

if (!lib.checkAuth(sys, id)) 
  return;

var xml = sys.request.xml; 
// xml = decodeURIComponent(xml);
xml = lib.encrypt(xml);

try {
  var ret = doc.updateOne({
    _id : id
  }, {
    $set: { 
      xml : xml,
      updateTime : Date.now(),
    }
  });
  
  if (ret.getModifiedCount()) {
    sys.setRetData(0, '文件保存成功\n\n时间: '+ new Date() +'\n\n文件大小: '+ xml.length + ' bytes');
  } else {
    sys.setRetData(1, '文件不存在');
  }
} catch(e) {
  sys.setRetData(1, '失败,'+ e.message);
}