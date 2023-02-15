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
  sys.request.getString('sql_str',      1, 5000),
  sys.request.getString('map_json',     1, 5000),
  
  sys.request.getString('criid',        1, 32),
  sys.request.getString('source_did',   1, 32),
  sys.request.getString('wsid',         1, 32),
  sys.request.getString('rtid',         1, 32),
  sys.request.getString('route',        0, 50),
  sys.request.getString('process',      0, 50),
  
  sys.request.getString('sourceorgan',  1, 50),
  sys.request.getString('sourcedomain', 1, 50),
  sys.request.getString('servicecode',  1, 50),
  sys.request.getString('targetorgan',  0, 50),
  sys.request.getString('targetdomain', 1, 50),
  sys.request.getString('map_name',     1, 45),
  sys.request.status || 1,
  
  sys.request.getString('mapid',        1, 32),
  ];
  
var s = `
  UPDATE ns_ex_mapper
  SET
    sql_str = ?, 
    map_json = ?, 
    criid = ?, 
    source_did = ?, 
    wsid = ?, 
    rtid = ?, 
    route = ?, 
    process = ?, 
    sourceorgan = ?, 
    sourcedomain = ?, 
    servicecode = ?, 
    targetorgan = ?, 
    targetdomain = ?,
    updatedt = now(),
    map_name = ?,
    status = ?
  WHERE mapid = ? `;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "修改失败");
  return;
}
sys.setRetData(0, '修改成功');