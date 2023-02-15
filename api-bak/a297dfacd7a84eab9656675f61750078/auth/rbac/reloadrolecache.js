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
// reloadrolecache 重载指定角色的缓存数据
var roleid=sys.request.roleid;
var reload_type=sys.request.reload_type;
if (roleid == null) {
  sys.setRetData("1", "角色ID未指定");
  return;
}
if (reload_type==null) {
  reload_type="00";
}

// 删除现存
if (reload_type=="00" || reload_type =="01") {
  var keys = se.cacheKeys(_CACHE_REGION_RBAC_, roleid+":01:*");
  se.delAllCache(_CACHE_REGION_RBAC_, keys);
  // API
  var sqlApi="select role.roleid,api.appid,api.moduleid,api.apiid from sys_role_api api,sys_role role,sys_apps apps,sys_modules modules,sys_apis apis where role.roleid=? and api.roleid=role.roleid and api.appid=apps.appid and api.appid=modules.appid and api.moduleid=modules.moduleid and api.appid=apis.appid and api.moduleid=apis.moduleid and api.apiid=apis.apiid and role.status='1' and api.status='1' and apps.status='1' and modules.status='1' and apis.status='1'";
  sql.query(sqlApi, [roleid], "allrole");
  var allrole=sys.result["allrole"];
  for (row in allrole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    // roleid:01:appid+moduleid+apiid
    se.setCache(_CACHE_REGION_RBAC_, roleid + ":01:" + app_mod_api, 0, 0);
  }
}
if (reload_type=="00" || reload_type =="02") {
  var keys = se.cacheKeys(_CACHE_REGION_RBAC_, roleid+":02:*");
  se.delAllCache(_CACHE_REGION_RBAC_, keys);
  // 模型
  var sqlModel = "select role.roleid,role.typecd from sys_role_model role,(select modolcd modelid from sys_bm002 where status='1' union select a.typecd modelid from sys_bm003 a,sys_bm001 b where a.typecd = b.typecd and a.status='1' and b.status='1' union select a.typecd modelid from sys_bm004 a,sys_bm001 b where a.typecd = b.typecd and a.status='1' and b.status='1') model where role.roleid=? and role.typecd=model.modelid and role.status='1'";
  sql.query(sqlModel, [roleid], "allRolemodel");
  var allRolemodel=sys.result["allRolemodel"];
  for (row in allRolemodel) {
    // roleid:02:modelid
    se.setCache(_CACHE_REGION_RBAC_, roleid + ":02:" + row["typecd"], 0, 0);
  }
}
if (reload_type=="00" || reload_type =="03") {
  se.delCache(_CACHE_REGION_RBAC_, roleid+":03");
  // 菜单
  var sqlMenu="select roleid,menuid from sys_role_menu where roleid=? and status='1'";
  sql.query(sqlMenu, [roleid], "menu");
  var menu=sys.result["menu"];
  var menuList = [];
  for (row in menu) {
    list.add(menuList, row["menuid"]);
  }
  se.setCache(_CACHE_REGION_RBAC_, roleid + ":03", menuList, 0);
}
if (reload_type=="00" || reload_type =="04") {
  var keys = se.cacheKeys(_CACHE_REGION_RBAC_, roleid+":04:*");
  se.delAllCache(_CACHE_REGION_RBAC_, keys);
  // 页面
  var sqlPage="select roleid,pageid from sys_role_page where roleid=? and status='1'";
  sql.query(sqlPage, [roleid], "page");
  var page=sys.result["page"];
  for (row in page) {
    // roleid:04:页面ID
    se.setCache(_CACHE_REGION_RBAC_, roleid + ":04:" + row["pageid"], 0, 0);
  }
}
if (reload_type=="00" || reload_type =="05") {
  var keys = se.cacheKeys(_CACHE_REGION_RBAC_, roleid+":05:*");
  se.delAllCache(_CACHE_REGION_RBAC_, keys);
  // 页面组件权限
  var sqlElement="select roleid,pageid,elementid,element_status from sys_role_pe where roleid=? and status='1'";
  sql.query(sqlElement, [roleid], "element");
  var element=sys.result["element"];
  var tmpRoleMap = {};
  for (row in element) {
    var rid = row["roleid"];
    if (tmpRoleMap[rid] == null) {
      map.put(tmpRoleMap, rid, []);
    }
    list.add(tmpRoleMap[rid], row);
  }
  var tmpPageMap = {};
  for (entry in tmpRoleMap) {
    for (row in entry.value) {
      var pageid = row["pageid"];
      if (tmpPageMap[pageid] == null) {
        map.put(tmpPageMap, pageid, []);
      }
      list.add(tmpPageMap[pageid], row);
   }
  }
 for (entry in tmpPageMap) {
    var tmpMap = {};
    if (sys.size(entry.value) > 0) {
      var rid = entry.value[0]["roleid"];
      var pageid = entry.value[0]["pageid"];
      for (eleRow in entry.value) {
       map.put(tmpMap, eleRow["elementid"], eleRow["element_status"]);
      }
      // roleid:05:页面ID - Map<页面相应组件的ID:"1">  // 1显示并可用,2显示但不可用,3不显示
      se.setCache(_CACHE_REGION_RBAC_, rid + ":05:" + pageid, tmpMap, 0);
    }
  }
}

sys.setRetData("0");