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
// authmgtstaffrole 角色分配-人员角色
var ugid=sys.request.ugid;
var userid=sys.request.userid;
var orgid=sys.request.org;

if (ugid!=null) {
  sql.query("select r.roleid,r.rolenm from sys_role r,sys_role_ug ug where ug.ugid=? and ug.roleid=r.roleid and (r.role_type='01' or op_type='1') and ug.status='1' and r.status='1'",[ugid]);
  
  sql.query("select r.roleid,r.rolenm,a.applicationnm from sys_role_ug ug,sys_pl_org_application oa,sys_pl_role_release r,sys_pl_application_release a where ug.ugid=? and ug.roleid=r.roleid and ug.status='1' and r.status='1' and oa.applicationid=r.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and a.status='1'",[ugid,orgid],"rlsroles");
  
  for (row in sys.result["rlsroles"]) {
    var applicationnm = row["applicationnm"];
    map.put(row, "rolenm", applicationnm + "-" + row["rolenm"]);
    map.remove(row, "applicationnm");
  }
  list.addAll(sys.result["result"],sys.result["rlsroles"]);
  sys.setRetData("0",null,"result");
} 
else if (userid!=null) {
  var pid= sys.getUserPID(userid);
  // var pidMap=sys.getUserPID([userid]);
  // if (pidMap!=null){
  //   pid=pidMap[userid];
  // }
  sql.query("select r.roleid,r.rolenm from sys_role r,sys_user_role ur where ur.pid=? and ur.roleid=r.roleid and (r.role_type='01'or op_type='1') and ur.status='1' and r.status='1'",[pid]);
  sql.query("select r.roleid,r.rolenm,a.applicationnm from sys_user_role ur,sys_pl_org_application oa,sys_pl_role_release r,sys_pl_application_release a where ur.pid=? and ur.roleid=r.roleid and ur.status='1' and r.status='1' and oa.applicationid=r.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and a.status='1'",[pid,orgid],"rlsroles");
  
  for (row in sys.result["rlsroles"]) {
    var applicationnm = row["applicationnm"];
    map.put(row, "rolenm", applicationnm + "-" + row["rolenm"]);
    map.remove(row, "applicationnm");
  }
  
  list.addAll(sys.result["result"],sys.result["rlsroles"]);
  sys.setRetData("0",null,"result");
} else {
  sys.setRetData("1","用户组或用户均未指定");
}