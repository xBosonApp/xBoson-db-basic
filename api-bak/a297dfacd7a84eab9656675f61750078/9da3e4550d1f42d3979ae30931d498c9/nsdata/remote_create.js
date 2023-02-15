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
  sys.request.getInteger('authoritytype', false, 0, 10),
  sys.request.getString('username', 0, 50),
  sys.request.getString('userpwd',  0, 50),
  sys.request.getString('license',  0, 1500),
  sys.request.getString('rname',    1, 45),
  ];

var s = `
Insert Into ns_ex_remote (
   rtid, authoritytype, username, userpwd, license,
   createdt, updatedt, rname
) Values (
   ?, ?, ?, ?, ?, 
   now(), now(), ?
)`;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "没有数据被插入");
  return;
}
sys.setRetData(0, '已经创建');