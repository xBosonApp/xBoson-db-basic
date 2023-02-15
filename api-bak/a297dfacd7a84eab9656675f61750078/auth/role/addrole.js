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
// addrole
// 添加角色
// 参数：rolenm(必须)
var org=sys.request.org;
var rolenm = sys.request.rolenm;
var role_desc = sys.request.role_desc;
var op_type = sys.request.op_type;
var role_type = sys.request.role_type;
var status = sys.request.status;

if (rolenm == null) {
  sys.setRetData("1", "角色名称为空");
  return;
}
if (status == null) {
  sys.setRetData("1", "状态为空");
  return;
}
//角色类型默认为普通角色
if (role_type == null){
    role_type = "01";
}

var sql = "select count(*) cnt from sys_role where sys_role.rolenm = ?";
var param = [rolenm];
sql.query(sql, param);
var cntResult = sys.result.result;
var cnt = "0";
for (r in cntResult) {
  cnt = r.cnt;
}
if (cnt == "0") {
  var sqlAdd = "insert into sys_role (roleid,rolenm,role_desc,op_type,orgid,status,createdt,updatedt,role_type) values (?,?,?,?,?,?,?,?,?)";
  var uuid = sys.uuid();
  var dt = sys.currentTimeString();
  var paramAdd = [uuid, rolenm, role_desc,op_type, org, status, dt, dt, role_type];
  sql.update(sqlAdd, paramAdd);
  sys.setRetData("0");
} else {
  sys.setRetData("8", "该角色名称已经存在");
}