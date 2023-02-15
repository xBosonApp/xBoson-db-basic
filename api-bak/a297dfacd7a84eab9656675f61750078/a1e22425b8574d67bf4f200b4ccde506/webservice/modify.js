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
  sys.request.getString('wsname', 1, 45),
  sys.request.getString('wsnote', 0, 500),
  sys.request.getString('ws_mod_name', 1, 45),
  
  sys.request.getString('ws_func_name', 1, 45),
  sys.request.getString('ws_uri', 1, 200),
  sys.request.getString('ws_config_json', 1, 5000),
  
  sys.request.getInteger('status', true, 0, 1) || 1,
  sys.request.getString('wsid', 1, 32),
  ];
  
var json = JSON.parse(bind[5]);
delete json.doc;
json.wsname = bind[0];
json.name = bind[3];
json.curl = bind[4];
bind[5] = JSON.stringify(json);
  
var s = `
  UPDATE sys_webservice
  SET
    wsname = ?,
    wsnote = ?,
    ws_mod_name = ?,
    ws_func_name = ?,
    ws_uri = ?,
    ws_config_json = ?,
    updatedt = now(),
    status = ?
  WHERE wsid = ? `;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "修改失败");
  return;
}
sys.setRetData(0, '修改成功');