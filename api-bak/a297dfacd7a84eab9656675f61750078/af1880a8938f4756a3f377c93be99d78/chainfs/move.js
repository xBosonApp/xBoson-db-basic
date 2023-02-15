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

var volid    = sys.request.getString('v', 1, 99);
var path     = sys.request.getSafePath('p');
var target   = sys.request.getSafePath('t');
var lib      = require("./lib");
var selfuser = sys.getUserIdByPID();

var v = lib.openVolumeWrite(selfuser, volid);
var attr = lib.getAttr(volid, path);
if (!attr) {
  sys.setRetData(1, '目录不存在: '+ path);  
  return;
}
if (!attr.isDir() || !attr.containFiles().isEmpty()) {
  sys.setRetData(1, '只能重命名空的目录');  
  return;
}

if (lib.getAttr(volid, target) != null) {
  sys.setRetData(1, '目标目录已存在: '+ target);  
  return;
}

lib.move(volid, path, target);
sys.setRetData(0, 'ok');