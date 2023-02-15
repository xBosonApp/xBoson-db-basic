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
var deptid=sys.request.deptid;
var roleid=sys.request.roleid;
var orgid=sys.request.org;

if(deptid==null){
  sys.setRetData("1", "部门ID为空");
  return;
}
if(roleid==null){
  sys.setRetData("1", "角色为空");
  return;
}

var sqlInsert="insert into sys_dept_role (deptid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var dt=sys.currentTimeString();
var roleList = sys.split(roleid, ",");
for (role in roleList) {
  var sql_role="select roleid from sys_dept_role where deptid=? and roleid=?";
  var param_role=[deptid, role];
  if (sql.query(sql_role,param_role) == 0) {
    var paramInsert = [deptid,role,"1",dt,dt];
    sql.update(sqlInsert,paramInsert,"1");
  }
}
sql.commit();
sys.setRetData("0");