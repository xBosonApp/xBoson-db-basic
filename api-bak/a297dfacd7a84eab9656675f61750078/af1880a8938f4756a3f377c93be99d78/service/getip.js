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

var ip = sys.request.ip || http.remoteIp();
sys.put("ip", ip);
if (ip.indexOf(':') >=0 ) {
  return sys.setRetData(1, '不能解析 ipv6 地址');
}

var t = ip.split('.');
if (t.length != 4) {
  return sys.setRetData(1, 'ip 格式错误');
}

var arg = [];
for (var i=0; i<4; ++i) {
  var n = parseInt(t[i]);
  if (isNaN(n)) return sys.setRetData(1, 'ip 格式错误');
  arg[(i<<1)]   = n;
  arg[(i<<1)+1] = n;
}

var sql = `
Select province, city 
  From sys_ip_adscription
 Where a1 <= ? and b1 >= ?
   and a2 <= ? and b2 >= ?
   and a3 <= ? and b3 >= ?
   and a4 <= ? and b4 >= ? `;
   
sql.query(sql, arg, 'ip');
if (sys.result.ip[0]) {
  sys.put("data", sys.result.ip[0]);
  sys.setRetData(0, 'ok');
} else {
  sys.setRetData(11, '未找到');
}