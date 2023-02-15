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
var _id       = sys.request.getString('_id', 1, 99);
var name      = sys.request.getString('name', 1, 99);
var headid    = sys.request.headid;
var loginid   = sys.request.loginid;
var rootcid   = sys.request.rootcid;

var lib = require("../prjmgr/lib");
var coll = lib.openprj(sys, prjid);

if (coll.count({ name:name, type:'app', _id: {$not: {$eq:_id}}}) > 0) {
  return sys.setRetData(1, '应用名称重复: '+ name);
}

var upr = coll.updateOne({
  _id    : _id,
  type   : 'app',
}, {
  $set: { 
    name    : name,
    mtime   : new Date(),
    muser   : sys.getUserIdByPID(),
    headid  : headid,
    loginid : loginid,
    rootcid : rootcid,
  }
});

lib.returnMgUpinfo(sys, upr);