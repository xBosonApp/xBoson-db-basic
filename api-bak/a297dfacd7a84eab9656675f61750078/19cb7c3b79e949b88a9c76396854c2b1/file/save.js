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
var prjid = sys.request.getString('prjid', 1, 99);
var _id   = sys.request.getString('_id', 1, 99);
var cnt   = sys.request.getString('content', 1, 20*1024*1024);

var lib = require("../prjmgr/lib");
var coll = lib.openprj(sys, prjid);
var prj = lib.getprj(prjid);

var file = coll.find({_id:_id, type:'file', isDir:false}, {content:0})[0];
if (!file) {
  return sys.setRetData(1, '文件不存在');
}

var struct = JSON.parse(cnt);
var render = require("./render");
var filecontent = render.render(file, struct);

var filepath = lib.getfilepath(prj, file.filename);
var uifs = require('fs').open();
uifs.writeFile(filepath, filecontent);
se.sendUIFileReload(filepath, 'change');
file.content = cnt;

var r = coll.updateOne({
  _id  : _id,
  type : 'file',
  isDir: false,
}, {
  $set: {
    content : lib.encrypt(prj, file),
    mtime   : new Date(),
    muser   : sys.getUserIdByPID(),
  }
});

if (r.getModifiedCount()) {
  sys.setRetData(0, '文件已经保存');
} else {
  sys.setRetData(1, '文件保存失败');
}