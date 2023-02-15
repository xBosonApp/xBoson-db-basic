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
// applicationmaint 应用维护 添加更新
var op_type=sys.request.op_type;
var create_app=sys.request.create_app;
var param_appcreate=sys.instanceFromJson(create_app);
var applicationid=param_appcreate.applicationid;
var applicationnm=param_appcreate.appnm;
var application_desc=param_appcreate.appinfo;
var image_path=param_appcreate.image_path;
var p_applicationid=param_appcreate.p_application_id;
var intro_path=param_appcreate.intro_path;
var excl=param_appcreate.excl;
var category=param_appcreate.category;
var role=param_appcreate.role;
var publicapi=param_appcreate.publicapi;
var publicmodel=param_appcreate.publicmodel;
var hisid=sys.uuid();
var mark=param_appcreate.mark;
var orgid=sys.request.org;
var dt=date.currentTimeString();

//@sys_pl_application_release_his
var sqlhis="insert into sys_pl_application_release_his (applicationid,hisid,mark,updatedt) values (?,?,?,?)";
//@sys_pl_role_release
var sqlrole="insert into sys_pl_role_release (roleid,rolenm,role_desc,applicationid,local_roleid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
var paramroles=[];
//@sys_pl_role_api_release
var sqlrole_api="insert into sys_pl_role_api_release (roleid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
var paramapis = [];
//@sys_pl_role_model_release 
var sqlmodel="insert into sys_pl_role_model_release (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
var parammodels = [];
//@sys_pl_menu_release
var sqlmenu="insert into sys_pl_menu_release (menuid,menu_icon,menunm,pageid,uri,menu_desc,applicationid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?)";
var parammenus = [];
//@sys_pl_role_menu_release
var sqlrolemenu="insert into sys_pl_role_menu_release (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)";
var paramrolemenus = [];
//@sys_pl_role_page_release
var sqlpage="insert into sys_pl_role_page_release (roleid,pageid,status,createdt,updatedt) values (?,?,?,?,?)";
var parampages = [];
//@sys_pl_role_pe_release
var sqlpe="insert into sys_pl_role_pe_release (roleid,pageid,elementid,element_status,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
var parampes = [];
//@sys_pl_pub_api_release
var sqlpub_api="insert into sys_pl_pub_api_release (applicationid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
var param_pub_apis=[];
//@sys_pl_pub_model_release
var sqlpub_model="insert into sys_pl_pub_model_release (applicationid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
var param_pub_model=[];
if (op_type=="i") {
  applicationid=sys.uuid();
  //@sys_pl_application_release
  var param=[applicationid,applicationnm,application_desc,intro_path,image_path,p_applicationid, excl, category,orgid,"1",dt,dt];
  var sqlcreate="insert into sys_pl_application_release (applicationid,applicationnm,application_desc,intro_path,image_path,p_applicationid, excl, category,orgid,status,createdt,updatedt) values(?,?,?,?,?,?,?,?,?,?,?,?)";
  //@sys_pl_biz_application
  var sql_biz="insert into sys_pl_biz_application (applicationid,biz_status,mark,status,createdt,updatedt) values (?,?,?,?,?,?)";

  var tmpMenuList = [];
  for(roleid in role){
    var newRoleid = sys.uuid();
    sql.query("select rolenm,role_desc from sys_role where roleid=?",[roleid],"localrole");
    var lr = sys.result["localrole"];
    list.add(paramroles,[newRoleid,lr[0]["rolenm"],lr[0]["roleinfo"],applicationid,roleid,"1",dt,dt]);

    sql.query("select r.appid,r.moduleid,r.apiid,a.help_info from sys_role_api r,sys_apis a where r.appid=a.appid and r.moduleid=a.moduleid and r.apiid=a.apiid and a.status='1' and r.roleid=?",[roleid],"apis");
    for (api in sys.result["apis"]) {
      list.add(paramapis,[newRoleid,api["appid"],api["moduleid"],api["apiid"],dt,dt,api["help_info"]]);
    }

    sql.query("select typecd from sys_role_model where roleid=?",[roleid],"models");
    for (model in sys.result["models"]) {
      list.add(parammodels,[newRoleid,model["typecd"],"1",dt,dt]);
    }

    sql.query("select m.menuid,m.menu_icon,m.menunm,m.pageid,m.uri,m.menu_desc from sys_role_menu r,sys_menu m where r.roleid=? and r.menuid=m.menuid",[roleid],"menus");
    for (menu in sys.result["menus"]) {
      var menuid = menu["menuid"];
      if (!list.contain(tmpMenuList,menuid)) {
        list.add(parammenus,[menuid,menu["menu_icon"],menu["menunm"],menu["pageid"],menu["uri"],menu["menu_desc"],applicationid,"1",dt,dt]);
        list.add(tmpMenuList,menuid);
      }
    }

    sql.query("select menuid from sys_role_menu where roleid=?",[roleid],"rolemenus");
    for (row in sys.result["rolemenus"]) {
      list.add(paramrolemenus,[newRoleid,row["menuid"],"1",dt,dt]);
    }

    sql.query("select pageid from sys_role_page where roleid=?",[roleid],"pages");
    for (page in sys.result["pages"]) {
      list.add(parampages,[newRoleid,page["pageid"],"1",dt,dt]);
    }

    sql.query("select pageid,elementid,element_status from sys_role_pe where roleid=?",[roleid],"pes");
    for (pe in sys.result["pes"]) {
      list.add(parampes,[newRoleid,pe["pageid"],pe["elementid"],pe["element_status"],"1",dt,dt]);
    }
  }
  if(null!=publicapi){
    for(d in publicapi){
      sql.query("select help_info from sys_apis where appid=? and moduleid=? and apiid=?",[d["appid"],d["moduleid"],d["apiid"]],"help_info_r");
      list.add(param_pub_apis,[applicationid,d["appid"],d["moduleid"],d["apiid"],dt,dt,sys.result["help_info_r"][0].help_info]);
    }
  }
  if(publicmodel!=null){
    for(m in publicmodel){
      list.add(param_pub_model,[applicationid,m,"1",dt,dt]);
    }
  }

  sql.update(sqlcreate,param,"1");
  sql.update(sqlhis,[applicationid,hisid,"初始提交",dt],"1");
  if (sys.size(paramroles)>0) {
    sql.updateBatch(sqlrole,paramroles,"1");
  }
  if (sys.size(paramapis)>0) {
    sql.updateBatch(sqlrole_api,paramapis,"1");
  }
  if (sys.size(parammodels)>0) {
    sql.updateBatch(sqlmodel,parammodels,"1");
  }
  if (sys.size(parammenus)>0) {
    sql.updateBatch(sqlmenu,parammenus,"1");
  }
  if (sys.size(paramrolemenus)>0) {
    sql.updateBatch(sqlrolemenu,paramrolemenus,"1");
  }
  if (sys.size(parampages)>0) {
    sql.updateBatch(sqlpage,parampages,"1");
  }
  if (sys.size(parampes)>0) {
    sql.updateBatch(sqlpe,parampes,"1");
  }
  sql.update(sql_biz,[applicationid,"00","初始提交","1",dt,dt],"1");
  if (sys.size(param_pub_apis)>0) {
    sql.updateBatch(sqlpub_api,param_pub_apis,"1");
  }
  if (sys.size(param_pub_model)>0) {
    sql.updateBatch(sqlpub_model,param_pub_model,"1");
  }
  sql.commit();
} else {
  //该应用的运营状态
  var bizStatus = null;
  var sqlBiz = "select biz_status from sys_pl_biz_application where applicationid=? and  status='1'";
  sql.query(sqlBiz, [applicationid], "biz");
  var bizResult = sys.result["biz"];
  if (bizResult!=null && sys.size(bizResult)>0 && bizResult[0]["biz_status"]=="20") {
    bizStatus = bizResult[0]["biz_status"];
  }
  var sqlReleasedRole = null;
  var sqlReleasedPubRole = null;
  var sqlReleasedModel = null;
  var sqlReleasedPubModel = null;
  var sqlReleasedPage = null;
  var sqlReleasedPe = null;
  var releasedRoleDel = null;
  var releasedPubRoleDel = null;
  var releasedModelDel = null;
  var releasedPubModelDel = null;
  var releasedPageDel = null;
  if (bizStatus=="20") {
    sqlReleasedRole="select role.roleid,api.appid,api.moduleid,api.apiid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_api_release api where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=api.roleid and role.status='1' and app.status='1' and api.status='1'";
    sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRoleDel");
    releasedRoleDel = sys.result["releasedRoleDel"];
    sqlReleasedPubRole="select api.appid,api.moduleid,api.apiid from sys_pl_application_release app, sys_pl_pub_api_release api where app.orgid=? and api.applicationid=app.applicationid and app.applicationid=? and app.status='1' and api.status='1'";
    sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRoleDel");
    releasedPubRoleDel = sys.result["releasedPubRoleDel"];
    sqlReleasedModel="select role.roleid,model.typecd from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_model_release model where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=model.roleid and role.status='1' and app.status='1' and model.status='1'";
    sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModelDel");
    releasedModelDel = sys.result["releasedModelDel"];
    sqlReleasedPubModel="select typecd from sys_pl_application_release app, sys_pl_pub_model_release model where app.orgid=? and model.applicationid=app.applicationid and app.applicationid=? and app.status='1' and model.status='1'";
    sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModelDel");
    releasedPubModelDel = sys.result["releasedPubModelDel"];
    sqlReleasedPage="select role.roleid,page.pageid from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_page_release page where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=page.roleid and role.status='1' and app.status='1' and page.status='1'";
    sql.query(sqlReleasedPage, [orgid,applicationid], "releasedPageDel");
    releasedPageDel = sys.result["releasedPageDel"];
    sqlReleasedPe="select role.roleid,pe.pageid,pe.elementid,pe.element_status from sys_pl_role_release role,sys_pl_application_release app, sys_pl_role_pe_release pe where app.orgid=? and role.applicationid=app.applicationid and app.applicationid=? and role.roleid=pe.roleid and role.status='1' and app.status='1' and pe.status='1'";
  }

  //@sys_pl_application_release
  var param=[applicationnm,application_desc,image_path,p_applicationid,"1",dt,excl,category,intro_path,applicationid];
  var sqlupdate="update sys_pl_application_release set applicationnm=?,application_desc=?,image_path=?,p_applicationid=?,status=?,updatedt=?,excl=?, category=?,intro_path=? where applicationid=?";
  sql.update(sqlupdate,param,"1");
  sql.update(sqlhis,[applicationid,hisid,mark,dt],"1");
  
  if (role != null && sys.size(role) > 0) {
    var tmpMenuList = [];
    for(roleid in role){
      sql.query("select roleid,rolenm,role_desc,applicationid,local_roleid,status,createdt,updatedt from sys_pl_role_release where applicationid=? and local_roleid=?",[applicationid,roleid],"existingrole");
      var existingrole=sys.result["existingrole"];
      var newRoleid;
      if (sys.size(existingrole)==0) {
        newRoleid = sys.uuid();
        sql.query("select rolenm,role_desc from sys_role where roleid=?",[roleid],"localrole");
        var lr = sys.result["localrole"];
        list.add(paramroles,[newRoleid,lr[0]["rolenm"],lr[0]["roleinfo"],applicationid,roleid,"1",dt,dt]);
      } else {
        var er = existingrole[0];
        newRoleid = er["roleid"];
        list.add(paramroles,[newRoleid,er["rolenm"],er["role_desc"],er["applicationid"],er["local_roleid"],er["status"],er["createdt"],er["updatedt"]]);
        sql.update("delete from sys_pl_role_api_release where roleid=?",[newRoleid],"1");
        sql.update("delete from sys_pl_role_model_release where roleid=?",[newRoleid],"1");
        sql.update("delete from sys_pl_role_menu_release where roleid=?",[newRoleid],"1");
        sql.update("delete from sys_pl_role_page_release where roleid=?",[newRoleid],"1");
        sql.update("delete from sys_pl_role_pe_release where roleid=?",[newRoleid],"1");
      }

      sql.query("select r.appid,r.moduleid,r.apiid,a.help_info from sys_role_api r,sys_apis a where r.appid=a.appid and r.moduleid=a.moduleid and r.apiid=a.apiid and a.status='1' and r.roleid=?",[roleid],"apis");
      for (api in sys.result["apis"]) {
        list.add(paramapis,[newRoleid,api["appid"],api["moduleid"],api["apiid"],dt,dt,api["help_info"]]);
      }

      sql.query("select typecd from sys_role_model where roleid=?",[roleid],"models");
      for (model in sys.result["models"]) {
        list.add(parammodels,[newRoleid,model["typecd"],"1",dt,dt]);
      }

      sql.query("select m.menuid,m.menu_icon,m.menunm,m.pageid,m.uri,m.menu_desc from sys_role_menu r,sys_menu m where r.roleid=? and r.menuid=m.menuid",[roleid],"menus");
      for (menu in sys.result["menus"]) {
        var menuid = menu["menuid"];
        if (!list.contain(tmpMenuList,menuid)) {
          list.add(parammenus,[menuid,menu["menu_icon"],menu["menunm"],menu["pageid"],menu["uri"],menu["menu_desc"],applicationid,"1",dt,dt]);
          list.add(tmpMenuList,menuid);
        }
      }

      sql.query("select menuid from sys_role_menu where roleid=?",[roleid],"rolemenus");
      for (row in sys.result["rolemenus"]) {
        list.add(paramrolemenus,[newRoleid,row["menuid"],"1",dt,dt]);
      }

      sql.query("select pageid from sys_role_page where roleid=?",[roleid],"pages");
      for (page in sys.result["pages"]) {
        list.add(parampages,[newRoleid,page["pageid"],"1",dt,dt]);
      }

      sql.query("select pageid,elementid,element_status from sys_role_pe where roleid=?",[roleid],"pes");
      for (pe in sys.result["pes"]) {
        list.add(parampes,[newRoleid,pe["pageid"],pe["elementid"],pe["element_status"],"1",dt,dt]);
      }
    }
    sql.update("delete from sys_pl_role_release where applicationid=?",[applicationid],"1");
    sql.update("delete from sys_pl_menu_release where applicationid=?",[applicationid],"1");
    if (sys.size(paramroles)>0) {
      sql.updateBatch(sqlrole,paramroles,"1");
    }
    if (sys.size(paramapis)>0) {
      sql.updateBatch(sqlrole_api,paramapis,"1");
    }
    if (sys.size(parammodels)>0) {
      sql.updateBatch(sqlmodel,parammodels,"1");
    }
    if (sys.size(parammenus)>0) {
      sql.updateBatch(sqlmenu,parammenus,"1");
    }
    if (sys.size(paramrolemenus)>0) {
      sql.updateBatch(sqlrolemenu,paramrolemenus,"1");
    }
    if (sys.size(parampages)>0) {
      sql.updateBatch(sqlpage,parampages,"1");
    }
    if (sys.size(parampes)>0) {
      sql.updateBatch(sqlpe,parampes,"1");
    }
  }

  if(null!=publicapi){
    for(d in publicapi){
      sql.query("select help_info from sys_apis where appid=? and moduleid=? and apiid=?",[d["appid"],d["moduleid"],d["apiid"]],"help_info_r");
      list.add(param_pub_apis,[applicationid,d["appid"],d["moduleid"],d["apiid"],dt,dt,sys.result["help_info_r"][0].help_info]);
    }
  }
  if(publicmodel!=null){
    for(m in publicmodel){
      list.add(param_pub_model,[applicationid,m,"1",dt,dt]);
    }
  }
  sql.update("delete from sys_pl_pub_api_release where applicationid=?",[applicationid],"1");
  sql.update("delete from sys_pl_pub_model_release where applicationid=?",[applicationid],"1");
  if (sys.size(param_pub_apis)>0) {
    sql.updateBatch(sqlpub_api,param_pub_apis,"1");
  }
  if (sys.size(param_pub_model)>0) {
    sql.updateBatch(sqlpub_model,param_pub_model,"1");
  }
  sql.commit();

  // 只更新上线的应用的缓存数据
  if (bizStatus=="20") {
    // 删除旧的
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
  }
}
sys.setRetData("0");
se.sendAppReleased();