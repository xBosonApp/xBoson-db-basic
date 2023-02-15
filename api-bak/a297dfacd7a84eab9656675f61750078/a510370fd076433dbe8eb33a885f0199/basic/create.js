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

var filename = sys.request.getString('filename', 1, 45);
var desc     = sys.request.desc || '无';
var access   = parseInt(sys.request.publicdoc) || 0;

var lib = require("./lib");
var doc = lib.opendoc();
var uid = sys.getUserIdByPID();

try {
  var ret = doc.insertOne({
    _id         : uid +'/'+ filename,
    xml         : lib.encrypt(''),
    uid         : uid,
    desc        : desc,
    createTime  : Date.now(),
    updateTime  : Date.now(),
    access      : access,
  });
  
  sys.addRetData('data', ret);
  sys.setRetData(0, 'ok', 'data');
} catch(e) {
  if (e.code == 11000) {
    sys.setRetData(1, '失败, 文件已经存在, 请重新命名.');
  } else {
    sys.setRetData(1, '失败,'+ e.message);
  }
}