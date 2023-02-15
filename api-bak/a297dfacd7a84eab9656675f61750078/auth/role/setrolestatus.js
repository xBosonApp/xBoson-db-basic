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
//apiid:updrolestatus
//apiname:修改角色状态

var roleid=sys.request.roleid;
var status=sys.request.status;
var org=sys.request.org;

if(roleid==null){
    sys.setRetData(1);
    return;
}

var param=[status,roleid];
var sql="update sys_role set status=? where roleid=?";

sql.update(sql,param);

if (status == "1") {
  // orgid : roleid + appid + moduleid + apiid
  var sqlOrgRoleApi = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0002");

  sql.query(sqlOrgRoleApi, null, "allrole");
  var allrole=sys.result["allrole"];
  for (row in allrole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + row["roleid"] + ":" + app_mod_api, 0, 0);
  }
} else {
  var keys = se.cacheKeys(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + roleid + ":*");
  se.delAllCache(_CACHE_REGION_SYS_AUTHORITY_, keys);
}

sys.setRetData(0);