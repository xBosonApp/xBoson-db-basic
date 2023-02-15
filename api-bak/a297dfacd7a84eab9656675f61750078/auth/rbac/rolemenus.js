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
// rolemenus 角色菜单列表
var roleid=sys.request.roleid;
if (roleid == null) {
  sys.setRetData("1", "未指定角色");
  return;
}

var sqlMenu="select menuid,p_menuid,menunm,pageid,uri,sorting_order,menu_desc,prjid from sys_menu where status='1'";
sql.query(sqlMenu, null, "menu");

var sqlRoleMenu="select roleid,menuid from sys_role_menu where roleid=? and status='1'";
sql.query(sqlRoleMenu, [roleid], "rolemenu");

for (pRow in sys.result.menu) {
  for (cRow in sys.result.rolemenu) {
    if (pRow.menuid==cRow.menuid) {
      map.put(pRow,"checked", "true");
      break;
    }
  }
}

var result = sys.transformTreeData(sys.result.menu,"menuid","p_menuid","children");
sys.addRetData(result,"result");
sys.setRetData("0","","result");