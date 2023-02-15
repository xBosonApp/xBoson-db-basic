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
// saveuguserrole 保存用户组或用户角色
var ugid=sys.requestJson.ugid;
var userid=sys.requestJson.userid;
var roles=sys.requestJson.roles;
var params = [];
var dt = date.currentTimeString();

var sqlDevRgRole="select roleid from sys_role where role_type";

if (ugid!=null) {
  if (roles != null) {
    for (row in roles) {
      list.add(params, [ugid,row,"1",dt,dt]);
    }
  }
  
  sql.update("delete from sys_role_ug where ugid=?", [ugid], "1");
  
  if (sys.size(params) > 0) {
    sql.updateBatch("insert into sys_role_ug (ugid,roleid,status,createdt,updatedt) values (?,?,?,?,?)", params, "1");
  }
  
  sql.commit();
  se.reloadUserGroupRole([ugid]);
  sys.setRetData("0");
} 
else if (userid!=null) {
  var pid=sys.getUserPID(userid);
  // var pidMap=sys.getUserPID([userid]);
  // if (pidMap!=null){
  //   pid=pidMap[userid];
  // }

  if (roles != null) {
    for (row in roles) {
      list.add(params, [pid,row,"1",dt,dt]);
    }
  }

  sql.update("delete from sys_user_role where pid=? and (roleid in (select roleid from sys_role where role_type='01' or op_type='1') or roleid not in (select roleid from sys_role))", [pid], "1");
  if (sys.size(params) > 0) {
    sql.updateBatch("insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)", params, "1");
  }
  
  sql.commit();
  // 更新缓存
  se.reloadUserRole([userid]);
  sys.setRetData("0");
} else {
  sys.setRetData("1","用户组或用户均未指定");
}