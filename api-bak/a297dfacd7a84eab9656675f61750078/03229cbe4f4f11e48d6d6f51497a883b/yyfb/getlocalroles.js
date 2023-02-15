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
// role
sql.query("select rg_id,rg_nm from sys_role_group where status='1' order by rg_nm", null, "result");
sql.query("select roleid,rolenm,role_desc,rg_id,status from sys_role where role_type='01' order by status desc,rolenm", null, "role");
var rg=sys.result.result;
var role=sys.result.role;
// 将没有分组的角色的分组ID设置为“0”
var haveRoleWithoutRg = false;
for (var i=0;i<sys.size(role);i++) {
  if (sys.isEmpty(role[i].rg_id)) {
    map.put(role[i],"rg_id","0");
    haveRoleWithoutRg = true;
  }
}
if (haveRoleWithoutRg) {
  list.add(rg,{"rg_id":"0","rg_nm":"未分组"});
}
sys.setRetList(rg,role,[["rg_id","rg_id"]],"children");
sys.setRetData("0",null,"result");