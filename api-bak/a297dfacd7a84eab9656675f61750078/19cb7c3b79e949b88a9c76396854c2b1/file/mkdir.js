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

if (parentid != '/') {
  if (coll.count({_id:parentid, type:'file', isDir:true}) < 1) {
    sys.setRetData(1, '父目录不存在');
    return;
  }
}

var r = coll.insert({
  _id    : lib.uuid(),
  name   : name,
  parent : parentid,
  type   : 'file',
  isDir  : true,
  ctime  : new Date(),
  cuser  : sys.getUserIdByPID(),
  mtime  : null,
  muser  : null,
});

sys.setRetData(0, '目录已创建');