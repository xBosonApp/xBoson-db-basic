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
// getrole
// 角色修改时同步角色信息
// 参数：roleid(必须)
var openid = sys.request.openid;
var org=sys.request.org;
var roleid = sys.request.roleid;

if (roleid == null) {
  sys.setRetData("1");
  return;
}

var sql = "select roleid, rolenm,op_type, status, role_desc, role_type ";
  //判断org是否是平台，返回comm_flag
var boolean=se.isPlatformOrg();
if(boolean){
    sql=sql+",comm_flag from sys_role where sys_role.roleid = ?";
}else{
    sql=sql+" from sys_role where sys_role.roleid = ?";
}
var param = [roleid];
var cnt = sql.query(sql, param);
if (cnt > 0) {
  sys.setRetData("0", "", "result");
} else {
  sys.setRetData("6");
}