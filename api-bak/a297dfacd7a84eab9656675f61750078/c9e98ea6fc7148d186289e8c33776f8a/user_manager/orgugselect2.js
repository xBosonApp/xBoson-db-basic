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
//orgugselect2 机构用户组列表
var sqlUg="select ugid id,ugnm name from sys_ug where status='1'";
var sqlNotNormalUg="select ugrole.ugid ugid from sys_role_ug ugrole,sys_role role where ugrole.roleid=role.roleid and role.role_type<>'01'";
sql.query(sqlUg,null,"ug");
sql.query(sqlNotNormalUg,null,"devug");

var ugList = [];
for (row in sys.result["ug"]) {
  var isFound = false;
  for (ugrow in sys.result["devug"]) {
    if (row["id"]==ugrow["ugid"]) {
      isFound = true;
      break;
    }
  }
  if (!isFound) {
    map.put(row, "text", row["id"] + row["name"]);
    list.add(ugList,row);
  }
}
sys.addRetData(ugList,"result");
sys.setRetData("0","","result");