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
  sys.request.getInteger('authoritytype', false, 0, 10),
  sys.request.getString('username', 0, 50),
  sys.request.getString('userpwd',  0, 50),
  sys.request.getString('license',  0, 1500),
  sys.request.status || 1,
  
  sys.request.getString('rname', 1, 50),
  sys.request.getString('rtid', 1, 32),
  ];
  
var s = `
  UPDATE ns_ex_remote
  SET
    authoritytype = ?, 
    username = ?, 
    userpwd = ?, 
    license = ?,
    updatedt = now(),
    status = ?,
    rname = ?
  WHERE rtid = ? `;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "修改失败");
  return;
}
sys.setRetData(0, '修改成功');