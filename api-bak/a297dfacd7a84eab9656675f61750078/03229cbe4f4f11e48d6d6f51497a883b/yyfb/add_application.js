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
var application_desc=param_appcreate.appinfo;
var image_path=param_appcreate.image_path;
var p_applicationid=param_appcreate.p_application_id;
var appmenu=param_appcreate.appmenu;
var approle=param_appcreate.approle;
var publicapi =param_appcreate.publicapi;
var publicmodel=param_appcreate.publicmodel;
var intro_path=param_appcreate.intro_path;
var excl=param_appcreate.excl;
var category=param_appcreate.category;
var orgid = sys.request.org;
var dt = sql.currentDBTimeString();
var hisid=sys.uuid();
var applicationid=sys.uuid();
var rolemap={};

//@sys_pl_application_release
var param=[applicationid,applicationnm,application_desc,intro_path,image_path,p_applicationid, excl, category,orgid,"1",dt,dt];
var sqlcreate="insert into sys_pl_application_release (applicationid,applicationnm,application_desc,intro_path,image_path,p_applicationid, excl, category,orgid,status,createdt,updatedt) values(?,?,?,?,?,?,?,?,?,?,?,?)";
if(sql.update(sqlcreate,param,"1")==0){
  sys.setRetData(5);
  sql.rollback();
  return;
}
//@sys_pl_application_release_his
var param2=[applicationid,hisid,"初始提交",dt];
var sqlhis="insert into sys_pl_application_release_his (applicationid,hisid,mark,updatedt) values (?,?,?,?)";
if(sql.update(sqlhis,param2,"1")==0){
  sys.setRetData(5);
  sql.rollback();
  return;
}
//@sys_pl_role_release
var rolesize=sys.size(approle);
if(rolesize>=1){
  var sqlrole="insert into sys_pl_role_release (roleid,rolenm,role_desc,applicationid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
  var paramroles=[];
  for(a in approle){//角色
    var roleid=sys.uuid();
    map.put(rolemap,a["rolenm"],roleid);
    list.add(paramroles,[roleid,a["rolenm"],a["roleinfo"],applicationid,"1",dt,dt]); 

    //@sys_pl_role_api_release
    var sqlrole_api="insert into sys_pl_role_api_release (roleid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
    var param_role_apis=[];
    var roleapi=a["roleapi"];
    for(b in roleapi){
      sql.query("select help_info from sys_apis where appid=? and moduleid=? and apiid=?",[b["appid"],b["moduleid"],b["apiid"]],"help_info_r");
      var help_info_r=sys.result.help_info_r;
      if(sys.size(help_info_r)==0){
          sys.setRetData("1","获取api帮助信息异常");
          return;
      }
      list.add(param_role_apis,[roleid,b["appid"],b["moduleid"],b["apiid"],dt,dt,help_info_r[0].help_info]);
    }
    var role_api_count=sql.updateBatch(sqlrole_api,param_role_apis,"1");
//@sys_pl_role_model_release    
    var typecd=a["model"];
    var parammodel=[];
    for(t in typecd){
        list.add(parammodel,[roleid,t,"1",dt,dt]);
    }
    var sqlmodel="insert into sys_pl_role_model_release (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
    sql.updateBatch(sqlmodel,parammodel,"1");
    
  }   
  var rolecount=sql.updateBatch(sqlrole,paramroles,"1");
}


//@sys_pl_menu_release
var menusize=sys.size(appmenu);
if(menusize>=1){
  var sqlmenu="insert into sys_pl_menu_release (menuid,menu_icon,menunm,uri,roleid,menu_desc,applicationid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?)";
  var param_menus=[];
  for(c in appmenu){
    var menuid=sys.uuid();
    var menuroles=sys.split(c["menurole"],",");
    var menurole_get="";
    for(v in menuroles){
      var roleid_menu=map.get(rolemap,v);
      menurole_get=menurole_get+","+roleid_menu;
    }
    var param_menu=[menuid,c["menu_icon"],c["menunm"],c["menuurl"],sys.subString(menurole_get,1),c["menuinfo"],applicationid,"1",dt,dt];//roleid待确定
    list.add(param_menus,param_menu);
  }
  var menu_count=sql.updateBatch(sqlmenu,param_menus,"1");
  if(menu_count!=menusize){
    sql.rollback();
    sys.setRetData(5);
    return;
  }
}
//@sys_pl_biz_application
var sql_biz="insert into sys_pl_biz_application (applicationid,biz_status,mark,status,createdt,updatedt) values (?,?,?,?,?,?)";
var param_biz=[applicationid,"00","初始提交","1",dt,dt];
sql.update(sql_biz,param_biz,"1");

//@sys_pl_pub_api_release
if(null!=publicapi){
  var sqlpub_api="insert into sys_pl_pub_api_release (applicationid,appid,moduleid,apiid,status,createdt,updatedt,help_info) values (?,?,?,?,'1',?,?,?)";
  var param_pub_apis=[];
  var pub_api=publicapi;
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
//@sys_pl_pub_model_release
if(publicmodel!=null){
    var sqlpub_model="insert into sys_pl_pub_model_release (applicationid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
    var param_pub_model=[];
    for(m in publicmodel){
        list.add(param_pub_model,[applicationid,m,"1",dt,dt]);
    }
    sql.updateBatch(sqlpub_model,param_pub_model,"1");
}
sql.commit();

sys.setRetData("0");
se.sendAppReleased();