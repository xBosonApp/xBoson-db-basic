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
  sys.request.getString('standardcode', 1, 45),
  sys.request.getString('standardname', 1, 45),
  
  sys.request.getString('setcode',      1, 45),
  sys.request.getString('setcodenode',  1, 45),
  
  sys.request.getString('table_name',   0, 45),
  sys.request.getString('typecd',       1, 100),
  ];

var s = `
Insert Into ns_ex_cri (
   criid, standardcode, standardname, setcode, setcodenode,
   table_name, typecd, createdt, updatedt
) Values (
   ?, ?, ?, ?, ?,
   ?, ?, now(), now()
)`;

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "没有数据被插入");
  return;
}
sys.setRetData(0, '已经创建');