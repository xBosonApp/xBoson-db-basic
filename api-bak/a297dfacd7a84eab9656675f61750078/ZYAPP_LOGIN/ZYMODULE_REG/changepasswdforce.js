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
// 用户管理员修改用户密码
var pid = sys.request.pid;
var userid = sys.request.userid;
var newpassword = sys.request.newpassword;

// pid或userid至少指定一个，pid优先
if (pid == null && userid == null) {
  sys.setRetData("1", "用户未指定");
  return;
}
if (newpassword == null) {
  sys.setRetData("1", "密码未指定");
  return;
}

var dt = date.currentTimeString();
var newpasswd = sys.encodePlatformPassword(userid,dt,sys.toLowerCase(newpassword));//加密
// pid或userid至少指定一个，pid优先
if (pid == null) {
  sql.update("update sys_userinfo set password=?,password_dt=? where userid=?",[newpasswd,dt,userid]);
} else {
  sql.update("update sys_userinfo set password=?,password_dt=? where pid=?",[newpasswd,dt,pid]);
}
sys.setRetData("0", "修改密码成功");