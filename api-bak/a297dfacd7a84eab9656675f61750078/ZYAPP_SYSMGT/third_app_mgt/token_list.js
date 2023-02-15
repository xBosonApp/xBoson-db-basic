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

var tp_appid = sys.request.getString('tp_appid', 1, 40);
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;

var sqls = `
  SELECT client_id,
      userid,
      birth_time,
      expires_in,
      enable,
      token
  FROM sys_pl_app_token
  WHERE client_id = ? `;
  
var parm = [tp_appid];
if (sys.getUserAdminFlag() != 1 && sys.getUserAdminFlag() != 3) {
  sqls += 'AND userid = ?';
  parm.push(sys.getUserIdByOpenId());
}
  
sql.queryPaging(sqls, parm, pagenum, pagesize);

sys.setRetData(0, 'ok', 'result');