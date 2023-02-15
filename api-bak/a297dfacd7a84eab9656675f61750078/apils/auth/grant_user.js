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
var userid=sys.request.userid;
var roleid=sys.request.roleid;
var orgid=sys.request.org;

if(userid==null){
  sys.setRetData("1", "用户ID为空");
  return;
}
if(roleid==null){
  sys.setRetData("1", "角色为空");
  return;
}

//获取pid
var pid="";
var sql0="select sys_userinfo.pid from sys_userinfo,sys_tenant_user where userid=? and sys_userinfo.pid= sys_tenant_user.pid and sys_tenant_user.orgid = ? and sys_userinfo.status='1' and sys_tenant_user.status='1'";
var param0=[userid, orgid];
sql.query(sql0,param0,"user_pid");
var user_pid=sys.result.user_pid;
for(r in user_pid){
    pid=r.pid;
}
if(pid==null||pid==""){
  sys.setRetData("2", "用户不存在");
  return;
}

var sqlInsert="insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var dt=sys.currentTimeString();
var roleList = sys.split(roleid, ",");
for (role in roleList) {
  var sql_role="select roleid from sys_user_role where pid=? and roleid=?";
  var param_role=[pid, role];
  if (sql.query(sql_role,param_role) == 0) {
    var paramInsert = [pid,role,"1",dt,dt];
    sql.update(sqlInsert,paramInsert,"1");
  }
}
sql.commit();
sys.setRetData("0");