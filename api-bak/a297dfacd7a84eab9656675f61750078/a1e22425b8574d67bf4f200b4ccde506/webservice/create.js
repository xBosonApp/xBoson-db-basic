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

var bind = [
  sys.uuid(),
  sys.request.getString('wsname', 1, 45),
  sys.request.getString('wsnote', 0, 500),
  sys.request.getString('ws_mod_name', 1, 45),
  
  sys.request.getString('ws_func_name', 1, 45),
  sys.request.getString('ws_uri', 1, 200),
  sys.request.getString('ws_config_json', 1, 5000),
  ];
  
var json = JSON.parse(bind[6]);
delete json.doc;
json.wsname = bind[1];
json.name = bind[4];
json.curl = bind[5];
bind[6] = JSON.stringify(json);

var s = `
Insert Into sys_webservice (
   wsid, wsname, wsnote, ws_mod_name, ws_func_name, ws_uri, ws_config_json,
   createdt, updatedt
) Values (
-- 1     2       3       4            5             6       7
   ?,    ?,      ?,      ?,           ?,            ?,      ?,
   now(), now()
)`;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "没有数据被插入");
  return;
}
sys.setRetData(0, '接口已经创建');