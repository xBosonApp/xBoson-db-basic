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
// updrole
// 角色修改
// 参数：roleid(必须)
var org = sys.request.org;
var orgid = sys.request.orgid;
var roleid = sys.request.roleid;
var rolenm = sys.request.rolenm;
var op_type = sys.request.op_type;
var role_desc = sys.request.role_desc;
var role_type = sys.request.role_type;
var status = sys.request.status;
var openid = sys.request.openid;
if (roleid == null || rolenm == null) {
  sys.setRetData("1");
  return;
}

var sql = "select count(*) cnt from sys_role where sys_role.rolenm = ? and roleid <> ? and orgid =?";
var param = [rolenm, roleid,orgid];
sql.query(sql, param);
var cntResult = sys.result.result;
var cnt;
for (r in cntResult) {
  cnt = r.cnt;
}
if (cnt == "0") {
  var paramUpd = [rolenm];
  var sqlUpd = "update sys_role set rolenm = ?, ";
  if (role_desc != null) {
    sqlUpd = sqlUpd + "role_desc = ?,";
    list.add(paramUpd,role_desc);
  }
  if (op_type != null) {
    sqlUpd = sqlUpd + "op_type = ?,";
    list.add(paramUpd,op_type);
  }
  if (status != null) {
    sqlUpd = sqlUpd + "status = ?,";
    list.add(paramUpd,status);
  }
  if (role_type != null) {
    sqlUpd = sqlUpd + "role_type = ?,";
    list.add(paramUpd,role_type);
  }
  sqlUpd = sqlUpd + "updatedt = ? ";
  list.add(paramUpd,sys.currentTimeString());
  sqlUpd = sqlUpd + " where roleid = ?";
  list.add(paramUpd,roleid);
  sql.update(sqlUpd, paramUpd);

  if (status != null && status != "1") {
    var keys = se.cacheKeys(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + roleid + ":*");
    se.delAllCache(_CACHE_REGION_SYS_AUTHORITY_, keys);
  }

  sys.setRetData("0");
} else {
  sys.setRetData("8", "该角色名称已经存在");
}