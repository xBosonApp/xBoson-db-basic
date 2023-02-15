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
//orgugstaff 机构用户组人员列表
var org=sys.request.org;

sql.query("select distinct b.pid,b.userid,a.de0201039 nm from mdm_personal_info a, sys_userinfo b, sys_tenant_user c where a.pid=b.pid and b.pid=c.pid and c.orgid=? and a.status='1' and b.status='1' and c.status='1' order by userid",[org],"user");
sql.query("select ugid ugid,ugnm nm from sys_ug where status='1'",null,"ug_all");
sql.query("select ugrole.ugid ugid from sys_role_ug ugrole,sys_role role where ugrole.roleid=role.roleid and role.role_type<>'01'",null,"devug");
sql.query("select ug.ugid,ugu.pid from sys_ug_user ugu,sys_ug ug where ugu.ugid=ug.ugid and ugu.status='1' and ug.status='1'",null,"uguser");
var haveRoleWithoutRg = false;
var hasNoUg = [];
for (row in sys.result["uguser"]) {
  var nextLoop = false;
  for (ugrow in sys.result["devug"]) {
    if (row["ugid"]==ugrow["ugid"]) {
      nextLoop = true;
      break;
    }
  }
  if (nextLoop) {
    continue;
  }
  for (urow in sys.result["user"]) {
    if (row["pid"]==urow["pid"]) {
      map.put(row,"userid",urow["userid"]);
      map.put(row,"nm",urow["userid"] + " " + row["nm"]);
      map.put(urow,"isFound", "1");
      break;
    }
  }
  map.remove(row,"pid");
}
for (row in sys.result["user"]) {
  if (row["isFound"]==null) {
    map.remove(row,"pid");
    map.put(row,"ugid","0");
    map.put(row,"nm",row["userid"] + " " + row["nm"]);
    list.add(sys.result["uguser"],row);
    if (!haveRoleWithoutRg) {
      haveRoleWithoutRg = true;
    }
  }
}
var ugList = [];
for (row in sys.result["ug_all"]) {
  var isFound = false;
  for (ugrow in sys.result["devug"]) {
    if (row["ugid"]==ugrow["ugid"]) {
      isFound = true;
      break;
    }
  }
  if (!isFound) {
    list.add(ugList,row);
  }
}

if (haveRoleWithoutRg) {
  list.add(ugList,{"ugid":"0","nm":"未分组"});
}
sys.setRetList(ugList,sys.result["uguser"],[["ugid","ugid"]],"children");
sys.addRetData(ugList,"result");
sys.setRetData("0","","result");