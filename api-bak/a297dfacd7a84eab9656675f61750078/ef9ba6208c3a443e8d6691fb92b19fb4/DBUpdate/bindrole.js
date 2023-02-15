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

var pid = sys.request.getString('pid', 1);


var a = 'SELECT roleid FROM sys_role';
var b = ["INSERT INTO sys_user_role (pid, roleid, status, createdt, updatedt) values ('", pid, "', '", 0, "', '1', now(), now());"];

var out = [];

sql.query(a, [], 'a');
sys.result.a.forEach(function(r) {
  b[3] = r.roleid;
  out.push(b.join(''));
});


sys.put('out', out);
sys.setRetData(0, 'ok');