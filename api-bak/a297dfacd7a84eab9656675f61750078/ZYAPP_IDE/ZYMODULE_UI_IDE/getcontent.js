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
var uifs  = require('fs').open();
var path  = sys.request.getSafePath('path');
var org   = sys.request.getSafePath('org');

org = uilib.currentUserOrg(sys, org).id;
var basepath = uilib.getBasePath(se, org, path);

var attr = uifs.readAttribute(basepath);
if (!attr) {
  return sys.setRetData(1, "找不到文件:" + path);
}
if (!attr.isFile()) {
  return sys.setRetData(1, "不是可读文件:" + path);
}
uifs.readFileContent(attr);

var ret = {
  content     : attr.getContentToString(),
  filetype    : uilib.getFileType(path),
  lastmodify  : attr.lastModify,
};
sys.addRetData(ret, "result");


sys.setRetData(0, "ok.", "result");