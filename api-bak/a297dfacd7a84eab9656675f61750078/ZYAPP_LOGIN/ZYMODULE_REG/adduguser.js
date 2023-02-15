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
// 添加用户到指定的用户组
var pid = sys.request.pid;	// 用户PID
var ugnm = sys.request.ugnm;	// 用户组名称

if (pid==null) {
  sys.setRetData("1", "用户未指定");
  return;
}
if (ugnm==null) {
  sys.setRetData("1", "用户组指定");
  return;
}

sql.query("select ugid from sys_ug where ugnm=?", [ugnm], "existug");
var existug = sys.result.existug;
if (sys.size(existug) == 0) {
  sys.setRetData("2", "用户组 " + ugnm + " 不存在");
  return;
}
var ugid = existug[0].ugid;
sql.query("select 1 from sys_ug_user where ugid=? and pid=?", [ugid, pid], "existuguser");
if (sys.size(sys.result.existuguser) == 0) {
  var dt = date.currentTimeString();
  sql.update("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)", [ugid, pid, "1", dt, dt]);
}
sys.setRetData("0");