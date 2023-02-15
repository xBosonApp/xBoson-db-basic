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
var prjid   = sys.request.getString('prjid', 1, 99);
var name    = sys.request.getString('name', 1, 99);
var mode    = sys.request.getString('mode', 1, 11);
var headid  = sys.request.headid;
var loginid = sys.request.loginid;
var rootcid = sys.request.rootcid;

var devlib = require("./devlib");
if (! devlib.modeMap[mode]) {
  return sys.setRetData(1, '无效的菜单模式: '+ mode);
}

var lib = require("../prjmgr/lib");
var err = lib.checkFileName(name);
if (err) {
  return sys.setRetData(1, err);
}

var _id = lib.uuid();
var coll = lib.openprj(sys, prjid);
var prj = lib.getprj(prjid);
var pname = sys.fullPinyinLetter(name).replaceAll(' ', '_');
var path = '/t'+ prj.basedir +'/'+ pname;

if (coll.count({ name:name, type : 'app'}) > 0) {
  return sys.setRetData(1, '应用名称重复: '+ name);
}

var uifs = require('fs').open();
if (uifs.readAttribute(path) != null) {
  return sys.setRetData(1, "物理目录已存在: "+ pname +", 请换一个名字: "+ name);
}
uifs.makeDir(path);

uifs.writeFile(path +'/index.htm' , devlib.genIndexFile());
uifs.writeFile(path +'/app.vue'   , devlib.genAppFileEmpty());
uifs.writeFile(path +"/store.js"  , devlib.genStore());
uifs.writeFile(path +"/app-style.css", devlib.genStyle());


var app = {
  _id       : _id,
  type      : 'app',
  name      : name,
  path      : path,
  mode      : mode,
  ctime     : new Date(),
  cuser     : sys.getUserIdByPID(),
  mtime     : null,
  muser     : null,
  menu      : [],
  nomenu    : {},
  headid    : headid,
  loginid   : loginid,
  rootcid   : rootcid,
};

coll.insert(app);

sys.put('path', path);
sys.put("_id", _id);
sys.setRetData(0, '应用创建成功');