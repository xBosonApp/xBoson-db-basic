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
//id:deleterole
//name:角色删除

var roleid=sys.request.roleid;
//删除，查询flag
var flag=sys.request.flag; 
var openid=sys.request.openid;
var org=sys.request.org;

if(roleid==null||flag==null){
    sys.setRetData("1");
    return;
}

if(flag=="0"){
//返回受影响的用户和部门
  var sql_re="select b.userid,c.de0201039 usernm from sys_user_role a ,sys_userinfo b , mdm_personal_info c";
  sql_re=sql_re+" where a.roleid=? and a.pid=b.pid and b.pid=c.pid";
  var param_re=[roleid];
  sql.query(sql_re,param_re,"user");

  sql_re="select b.deptnm from sys_dept_role a , mdm_dept b where a.roleid=? and a.deptid=b.deptid";
  sql.query(sql_re,param_re,"dept");

  sql_re="select b.sysnm from sys_system_role a,sys_system b where a.roleid=? and a.sysid=b.sysid";
  sql.query(sql_re,param_re,"sys");

  sql_re="select menunm, roleid from sys_menu where roleid is not null or roleid != ''";
  sql.query(sql_re,null,"allMenu");
  var allMenu = sys.result["allMenu"];
  var menuList = [];
  for (row in allMenu) {
    if (sys.contain(row["roleid"], roleid)) {
      map.remove(row, "roleid");
      list.add(menuList, row);
    }
  }
  sys.addRetData(menuList, "menu");

  sys.setRetData("0","","user","dept","sys","menu");
  return;
}
//删除sys_role_api中的对应记录
var sql_de="delete from sys_role_api where roleid=?";
var param_de=[roleid];
sql.update(sql_de,param_de,"1");

//删除sys_role中的对应记录
var sql_de1="delete from sys_role where roleid=?";
var param_de1=[roleid];
sql.update(sql_de1,param_de1,"1");

//删除sys_user_role中的对应记录
var sql_de2="delete from sys_user_role where roleid=?";
var param_de2=[roleid];
sql.update(sql_de2,param_de2,"1");

//删除sys_dept_role中的对应记录
var sql_de3="delete from sys_dept_role where roleid=?";
var param_de3=[roleid];
sql.update(sql_de3,param_de3,"1");

// 删除 sys_menu 表中的roleid
var sql_de4="select menuid, roleid from sys_menu where roleid is not null or roleid != ''";
sql.query(sql_de4,null,"allMenu");
var allMenu = sys.result["allMenu"];
var menuList = [];
for (row in allMenu) {
  if (sys.contain(row["roleid"], roleid)) {
    var tmpRoleid = row["roleid"];
    tmpRoleid = sys.replace(tmpRoleid, roleid + ",", "");
    tmpRoleid = sys.replace(tmpRoleid, "," + roleid, "");
    tmpRoleid = sys.replace(tmpRoleid, roleid, "");
    if (tmpRoleid == "") {
      tmpRoleid = null;
    }
    map.put(row, "roleid", tmpRoleid);
    list.add(menuList, row);
  }
}
var sql_de5 = "update sys_menu set roleid = ? where menuid = ?";
for (row in menuList) {
  sql.update(sql_de5, [row["roleid"], row["menuid"]], "1");
}

sql.commit();

var keys = se.cacheKeys(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + roleid + ":*");
se.delAllCache(_CACHE_REGION_SYS_AUTHORITY_, keys);

sys.setRetData("0");