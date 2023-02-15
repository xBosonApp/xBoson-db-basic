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
// roles
// 获取当前用户所在机构所属角色列表
// 参数：roleid，rolenm

var openid=sys.request.openid;
var org = sys.request.org;
var orgid = sys.request.orgid;
var rolenm = sys.request.rolenm;
var status = sys.request.status;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var role_type = sys.request.role_type;

// 精确查询（角色ID）或模糊查询（角色名称）二选一
var params = [];
var sql = "select sys_role.roleid, sys_role.rolenm, sys_role.op_type, sys_role.orgid, sys_role.status, sys_role.role_desc, sys_role.createdt, sys_role.updatedt, sys_role.role_type ";
//判断org是否是平台，返回comm_flag
  var boolean=se.isPlatformOrg();
if(boolean){
    sql = sql + ", sys_role.comm_flag ";
}
sql=sql + "from sys_role ";

sql=sql + " where sys_role.orgid=?";
@params.add(org);
if (status != null) {
  sql = sql + " and sys_role.status = ?";
  @params.add(status);
}
if (rolenm != null) {
  sql = sql + " and sys_role.rolenm like ?";
  @params.add("%" + rolenm + "%");
}
if(role_type != null){
    sql = sql + " and sys_role.role_type = ?";
    @params.add(role_type);
}
if (pagesize == null) {
  pagesize =10;
}
if (pagenum == null) {
  pagenum = 1;
}
sql=sql+" order by sys_role.status desc,sys_role.rolenm asc";
sql.queryPaging(sql, params,pagenum,pagesize);

sys.setRetData("0", "", "result");