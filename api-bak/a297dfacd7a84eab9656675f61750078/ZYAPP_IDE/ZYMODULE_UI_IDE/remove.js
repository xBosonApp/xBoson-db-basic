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

var uilib = require("./lib");
var org   = sys.request.getSafePath('org');
var path  = sys.request.getSafePath('path');
var parm_path = path;

if (path.indexOf('/', 1) < 0 && uilib.isSpecial(path)) {
  sys.setRetData(1, '该目录为虚拟目录, 禁止删除');
  return;
}

org = uilib.currentUserOrg(sys, org).id;
path = uilib.getBasePath(se, org, path);


var uifs = require('fs').open();
try {
  uifs.delete(path);
  se.sendUIFileReload(path, 'removefile');
} catch(e) {
  sys.setRetData(1, e.message);
  return;
}

sys.setRetData(0, "文件被删除: " + parm_path);