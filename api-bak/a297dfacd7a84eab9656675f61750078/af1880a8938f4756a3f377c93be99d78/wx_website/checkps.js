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

var md5ps = sys.request.getString('ps', 1, 99);
var orgid = sys.request.getString('curr_on_org', 1, 99);
var uid = sys.getUserIdByPID();

sql.query('Select password, password_dt From sys_userinfo Where pid=?', 
    [sys.getUserPID()], 'u');
    
var dt = sys.result.u[0].password_dt;
var gootps = sys.result.u[0].password;

if (gootps == sys.encodePlatformPassword(uid, dt, md5ps)) {
  var lib = require("./lib");
  var state = lib.encrypt( JSON.stringify({ uid:uid, ps:md5ps, org:orgid }) );
  var url = lib.bindQrUrl(state);
  sys.put("url", url);
  sys.setRetData(0, '密码正确');
} else {
  sys.setRetData(1, '密码错误');
}