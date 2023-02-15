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

var token = sys.request.getString('token', 1, 99);
var act = sys.request.getString('act', 1, 10);
var sqls;
var parm = [token];

switch (act) {
  case 'delete':
    sqls = 'DELETE FROM sys_pl_app_token WHERE token = ?';
    break;
    
  case 'disable':
    sqls = 'UPDATE sys_pl_app_token SET enable = 0 WHERE token = ?';
    break;
    
  case 'enable':
    sqls = 'UPDATE sys_pl_app_token SET enable = 1 WHERE token = ?';
    break;
}


// +权限限制
if (sys.getUserAdminFlag() != 1 && sys.getUserAdminFlag() != 3) {
  sqls += ' AND userid = ?';
  parm.push(sys.getUserIdByOpenId());
}

if (sql.update(sqls, parm) == 1) {
  // 刷新缓存
  se.updateToken(token);
};
sys.setRetData(0, 'ok');