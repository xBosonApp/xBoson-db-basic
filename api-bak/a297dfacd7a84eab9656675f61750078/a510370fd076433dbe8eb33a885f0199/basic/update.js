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

var id   = sys.request.getString('_id', 1, 45);
var desc = sys.request.desc || '无';
var access   = parseInt(sys.request.ispublic) || 0;

var lib = require("./lib");
var doc = lib.opendoc();

if (!lib.checkAuth(sys, id)) 
  return;


try {
  var ret = doc.updateOne({
    _id : id
  }, {
    $set: { 
      desc        : desc,
      updateTime  : Date.now(),
      access      : access,
    }
  });
  
  if (ret.getModifiedCount()) {
    sys.setRetData(0, 'ok');
  } else {
    sys.setRetData(1, '文件不存在');
  }
} catch(e) {
  sys.setRetData(1, '失败,'+ e.message);
}