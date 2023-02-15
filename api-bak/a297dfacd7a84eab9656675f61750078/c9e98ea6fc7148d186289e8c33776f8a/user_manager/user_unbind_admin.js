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
var pid = sys.getUserPID();
var org = sys.request.org;

var user_pid = sys.request.user_pid;
if(sys.isEmpty(pid) || sys.isEmpty(org) ||sys.isEmpty(user_pid)){
  sys.setRetData(1);
  return;
}

var sqls = "select admin_flag from sys_tenant_user where pid=? and orgid=?";
sql.query(sqls,[pid,org],"admin");
if(sys.result.admin[0].admin_flag!='1'){
  sys.setRetData(1,"您不是管理员不能执行该操作。");
  return;
}

sqls = "select orgid,admin_flag from sys_tenant_user where pid=?";
sql.query(sqls,[user_pid],"users");
var users = sys.result.users;
for(var user in users){
  if(user.admin_flag!='0'){
    sys.setRetData(1,"用户为"+user.orgid+"下的管理员,不能删除。");
    sql.rollback();
    return;
  } else {
    sqls = "delete from "+user.orgid+".sys_user_dept where pid=?";
    sql.update(sqls,[user_pid],"1");
    sqls = "delete from "+user.orgid+".sys_user_role where pid=?";
    sql.update(sqls,[user_pid],"1");
    sqls = "delete from "+user.orgid+".sys_user_html where pid=?";
    sql.update(sqls,[user_pid],"1");
    sqls = "delete from "+user.orgid+".sys_ug_user where pid=?";
    sql.update(sqls,[user_pid],"1");
  }
}


//
sqls = "delete from sys_tenant_user where pid=?";
sql.update(sqls,[user_pid],"1");
sqls = "delete from mdm_personal_info where pid=? ";
sql.update(sqls,[user_pid],"1");
sqls = "delete from sys_userinfo where pid=?";
sql.update(sqls,[user_pid],"1");

sql.commit();
sys.setRetData(0,"用户账户删除成功");