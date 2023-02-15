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

var lib = require('./lib');
var db = lib.opendb();
var roles = [];

sql.query("select r.roleid from sys_role r,sys_user_role ur where ur.pid=? and ur.roleid=r.roleid and (r.role_type='01'or op_type='1') and ur.status='1' and r.status='1'",[sys.getUserPID()], 'roles');

sys.result.roles.forEach(function(r) {
  roles.push(r.roleid);
});

var ret = db.collection('_prj').find({
  $or : [
    { owner : sys.getUserIdByPID() },
    { roles : { $in: roles } }
  ],
});

sys.put('data', ret);
sys.setRetData(0, 'ok');