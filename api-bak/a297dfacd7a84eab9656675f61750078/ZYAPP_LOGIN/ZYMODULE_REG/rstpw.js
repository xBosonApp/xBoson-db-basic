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

var userid = sys.request.getString("userid", 6, 40);

var dict        = '1234567890qwertyuioplkjhgfdsazxcvbnm';
var newpassword = randomPW(10);
var dt          = date.currentTimeString();
var newpasswd   = se.encodePlatformPassword(userid, dt, newpassword);//加密

if (sys.getUserAdminFlag(userid, _ORGID_PLATFORM_) == '1') {
  if (sys.getUserAdminFlag() != '1') {
    sys.setRetData("1", "普通用户禁止修改超级管理员密码");
    return;
  }
}

var line = sql.update(
  `update sys_userinfo 
      set password=?, password_dt=?
    where sys_userinfo.userid=? `,
  [newpasswd, dt, userid]);

if (line == 1) {
  sys.addRetData(userid, "userid");
  sys.addRetData(newpassword, "passwd");
  sys.setRetData("0", "修改密码成功", "passwd", "userid");
} else {
  sys.setRetData("1", "失败");
}


function randomPW(len) {
  var buf = [];
  var dl = dict.length;
  
  for (var i=0; i<len; ++i) {
    var r = parseInt(Math.random() * dl);
    buf.push(dict[r]);
  }
  return buf.join('');
}