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
// roleeffect
var roleid=sys.request.roleid;
if (roleid==null) {
  sys.setRetData("1", "角色ID未指定");
  return;
}
var ugid = sys.request.ugid;
var uguser_pagenum = sys.request.uguser_pagenum;
var uguser_pagesize = sys.request.uguser_pagesize;
var uguser_count = sys.request.uguser_count;
var user_pagenum = sys.request.user_pagenum;
var user_pagesize = sys.request.user_pagesize;
var user_count = sys.request.user_count;

// 角色分配表 sys_role_ug sys_user_role sys_role_client
var paramRoleId=[roleid];

// 用户组及其用户
if (uguser_pagenum!=null) {
  var sqlUg="select ug.ugid,ug.ugnm from sys_role_ug role,sys_ug ug where role.roleid=? and role.ugid=ug.ugid";
  var sqlUgUser="select ug.ugid,user.userid,person.de0201039 usernm from sys_role_ug role,sys_ug_user ug,sys_userinfo user,mdm_personal_info person where role.roleid=? and role.ugid=ug.ugid and ug.pid=user.pid and ug.pid=person.pid and user.pid=person.pid";
  if (ugid!=null && user_pagenum==null) {
    // 只查询角色关联的用户组不查询角色直接关联的用户的情况下，增加用户组ID
    var sqlTmp=" and ug.ugid=?";
    sqlUg = sqlUg + sqlTmp;
    sqlUgUser = sqlUgUser + sqlTmp;
    list.add(paramRoleId,ugid);
  }
  sqlUg = sqlUg + " order by ug.ugnm";
  sqlUgUser = sqlUgUser + " order by ug.ugid, person.de0201039";
  sql.query(sqlUg,paramRoleId, "ug");
  sql.queryPaging(sqlUgUser,paramRoleId,uguser_pagenum,uguser_pagesize,"uguser",uguser_count);
  sys.setRetList(sys.result["ug"],sys.result["uguser"],[["ugid","ugid"]],"children");
  // 只查询角色关联的用户组不查询角色直接关联的用户的情况下
  if (user_pagenum==null) {
    sys.setRetData("0", null, "ug");
    return;
  }
}

// 用户
if (user_pagenum!=null) {
  var sqlUser="select user.userid,person.de0201039 usernm from sys_user_role role,sys_userinfo user,mdm_personal_info person where role.roleid=? and role.pid=user.pid and role.pid=person.pid and user.pid=person.pid";
  sql.queryPaging(sqlUser,paramRoleId,user_pagenum,user_pagesize,"user",user_count);
  // 只查询角色直接关联的用户不查询角色关联的用户组的情况下
  if (uguser_pagenum==null) {
    sys.setRetData("0", null, "user");
    return;
  }
}

// 客户端
if (uguser_pagenum!=null && user_pagenum!=null) {
  var sqlClient="select client.tp_appnm clientnm from sys_role_client role,sys_pl_tp_app client where role.roleid=? and role.client_id=client.tp_appid order by client.tp_appnm";
  sql.query(sqlClient,paramRoleId,"client");
  sys.setRetData("0", null, "ug", "user", "client");
}