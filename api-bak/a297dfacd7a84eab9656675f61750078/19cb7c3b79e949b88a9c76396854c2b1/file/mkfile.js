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
var prjid     = sys.request.getString('prjid', 1, 99);
var parentid  = sys.request.getString('parentid', 1, 99);
var name      = sys.request.getString('name', 1, 99);

var lib = require("../prjmgr/lib");
var err = lib.checkFileName(name);
if (err) {
  return sys.setRetData(1, err);
}

var coll = lib.openprj(sys, prjid);
var prj = lib.getprj(prjid);

if (parentid == '/') {
  return sys.setRetData(1, '不能在根目录中创建文件');
}
if (coll.count({_id:parentid, type:'file', isDir:true}) < 1) {
  return sys.setRetData(1, '父目录不存在');
}

var id = lib.uuid();
var filename = id +'.vue';
var filepath = lib.getfilepath(prj, filename);
var uifs = require('fs').open();
var strlib = require("./_structdefine");
var struct = strlib.createStruct();

var file = {
  _id       : id,
  name      : name,
  parent    : parentid,
  type      : 'file',
  isDir     : false,
  ctime     : new Date(),
  cuser     : sys.getUserIdByPID(),
  mtime     : null,
  muser     : null,
  filename  : filename,
  content   : JSON.stringify(struct),
};

var render = require("./render");
uifs.writeFile(filepath, render.render(file, struct));
se.sendUIFileReload(filepath, 'change');

file.content = lib.encrypt(prj, file);
coll.insert(file);

sys.put("file_id", id);
sys.setRetData(0, '文件已创建');