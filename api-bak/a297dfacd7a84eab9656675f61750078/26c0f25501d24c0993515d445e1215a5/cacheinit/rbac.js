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
// 清空已有缓存
se.delCache(_CACHE_REGION_RBAC_);
//获取所有初始化db的机构
var orgs = se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

// ----缓存第三方应用的角色信息 开始----
// 1.获取所有有效的clientid，
sql.query("select tp_appid client_id from sys_pl_tp_app where status='1'",null,"clients");
var clients = sys.result["clients"];
// 2.循环所有有效机构，获取该应用在各机构的角色，含发布应用的角色
var currentDateString = date.formattedTime(date.currentDate(), "yyyyMMdd");
for (org in orgs) {
  var sqlClientRole=          "select client_id,scope,roleid from (";
  sqlClientRole=sqlClientRole+"select rc.client_id,rc.scope,role.roleid ";
  sqlClientRole=sqlClientRole+"from " + org + ".sys_role_client rc," + org + ".sys_role role ";
  sqlClientRole=sqlClientRole+"where rc.roleid=role.roleid and rc.status='1' and role.status='1' ";
  sqlClientRole=sqlClientRole+"union ";
  sqlClientRole=sqlClientRole+"select sys_role_client.client_id,sys_role_client.scope,sys_role_client.roleid roleid ";
  sqlClientRole=sqlClientRole+"from " + org + ".sys_role_client,sys_pl_role_release,sys_pl_application_release,sys_pl_biz_application,sys_pl_org_application ";
  sqlClientRole=sqlClientRole+"where sys_role_client.roleid=sys_pl_role_release.roleid ";
  sqlClientRole=sqlClientRole+"and sys_pl_role_release.applicationid=sys_pl_application_release.applicationid ";
  sqlClientRole=sqlClientRole+"and sys_pl_application_release.applicationid=sys_pl_biz_application.applicationid ";
  sqlClientRole=sqlClientRole+"and sys_pl_biz_application.applicationid=sys_pl_org_application.applicationid ";
  sqlClientRole=sqlClientRole+"and sys_pl_biz_application.biz_status='20' ";
  sqlClientRole=sqlClientRole+"and sys_pl_org_application.orgid=? ";
  sqlClientRole=sqlClientRole+"and (sys_pl_org_application.expiration='00000000' or sys_pl_org_application.expiration>=?) ";
  sqlClientRole=sqlClientRole+"and sys_role_client.status='1' ";
  sqlClientRole=sqlClientRole+"and sys_pl_role_release.status='1' ";
  sqlClientRole=sqlClientRole+"and sys_pl_application_release.status='1' ";
  sqlClientRole=sqlClientRole+"and sys_pl_biz_application.status='1' ";
  sqlClientRole=sqlClientRole+"and sys_pl_org_application.status='1' ";
  sqlClientRole=sqlClientRole+") roles order by client_id";
  sql.query(sqlClientRole, [org,currentDateString], "clientrole");
  var clientrole = sys.result["clientrole"];
  for (client in clients) {
    var clientId = client.client_id;
    var tmplist = [];
    for (cr in clientrole) {
      if(clientId == cr.client_id){
        map.remove(cr, "client_id");
        list.add(tmplist, cr);
      }
    }
    if (sys.size(tmplist) > 0) {
      // Client RoleID List
      // org:client_id - List<Map<?, ?>>(scope,roleid)
      se.setCache(_CACHE_REGION_RBAC_, org + ":" + clientId, tmplist, 0);
    }
  }
}
// ----缓存第三方应用的角色信息 结束----

// ----缓存所有机构角色 API 权限 开始----
// 只有包含API的数据会返回，没有模块或完全没有API的不会返回
for (org in orgs) {
  var sqlApi="select role.roleid,api.appid,api.moduleid,api.apiid from "+org+".sys_role_api api,"+org+".sys_role role,"+org+".sys_apps apps,"+org+".sys_modules modules,"+org+".sys_apis apis where api.roleid=role.roleid and api.appid=apps.appid and api.appid=modules.appid and api.moduleid=modules.moduleid and api.appid=apis.appid and api.moduleid=apis.moduleid and api.apiid=apis.apiid and role.status='1' and api.status='1' and apps.status='1' and modules.status='1' and apis.status='1'";
  sql.query(sqlApi, null, "allrole");
  var allrole=sys.result["allrole"];
  for (row in allrole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    // roleid:01:appid+moduleid+apiid
    se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":01:" + app_mod_api, 0, 0);
  }
}
// ----缓存所有机构角色 API 权限 结束----

// ----缓存所有发布应用（普通）角色 API 权限 开始----
var rlsNomApi="select role.roleid,api.appid,api.moduleid,api.apiid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_api_release api,sys_pl_biz_application biz where role.applicationid=app.applicationid and role.roleid=api.roleid and biz.applicationid=app.applicationid and biz.biz_status='20' and role.status='1' and app.status='1' and api.status='1' and biz.status='1'";
sql.query(rlsNomApi, null, "rlsnomapi");
for (row in sys.result["rlsnomapi"]) {
  var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  // roleid:01:appid+moduleid+apiid
  se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":01:" + app_mod_api, 0, 0);
}
// ----缓存所有发布应用（普通）角色 API 权限 结束----

// ----缓存所有发布应用（公共）角色 API 权限 开始----
var rlsPubApi="select app.orgid,api.appid,api.moduleid,api.apiid from sys_pl_application_release app, sys_pl_pub_api_release api,sys_pl_biz_application biz where api.applicationid=app.applicationid and biz.applicationid=app.applicationid and biz.biz_status='20' and app.status='1' and api.status='1' and biz.status='1'";
sql.query(rlsPubApi, null, "rlspubapi");
for (row in sys.result["rlspubapi"]) {
  var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  // 01:appid+moduleid+apiid
  se.setCache(_CACHE_REGION_RBAC_, "01:" + app_mod_api, 0, 0);
}
// ----缓存所有发布应用（公共）角色 API 权限 结束----

// ----缓存机构角色模型权限 开始----
for (org in orgs) {
  //var sqlModel = "select roleid,typecd from "+org+".sys_role_model where status='1'";
  var sqlModel = "select role.roleid,role.typecd from "+org+".sys_role_model role,(select modolcd modelid from "+org+".sys_bm002 where status='1' union select a.typecd modelid from "+org+".sys_bm003 a,"+org+".sys_bm001 b where a.typecd = b.typecd and a.status='1' and b.status='1' union select a.typecd modelid from "+org+".sys_bm004 a,"+org+".sys_bm001 b where a.typecd = b.typecd and a.status='1' and b.status='1') model where role.typecd=model.modelid and role.status='1'";
  try {
    sql.query(sqlModel, null, "allRolemodel");
  } catch(e) {
    continue;
  }
  var allRolemodel=sys.result["allRolemodel"];
  for (row in allRolemodel) {
    // roleid:02:modelid
    se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":02:" + row["typecd"], 0, 0);
  }
}
// ----缓存机构角色模型权限 结束----

// ----缓存所有发布应用（普通）角色模型权限 开始----
var rlsNomModel="select role.roleid,model.typecd from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_model_release model,sys_pl_biz_application biz where role.applicationid=app.applicationid and role.roleid=model.roleid and biz.applicationid=app.applicationid and biz.biz_status='20' and role.status='1' and app.status='1' and model.status='1' and biz.status='1'";
sql.query(rlsNomModel, null, "rlsnommodel");
for (row in sys.result["rlsnommodel"]) {
  // roleid:02:modelid
  se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":02:" + row["typecd"], 0, 0);
}
// ----缓存所有发布应用（普通）角色模型权限 结束----

// ----缓存所有发布应用（公共）角色模型权限 开始----
var rlsPubModel="select app.orgid,model.typecd from sys_pl_application_release app, sys_pl_pub_model_release model,sys_pl_biz_application biz where model.applicationid=app.applicationid and biz.applicationid=app.applicationid and biz.biz_status='20' and app.status='1' and model.status='1' and biz.status='1'";
sql.query(rlsPubModel, null, "rlspubmodel");
for (row in sys.result["rlspubmodel"]) {
  // 02:modelid
  se.setCache(_CACHE_REGION_RBAC_, "02:" + row["typecd"], 0, 0);
}
// ----缓存所有发布应用（公共）角色模型权限 结束----

// ----缓存角色菜单权限 开始----无用？发布应用的角色菜单也无用？
for (org in orgs) {
  var sqlMenu="select roleid,menuid from "+org+".sys_role_menu where status='1'";
  sql.query(sqlMenu, null, "menu");
  var menu=sys.result["menu"];
  var tmpMap = {};
  for (row in menu) {
    var roleid = row["roleid"];
    if (tmpMap[roleid] == null) {
      map.put(tmpMap, roleid, []);
    }
    list.add(tmpMap[roleid], row["menuid"]);
  }
  for (entry in tmpMap) {
    // roleid:03 - List[menuid]菜单ID List，只包含最底层的菜单ID
    // 用户登录到主页面时，从缓存中获取其所有角色的所有最底层菜单，在 API 中组合出所有的上层菜单，并按【菜单管理】预先设定的顺序在页面上展示
    se.setCache(_CACHE_REGION_RBAC_, entry.key + ":03", entry.value, 0);
  }
}
// ----缓存角色菜单权限 结束----

// ----缓存角色页面权限 开始----
for (org in orgs) {
  var sqlPage="select roleid,pageid from "+org+".sys_role_page where status='1'";
  sql.query(sqlPage, null, "page");
  var page=sys.result["page"];
  for (row in page) {
    // roleid:04:页面ID
    se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":04:" + row["pageid"], 0, 0);
  }
}
// ----缓存角色页面权限 结束----

// ----缓存所有发布应用角色页面权限 开始----
var rlsRolePage="select role.roleid,page.pageid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_page_release page,sys_pl_biz_application biz where role.applicationid=app.applicationid and role.roleid=page.roleid and biz.applicationid=app.applicationid and biz.biz_status='20' and role.status='1' and app.status='1' and page.status='1' and biz.status='1'";
sql.query(rlsRolePage, null, "rlsrolepage");
for (row in sys.result["rlsrolepage"]) {
  // roleid:04:页面ID
  se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":04:" + row["pageid"], 0, 0);
}
// ----缓存所有发布应用角色页面权限 结束----

// ----缓存角色页面组件权限 开始----
for (org in orgs) {
  var sqlElement="select roleid,pageid,elementid,element_status from "+org+".sys_role_pe where status='1'";
  sql.query(sqlElement, null, "element");
  var element=sys.result["element"];
  var tmpRoleMap = {};
  for (row in element) {
    var roleid = row["roleid"];
    if (tmpRoleMap[roleid] == null) {
      map.put(tmpRoleMap, roleid, []);
    }
    list.add(tmpRoleMap[roleid], row);
  }
  var tmpPageMap = {};
  for (entry in tmpRoleMap) {
    var roleid = entry.key;
    for (row in entry.value) {
      var pageid = row["pageid"];
      var newKey = roleid+pageid;
      if (tmpPageMap[newKey] == null) {
        map.put(tmpPageMap, newKey, []);
      }
      list.add(tmpPageMap[newKey], row);
    }
  }
  for (entry in tmpPageMap) {
    var tmpMap = {};
    if (sys.size(entry.value) > 0) {
      var roleid = entry.value[0]["roleid"];
      var pageid = entry.value[0]["pageid"];
      for (eleRow in entry.value) {
        map.put(tmpMap, eleRow["elementid"], eleRow["element_status"]);
      }
      // roleid:05:页面ID - Map<页面相应组件的ID:"1">  // 1显示并可用,2显示但不可用,3不显示
      se.setCache(_CACHE_REGION_RBAC_, roleid + ":05:" + pageid, tmpMap, 0);
    }
  }
}
// ----缓存角色页面组件权限 结束----

// ----缓存所有发布应用角色页面组件权限 开始----
var rlsRolePE="select role.roleid,pe.pageid,pe.elementid,pe.element_status from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_pe_release pe,sys_pl_biz_application biz where role.applicationid=app.applicationid and role.roleid=pe.roleid and biz.applicationid=app.applicationid and biz.biz_status='20' and role.status='1' and app.status='1' and pe.status='1' and biz.status='1'";
sql.query(rlsRolePE, null, "rlsrolepe");
if (sys.size(sys.result["rlsrolepe"]) > 0) {
  var tmpRoleMap = {};
  for (row in sys.result["rlsrolepe"]) {
    var roleid = row["roleid"];
    if (tmpRoleMap[roleid] == null) {
      map.put(tmpRoleMap, roleid, []);
    }
    list.add(tmpRoleMap[roleid], row);
  }
  var tmpPageMap = {};
  for (entry in tmpRoleMap) {
    var roleid = entry.key;
    for (row in entry.value) {
      var pageid = row["pageid"];
      var newKey = roleid+pageid;
      if (tmpPageMap[newKey] == null) {
        map.put(tmpPageMap, newKey, []);
      }
      list.add(tmpPageMap[newKey], row);
    }
  }
  for (entry in tmpPageMap) {
    var tmpMap = {};
    if (sys.size(entry.value) > 0) {
      var roleid = entry.value[0]["roleid"];
      var pageid = entry.value[0]["pageid"];
      for (eleRow in entry.value) {
        map.put(tmpMap, eleRow["elementid"], eleRow["element_status"]);
      }
      // roleid:05:页面ID - Map<页面相应组件的ID:"1">  // 1显示并可用,2显示但不可用,3不显示
      se.setCache(_CACHE_REGION_RBAC_, roleid + ":05:" + pageid, tmpMap, 0);
    }
  }
}
// ----缓存所有发布应用角色页面组件权限 结束----

se.setCache(_CACHE_REGION_RBAC_, _CACHE_KEY_READY_, true, 0);
sys.setRetData("0");