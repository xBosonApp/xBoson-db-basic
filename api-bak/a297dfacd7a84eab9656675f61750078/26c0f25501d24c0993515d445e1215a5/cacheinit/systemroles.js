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
se.delCache(_CACHE_REGION_SYS_AUTHORITY_);
//获取所有初始化db的机构
var orgs=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);
var orgs_v=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_V_);

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

// var sqlCommRole = se.getCache(_CACHE_REGION_SYS_SQL_,"auth0008");
// sql.query(sqlCommRole,[],"commrole");
// var commrole=sys.result.commrole;

// //缓存通用角色
// var commrolelist=[];
// for(r in commrole){
//     var tmp=sys.toLowerCase(r.roleid+r.appid+r.moduleid+r.apiid);
//     list.add(commrolelist,tmp);
// }
// se.setCache(_CACHE_REGION_SYS_AUTHORITY_, _CACHE_KEY_COMM_ROLE_, commrolelist, 0);

// //缓存所有角色api
// var sqlOrgRoleApi = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0002");
// // 只有包含API的数据会返回，第三方APP或完全没有模块或完全没有API的不会返回
// for (org in orgs) {
//     var tmpsql=sys.replace(sqlOrgRoleApi, "sys_role_api", org+".sys_role_api");
//     tmpsql=sys.replace(tmpsql, "sys_role ", org+".sys_role ");//加空格
//     tmpsql=sys.replace(tmpsql, "sys_apps", org+".sys_apps");
//     tmpsql=sys.replace(tmpsql, "sys_modules", org+".sys_modules");
//     tmpsql=sys.replace(tmpsql, "sys_apis", org+".sys_apis");

//     sql.query(tmpsql, null, "allrole");
//     var allrole=sys.result["allrole"];
//     // var allrole=[];
//     var tmplist=[];
//     for(r in allrole){
//         var tmp=sys.toLowerCase(r.roleid+r.appid+r.moduleid+r.apiid);
//         list.add(tmplist,tmp);
//     }
//     se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org, tmplist, 0);
// }

//缓存系统的角色
//select sysid from sys_system where status = '1'
var sqlSystem = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0006");
var sqlSystemRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0007");
sql.query(sqlSystem, null, "sysids");
var sysids = sys.result["sysids"];
for (org in orgs) {
    var tmpsql = sys.replace(sqlSystemRole, "sys_role", org + ".sys_role");
    tmpsql = sys.replace(tmpsql, "sys_system_role", org + ".sys_system_role");
    // TODO: 多租户场景下，此处有已发布应用的时效性问题，考虑使用计划任务每天24点更新该缓存
    sql.query(tmpsql, [org,date.formattedTime(date.currentDate(), "yyyyMMdd")], "systemrole");
    var systemrole = sys.result["systemrole"];
    for(a in sysids){
        var tmplist=[];
        for(b in systemrole){
            if(b.sysid==a.sysid){
                map.remove(b,"sysid");
                list.add(tmplist, b);
            }
        }
        if(sys.size(tmplist)>0){
            // 系统 RoleID List，只有本机构的角色，没有已发布应用的角色
            // org:"systems":sysid - List<Map<?, ?>>(orgid,roleid)
            se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org+":systems:"+a.sysid, tmplist, 0);
        }
    }
}

// 缓存所有角色 API 信息
// orgid : roleid : appid + moduleid + apiid
var sqlOrgRoleApi = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0002");
// 只有包含API的数据会返回，没有模块或完全没有API的不会返回
for (org in orgs_v) {
  var tmpsql=sys.replace(sqlOrgRoleApi, "sys_role", org+".sys_role");
  tmpsql=sys.replace(tmpsql, "sys_apps", org+".sys_apps");
  tmpsql=sys.replace(tmpsql, "sys_modules", org+".sys_modules");
  tmpsql=sys.replace(tmpsql, "sys_apis", org+".sys_apis");

  sql.query(tmpsql, null, "allrole");
  var allrole=sys.result["allrole"];
  for (row in allrole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + row["roleid"] + ":" + app_mod_api, 0, 0);
  }
}

// // 缓存系统角色 API 信息
// // orgid : roleid : appid + moduleid + apiid + sysid
// var sqlSystemAll = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0015");
// for (org in orgs) {
//   var tmpsql = sys.replace(sqlSystemAll, "sys_system_role", org + ".sys_system_role");
//   tmpsql = sys.replace(tmpsql, "sys_role", org + ".sys_role");
//   tmpsql = sys.replace(tmpsql, "sys_apps", org + ".sys_apps");
//   tmpsql = sys.replace(tmpsql, "sys_modules", org + ".sys_modules");
//   tmpsql = sys.replace(tmpsql, "sys_apis", org + ".sys_apis");

//   sql.query(tmpsql, [org], "systemRole");
//   var systemRole = sys.result["systemRole"];
//   for (row in systemRole) {
//     var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
//     se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + row["roleid"] + ":" + app_mod_api + row["sysid"], 0, 0);
//   }
// }

// 缓存已发布应用（普通）角色 API 信息
// "application_normal" : roleid : appid + moduleid + apiid
var sqlReleasedRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0014");
//for (org in orgs) {
//  sql.query(sqlReleasedRole, [org], "releasedRole");
  sql.query(sqlReleasedRole, null, "releasedRole");
  var releasedRole = sys.result["releasedRole"];
  for (row in releasedRole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + app_mod_api, 0, 0);
  }
//}

// 缓存已发布应用（公共）角色 API 信息，机构ID作为角色ID，同机构所有公共应用使用同一角色ID即机构ID
// "application_pub" : orgid : appid + moduleid + apiid
var sqlReleasedPubRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0016");
//for (org in orgs) {
//  sql.query(sqlReleasedPubRole, [org], "releasedPubRole");
  sql.query(sqlReleasedPubRole, null, "releasedPubRole");
  var releasedPubRole = sys.result["releasedPubRole"];
  for (row in releasedPubRole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + app_mod_api, 0, 0);
  }
//}

// 缓存角色模型权限
var sqlOrgRoleModel = "select roleid,typecd from sys_role_model where status='1'";
for (org in orgs_v) {
    sqlOrgRoleModel = "select roleid,typecd from "+org+".sys_role_model where status='1'";
    try{
        sql.query(sqlOrgRoleModel, null, "allRolemodel");    
    }catch(e){
        continue;
    }
    var allRolemodel=sys.result["allRolemodel"];
    for (row in allRolemodel) {
        se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + row["roleid"] + ":" + row["typecd"], 0, 0);
    }
}
// // // 缓存角色页面权限
// var sqlOrgRolePageAuth = "select roleid,pageid,page_auth from sys_role_page_auth where status='1'";
// for(org in orgs_v){
//     sqlOrgRolePageAuth = "select roleid,pageid,page_auth from "+org+".sys_role_page_auth where status='1'";
//     try{
//         sql.query(sqlOrgRolePageAuth,null,"allRolePageAuth");    
//     }catch(e){
//         continue;
//     }
//     var allRolePageAuth=sys.result["allRolePageAuth"];
//     for(row in allRolePageAuth){
//         se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org+":"+row["roleid"]+":"+row["pageid"], row["page_auth"], 0);
//     }
// }

se.setCache(_CACHE_REGION_SYS_AUTHORITY_, _CACHE_KEY_READY_, true, 0);