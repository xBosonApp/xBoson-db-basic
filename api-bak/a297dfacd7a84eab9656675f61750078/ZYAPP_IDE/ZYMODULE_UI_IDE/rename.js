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
// path 是完整路径, new_name 是新文件名, 将路径拆分成父目录和文件名
// 再重新组合成原完成路径和目标完整路径.
//
var uilib     = require("./lib");
var org       = sys.request.getSafePath('org');
var path      = sys.request.getSafePath('path');
var new_name  = sys.request.getSafePath('filenm');

if (path.indexOf('/', 1) < 0 && uilib.isSpecial(path)) {
  sys.setRetData(1, '该目录为虚拟目录, 禁止重命名');
  return;
}

org = uilib.currentUserOrg(sys, org).id;
var i = path.lastIndexOf('/');
var old_name = path.substring(i);
path = path.substring(0, i);

path = uilib.getBasePath(se, org, path);
var new_path = path +'/'+ new_name;
var old_path = path +'/'+ old_name;

var uifs = require('fs').open();
uifs.move(old_path, new_path);
se.sendUIFileReload(old_path, 'removefile');
se.sendUIFileReload(new_path, 'addfile');

sys.setRetData(0, "文件从: '" + old_name + "' 移动到: '" + new_name + "'");