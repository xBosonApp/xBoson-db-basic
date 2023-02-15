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

//系统日志
var sqls = {
  system       : "delete from sys_pl_log_system",
  system_error : 'delete from sys_pl_log_system_error',
  access       : 'delete from sys_pl_log_access',
  unauth       : 'delete from sys_pl_log_unauth',
  request      : 'delete from sys_pl_log_request',
  schedule     : 'delete from sys_pl_log_scheduler',
  ui_mod       : 'delete from sys_pl_log_uimodify',
};

var r = {};
for (var n in sqls) {
  r[n] = sql.update(sqls[n],[]);
}

sys.addRetData('delete_count', r);
sys.setRetData("0", "ok", "delete_count");