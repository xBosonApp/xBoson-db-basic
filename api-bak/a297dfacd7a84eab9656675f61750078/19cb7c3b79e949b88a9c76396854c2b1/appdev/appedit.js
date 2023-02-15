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
var menustr   = sys.request.menu || '[]';
var nomenustr = sys.request.nomenu || '[]';

var menu = JSON.parse(menustr);
var nomenu = JSON.parse(nomenustr);

var lib = require("../prjmgr/lib");
var coll = lib.openprj(sys, prjid);
var app = coll.find({ type : 'app', _id : _id })[0];

var opt = {
  // [ {id, isContainer:false} | { title:'', child:[], isContainer: true, isShow: true, roles: [], icon: String } ... ]
  menu    : menu,
  // { id: { title: String标题, fid: 文件id, path: 虚拟路径, roles: [], icon: String } ... }
  nomenu  : nomenu,
  mode    : app.mode,
  roles   : getUserRoles(),
  appname : app.name,
  headid  : app.headid,
  loginid : app.loginid,
  rootcid : app.rootcid,
};

var devlib = require("./devlib");
var uifs = require('fs').open();
var app_path = app.path +'/app.vue';
uifs.writeFile(app_path, devlib.genAppFile(opt));
se.sendUIFileReload(app_path, 'change');

var upr = coll.updateOne({
  _id    : _id,
  type   : 'app',
}, {
  $set: { 
    mtime : new Date(),
    // muser : sys.getUserIdByPID(),
    menu  : menu,
    nomenu: nomenu,
  }
});

lib.returnMgUpinfo(sys, upr);


function getUserRoles() {
  var map = {};
  sql.query("select r.roleid id, r.rolenm name from sys_role r,sys_user_role ur where ur.pid=? and ur.roleid=r.roleid and (r.role_type='01'or op_type='1') and ur.status='1' and r.status='1'",[sys.getUserPID()], 'roles');
  
  var r = sys.result.roles;
  for (var i=0; i<r.length; ++i) {
    map[r[i].id] = r[i].name;
  }
  return map;
}