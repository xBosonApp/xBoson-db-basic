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
var biz_status = sys.request.biz_status;
var orgid = sys.request.orgid;
var applicationid=sys.request.applicationid;
var dt = sql.currentDBTimeString();
var sqls ="update sys_pl_biz_application set biz_status=?,updatedt=? where applicationid=? ";

sql.update(sqls,[biz_status,dt,applicationid],"1");
if(biz_status == "20" ){
    sqls="select 1 from sys_pl_org_application where orgid=? and applicationid=? ";
    if(sql.query(sqls,[orgid,applicationid],"counts")==0){
        sqls="insert into sys_pl_org_application(orgid, applicationid, expiration, status, createdt, updatedt) values(?,?,'00000000',?,?,?)";
        sql.update(sqls,[orgid,applicationid,"1",dt,dt],"1");
    }
}

sql.commit();

// var sqlReleasedRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0018");
// var sqlReleasedPubRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0017");
// var sqlReleasedModel = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0020");
// var sqlReleasedPubModel = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0019");
// var releasedRoleDel = null;
// var releasedPubRoleDel = null;
if (biz_status=="20") {
  // // 缓存已发布应用（普通）角色 API 信息
  // // orgid : roleid : appid + moduleid + apiid
  // sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRole");
  // var releasedRole = sys.result["releasedRole"];
  // for (row in releasedRole) {
  //   var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  //   se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + app_mod_api, 0, 0);
  // }
  // sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRole");
  // var releasedPubRole = sys.result["releasedPubRole"];
  // for (row in releasedPubRole) {
  //   var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  //   se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + app_mod_api, 0, 0);
  // }
  // // 缓存已发布应用（普通）角色 模型 信息
  // // orgid : roleid : modelcd
  // sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModel");
  // var releasedModel = sys.result["releasedModel"];
  // for (row in releasedModel) {
  //   se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + row["typecd"], 0, 0);
  // }
  // sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModel");
  // var releasedPubModel = sys.result["releasedPubModel"];
  // for (row in releasedPubModel) {
  //   se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + row["typecd"], 0, 0);
  // }
    var sqlReleasedRole="select role.roleid,api.appid,api.moduleid,api.apiid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_api_release api where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=api.roleid and role.status='1' and app.status='1' and api.status='1'";
    var sqlReleasedPubRole="select api.appid,api.moduleid,api.apiid from sys_pl_application_release app, sys_pl_pub_api_release api where app.orgid=? and api.applicationid=app.applicationid and app.applicationid=? and app.status='1' and api.status='1'";
    var sqlReleasedModel="select role.roleid,model.typecd from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_model_release model where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=model.roleid and role.status='1' and app.status='1' and model.status='1'";
    var sqlReleasedPubModel="select typecd from sys_pl_application_release app, sys_pl_pub_model_release model where app.orgid=? and model.applicationid=app.applicationid and app.applicationid=? and app.status='1' and model.status='1'";
    var sqlReleasedPage="select role.roleid,page.pageid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_page_release page where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=page.roleid and role.status='1' and app.status='1' and page.status='1'";
    var sqlReleasedPe="select role.roleid,pe.pageid,pe.elementid,pe.element_status from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_pe_release pe where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=pe.roleid and role.status='1' and app.status='1' and pe.status='1'";
    
    sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRole");
    var releasedRole = sys.result["releasedRole"];
    for (row in releasedRole) {
      var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
      se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":01:" + app_mod_api, 0, 0);
    }
    sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRole");
    var releasedPubRole = sys.result["releasedPubRole"];
    for (row in releasedPubRole) {
      var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
      se.setCache(_CACHE_REGION_RBAC_, "01:" + app_mod_api, 0, 0);
    }
    sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModel");
    var releasedModel = sys.result["releasedModel"];
    for (row in releasedModel) {
      se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":02:" + row["typecd"], 0, 0);
    }
    sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModel");
    var releasedPubModel = sys.result["releasedPubModel"];
    for (row in releasedPubModel) {
      se.setCache(_CACHE_REGION_RBAC_, "02:" + row["typecd"], 0, 0);
    }
    sql.query(sqlReleasedPage, [orgid,applicationid], "releasedPage");
    var releasedPage = sys.result["releasedPage"];
    for (row in releasedPage) {
      se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":04:" + row["pageid"], 0, 0);
    }
    sql.query(sqlReleasedPe, [orgid,applicationid], "releasedPe");
    var releasedPe = sys.result["releasedPe"];
    for (row in releasedPe) {
      se.setCache(_CACHE_REGION_RBAC_, row["roleid"] + ":05:" + row["pageid"], 0, 0);
    }
    var tmpRoleMap = {};
    for (row in releasedPe) {
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
        if (tmpPageMap[pageid] == null) {
          map.put(tmpPageMap, pageid, []);
        }
        list.add(tmpPageMap[pageid], row);
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
} else {
     //删除缓存使用
  // sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRoleDel");
  // releasedRoleDel = sys.result["releasedRoleDel"];

  // sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRoleDel");
  // releasedPubRoleDel = sys.result["releasedPubRoleDel"];
  
  // sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModelDel");
  // releasedModelDel = sys.result["releasedModelDel"];

  // sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModelDel");
  // releasedPubModelDel = sys.result["releasedPubModelDel"];
  //   // 角色API
  // for (row in releasedRoleDel) {
  //   var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  //   se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + app_mod_api);
  // }
  // for (row in releasedPubRoleDel) {
  //   var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  //   se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + app_mod_api);
  // }
  // // 角色-模型
  // for (row in releasedModelDel) {
  //   se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + row["typecd"]);
  // }
  // for (row in releasedPubModelDel) {
  //   se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + row["typecd"]);
  // }
    var sqlReleasedRole="select role.roleid,api.appid,api.moduleid,api.apiid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_api_release api where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=api.roleid and role.status='1' and app.status='1' and api.status='1'";
    sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRoleDel");
    var releasedRoleDel = sys.result["releasedRoleDel"];
    var sqlReleasedPubRole="select api.appid,api.moduleid,api.apiid from sys_pl_application_release app, sys_pl_pub_api_release api where app.orgid=? and api.applicationid=app.applicationid and app.applicationid=? and app.status='1' and api.status='1'";
    sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRoleDel");
    var releasedPubRoleDel = sys.result["releasedPubRoleDel"];
    var sqlReleasedModel="select role.roleid,model.typecd from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_model_release model where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=model.roleid and role.status='1' and app.status='1' and model.status='1'";
    sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModelDel");
    var releasedModelDel = sys.result["releasedModelDel"];
    var sqlReleasedPubModel="select typecd from sys_pl_application_release app, sys_pl_pub_model_release model where app.orgid=? and model.applicationid=app.applicationid and app.applicationid=? and app.status='1' and model.status='1'";
    sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModelDel");
    var releasedPubModelDel = sys.result["releasedPubModelDel"];
    var sqlReleasedPage="select role.roleid,page.pageid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_page_release page where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=page.roleid and role.status='1' and app.status='1' and page.status='1'";
    sql.query(sqlReleasedPage, [orgid,applicationid], "releasedPageDel");
    var releasedPageDel = sys.result["releasedPageDel"];
    for (row in releasedRoleDel) {
      var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
      se.delCache(_CACHE_REGION_RBAC_, row["roleid"] + ":01:" + app_mod_api);
    }
    for (row in releasedPubRoleDel) {
      var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
      se.delCache(_CACHE_REGION_RBAC_, "01:" + app_mod_api);
    }
    for (row in releasedModelDel) {
      se.delCache(_CACHE_REGION_RBAC_, row["roleid"] + ":02:" + row["typecd"]);
    }
    for (row in releasedPubModelDel) {
      se.delCache(_CACHE_REGION_RBAC_, "02:" + row["typecd"]);
    }
    for (row in releasedPageDel) {
      se.delCache(_CACHE_REGION_RBAC_, row["roleid"] + ":04:" + row["pageid"]);
      se.delCache(_CACHE_REGION_RBAC_, row["roleid"] + ":05:" + row["pageid"]);
    }
}

sys.setRetData("0");