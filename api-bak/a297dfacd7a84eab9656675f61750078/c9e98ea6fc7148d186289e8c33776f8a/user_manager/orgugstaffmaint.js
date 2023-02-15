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
var users = sys.requestJson.users;
var ugid = sys.requestJson.ugid;
var removeFlag = sys.requestJson.removeFlag;

var usersDel = [];
var usersAdd = [];
var dt = date.currentTimeString();
var pids = sys.getUserPID(users);
for (entry in pids) {
  var pid = entry.value;
  if (removeFlag) {
    list.add(usersDel, [pid]);
  }
  if (!sys.isEmpty(ugid)) {
    list.add(usersAdd, [ugid, pid, "1", dt, dt]);
  }
}

if (sys.size(usersDel) > 0) {
  sql.updateBatch("delete from sys_ug_user where pid=?", usersDel, "1");
}
if (sys.size(usersAdd) > 0) {
  sql.updateBatch("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)", usersAdd, "1");
}
sql.commit();
se.reloadUserRole(users);
sys.setRetData("0");