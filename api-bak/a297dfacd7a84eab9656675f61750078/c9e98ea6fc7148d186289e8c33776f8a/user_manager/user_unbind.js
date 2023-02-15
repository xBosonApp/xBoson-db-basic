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
var user_pid = sys.request.user_pid;
// var pid = sys.getUserIdByOpenId(user_pid);
var orgid = sys.request.org;
var sqls = "select orgid,admin_flag from sys_tenant_user where pid=? and orgid=?";

sql.query(sqls,[user_pid,orgid],"user");
var user = sys.result.user;
if(sys.size(user)>0&&user[0].admin_flag!="0"){
  sys.setRetData(1,"管理员不能删除");
  return;
}

//
sqls = "delete from sys_user_dept where pid=?";
sql.update(sqls,[user_pid],"1");
sqls = "delete from sys_user_role where pid=?";
sql.update(sqls,[user_pid],"1");
sqls = "delete from sys_user_html where pid=?";
sql.update(sqls,[user_pid],"1");
sqls = "delete from sys_ug_user where pid=?";
sql.update(sqls,[user_pid],"1");
sqls = "delete from sys_tenant_user where pid=? and orgid=?";
//sqls = "delete from mdm_personal_info where pid=? ";
//sqls = "delete from sys_userinfo where pid=?";
sql.update(sqls,[user_pid,orgid],"1");
sql.commit();
sys.setRetData(0,"解除绑定成功");