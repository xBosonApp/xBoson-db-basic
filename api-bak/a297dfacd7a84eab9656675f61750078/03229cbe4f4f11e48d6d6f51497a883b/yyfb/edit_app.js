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
//崔亮
var create_app=sys.request.create_app;
var param_appcreate=sys.instanceFromJson(create_app);
var applicationnm = param_appcreate.appnm;
var mark=param_appcreate.mark;
var application_desc=param_appcreate.appinfo;
var image_path=param_appcreate.image_path;
var p_applicationid=param_appcreate.p_application_id;
var applicationid=param_appcreate.applicationid;
var appmenu=param_appcreate.appmenu;
var approle=param_appcreate.approle;
var intro_path=param_appcreate.intro_path;
var excl=param_appcreate.excl;
var category=param_appcreate.category;
var publicapi =param_appcreate.publicapi;
var publicmodel =param_appcreate.publicmodel;
var hisid=sys.uuid();
var orgid = sys.request.org;
var dt = sql.currentDBTimeString();
var rolemap={};

//该应用的运营状态
var bizStatus = null;
var sqlBiz = "select biz_status from sys_pl_biz_application where applicationid=? and  status='1'";
sql.query(sqlBiz, [applicationid], "biz");
var bizResult = sys.result["biz"];
if (bizResult!=null && sys.size(bizResult)>0 && bizResult[0]["biz_status"]=="20") {
    bizStatus = bizResult[0]["biz_status"];
}

var sqlReleasedRole = "";
var sqlReleasedPubRole = "";
var sqlReleasedModel = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0020");
var sqlReleasedPubModel = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0019");
var releasedRoleDel = null;
var releasedPubRoleDel = null;
var releasedModelDel = null;
var releasedPubModelDel = null;
if (bizStatus=="20") {
  //删除缓存使用
  sqlReleasedRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0018");
  sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRoleDel");
  releasedRoleDel = sys.result["releasedRoleDel"];

  sqlReleasedPubRole = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0017");
  sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRoleDel");
  releasedPubRoleDel = sys.result["releasedPubRoleDel"];
  
  // 角色模型
  sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModelDel");
  releasedModelDel = sys.result["releasedModelDel"];

  sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModelDel");
  releasedPubModelDel = sys.result["releasedPubModelDel"];
}

//@sys_pl_application_release
var param=[applicationnm,application_desc,image_path,p_applicationid,"1",dt,excl,category,intro_path,applicationid];
var sqlupdate="update sys_pl_application_release set applicationnm=?,application_desc=?,image_path=?,p_applicationid=?,status=?,updatedt=?,excl=?, category=?,intro_path=? where applicationid=?";
var docount=sql.update(sqlupdate,param,"1");
if(docount==0){
    sys.setRetData(5);
    return;
}
//@sys_pl_application_release_his
var sqlhis="insert into sys_pl_application_release_his (applicationid,hisid,mark,updatedt) values (?,?,?,?)";
var param2=[applicationid,hisid,mark,dt];
var hiscount=sql.update(sqlhis,param2,"1");
if(hiscount==0){
    sys.setRetData(5);
    return;
}
//@sys_pl_role_release
var rolesize=sys.size(approle);
if(rolesize>=1){
    var sqlrole="insert into sys_pl_role_release (roleid,rolenm,role_desc,applicationid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
    var roledel="delete from sys_pl_role_release where applicationid=?";
    sql.update(roledel,[applicationid],"1");
    var role_params=[];
    for(a in approle){//角色
      var roleid_a=a["roleid"];
      if(roleid_a==null||roleid_a==""){
        roleid_a=sys.uuid();
      }
      var paramrole=[roleid_a,a["rolenm"],a["roleinfo"],applicationid,"1",dt,dt];
      list.add(role_params,paramrole);
      map.put(rolemap,a["rolenm"],a["roleid"]);
    
      //@sys_pl_role_api_release
      var sqlrole_api="insert into sys_pl_role_api_release (roleid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
      var param_role_apis=[];
      var roleapi=a["roleapi"];
      var apisize=sys.size(roleapi);
      var sql_apidel="delete from sys_pl_role_api_release where roleid=?  ";
      if(a["roleid"]!=null){
        sql.update(sql_apidel,[roleid_a],"1");
      }
      for(b in roleapi){
          sql.query("select help_info from sys_apis where appid=? and moduleid=? and apiid=?",[b["appid"],b["moduleid"],b["apiid"]],"help_info_r");
          var help_info_r=sys.result.help_info_r;
          if(sys.size(help_info_r)==0){
              sys.setRetData("1","获取api帮助信息异常");
              return;
          }
          var param_role_api=[roleid_a,b["appid"],b["moduleid"],b["apiid"],dt,dt,help_info_r[0].help_info];
          list.add(param_role_apis,param_role_api);
      }
      var role_api_count=sql.updateBatch(sqlrole_api,param_role_apis,"1");
      
      //@sys_pl_role_model_release 
      var modeldel="delete from sys_pl_role_model_release where roleid=?";
    sql.update(modeldel,[roleid_a],"1");
    var typecd=a["model"];
    var parammodel=[];
    for(t in typecd){
        list.add(parammodel,[roleid_a,t,"1",dt,dt]);
    }
    var sqlmodel="insert into sys_pl_role_model_release (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
    sql.updateBatch(sqlmodel,parammodel,"1");
    } 
    sql.updateBatch(sqlrole,role_params,"1");
}
//@sys_pl_menu_release
var menusize=sys.size(appmenu);

var sqlmenu="insert into sys_pl_menu_release (menuid,menu_icon,menunm,uri,roleid,menu_desc,applicationid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?)";
var parammenus=[];
var del_menu="delete from sys_pl_menu_release where applicationid=?";
sql.update(del_menu,[applicationid],"1");
for(c in appmenu){
    var menuid_c=c["menuid"];
    if(menuid_c==null||menuid_c==""){
        menuid_c=sys.uuid();
    }

    var rolenm_menu=c["menurole"];
    var arr_rolemenu=sys.split(rolenm_menu,",");
    var rolemenu_get="";
    for(x in arr_rolemenu){
        var roleid_menu=map.get(rolemap,x);
        rolemenu_get=rolemenu_get+","+roleid_menu;
    }
    var param_menu=[menuid_c,c["menu_icon"],c["menunm"],c["menuurl"],sys.subString(rolemenu_get,1),c["menuinfo"],applicationid,"1",dt,dt];
    list.add(parammenus,param_menu);
}
sql.updateBatch(sqlmenu,parammenus,"1");

if(null!=publicapi){
    //@sys_pl_pub_api_release
    var sql_api_del="delete from sys_pl_pub_api_release where applicationid=?";
    sql.update(sql_api_del,[applicationid],"1");
    var sqlpub_api="insert into sys_pl_pub_api_release (applicationid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
    var param_pub_apis=[];
    var pub_api=publicapi;
    var pub_apisize=sys.size(pub_api);
    for(d in pub_api){
        sql.query("select help_info from sys_apis where appid=? and moduleid=? and apiid=?",[d["appid"],d["moduleid"],d["apiid"]],"help_info_r");
        help_info_r=sys.result.help_info_r;
        if(sys.size(help_info_r)==0){
          sys.setRetData("1","获取api帮助信息异常");
          return;
        }
        var param_pub_api=[applicationid,d["appid"],d["moduleid"],d["apiid"],dt,dt,help_info_r[0].help_info];
        list.add(param_pub_apis,param_pub_api);
    }
    sql.updateBatch(sqlpub_api,param_pub_apis,"1");
}

if(null!=publicmodel){
    //@sys_pl_pub_api_release
    var sql_model_del="delete from sys_pl_pub_model_release where applicationid=?";
    sql.update(sql_model_del,[applicationid],"1");
    var sqlpub_model="insert into sys_pl_pub_model_release (applicationid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
    var param_pub_model=[];
    var pub_model=publicmodel;
    var pub_modelsize=sys.size(publicmodel);
    for(d in pub_model){

        list.add(param_pub_model,[applicationid,d,"1",dt,dt]);
    }
    sql.updateBatch(sqlpub_model,param_pub_model,"1");
}
sql.commit();

// 只更新上线的应用的缓存数据
if (bizStatus=="20") {
  // 删除旧的
  for (row in releasedRoleDel) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + app_mod_api);
  }
  for (row in releasedPubRoleDel) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + app_mod_api);
  }
  for (row in releasedModelDel) {
    se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + row["typecd"]);
  }
  for (row in releasedPubModelDel) {
    se.delCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + row["typecd"]);
  }

  // 缓存已发布应用（普通）角色 API 信息
  // orgid : roleid : appid + moduleid + apiid
  sql.query(sqlReleasedRole, [orgid,applicationid], "releasedRole");
  var releasedRole = sys.result["releasedRole"];
  for (row in releasedRole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + app_mod_api, 0, 0);
  }
  sql.query(sqlReleasedPubRole, [orgid,applicationid], "releasedPubRole");
  var releasedPubRole = sys.result["releasedPubRole"];
  for (row in releasedPubRole) {
    var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + app_mod_api, 0, 0);
  }
  // 缓存已发布应用（普通）角色 模型 信息
  // orgid : roleid : modelcd
  sql.query(sqlReleasedModel, [orgid,applicationid], "releasedModel");
  var releasedModel = sys.result["releasedModel"];
  for (row in releasedModel) {
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_normal:" + row["roleid"] + ":" + row["typecd"], 0, 0);
  }
  sql.query(sqlReleasedPubModel, [orgid,applicationid], "releasedPubModel");
  var releasedPubModel = sys.result["releasedPubModel"];
  for (row in releasedPubModel) {
    se.setCache(_CACHE_REGION_SYS_AUTHORITY_, "application_pub:" + row["typecd"], 0, 0);
  }
}

sys.setRetData("0");
se.sendAppReleased();