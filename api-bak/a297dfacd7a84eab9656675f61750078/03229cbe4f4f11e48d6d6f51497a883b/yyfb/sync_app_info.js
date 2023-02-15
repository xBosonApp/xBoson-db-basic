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
//cuiliang
var applicationid=sys.request.applicationid;
var rolemap={};
var sqlapp="select applicationid, applicationnm appnm, application_desc appinfo, intro_path, image_path, p_applicationid, excl, category, orgid, status, createdt, updatedt from sys_pl_application_release where applicationid=?";
var param=[applicationid];
sql.query(sqlapp,param,"create_app");
var create_app=sys.result.create_app[0];

// var sqlrole="select roleid,rolenm,role_desc as roleinfo,status as rolestatus from sys_pl_role_release where applicationid=?";
// sql.query(sqlrole,param,"approle");
// var approle=sys.result.approle;
// for(var a=0;a<sys.size(approle);a++){
//     map.put(rolemap,approle[a].roleid,approle[a].rolenm);
//     var sqlroleapi="select roleid,appid,moduleid,apiid from sys_pl_role_api_release where roleid=? and status='1'";
//     var paramrole_api=[approle[a].roleid];
//     sql.query(sqlroleapi,paramrole_api,"roleapi");
//     var roleapi=sys.result.roleapi;
//     map.put(approle[a],"roleapi",roleapi);
    
//     var sqlrolemodel="select typecd from sys_pl_role_model_release where roleid=? and status='1'";
//     sql.query(sqlrolemodel,paramrole_api,"model");
//     var model=sys.result.model;
//     var model1=[];
//     for(m in model){
//         list.add(model1,m.typecd);
//     }
//     map.put(approle[a],"model",model1);
// }
// map.put(create_app,"approle",approle);
// var sqlmenu="select roleid as menurole,menuid,menu_icon,menunm,uri as menuurl,menu_desc as menuinfo,status as menustatus from sys_pl_menu_release where applicationid=?";
// sql.query(sqlmenu,param,"appmenu");
// var appmenu=sys.result.appmenu;

// for(var i=0;i<sys.size(appmenu);i++){
//   var rolenm="";  
//     var menuroles=sys.split(appmenu[i].menurole,",");
//     for(b in menuroles){
//         rolenm=rolenm+","+rolemap[b];
//     }
//     map.put(appmenu[i],"menurole",sys.subString(rolenm,1));
// }
// map.put(create_app,"appmenu",appmenu);

// role
sql.query("select roleid,local_roleid from sys_pl_role_release where applicationid=?",param,"applicationrole");
map.put(create_app,"role",sys.result.applicationrole);

//publicapi
var sql_role_api="select applicationid,appid,moduleid,apiid from sys_pl_pub_api_release where applicationid=?";
var param_api_pub=[applicationid];
sql.query(sql_role_api,param_api_pub,"publicapi");
var publicapi=sys.result.publicapi;
var publicapis=[];
var approlemap={};
map.put(approlemap,"publicapi",publicapi);
list.add(publicapis,approlemap);
map.put(create_app,"publicapis",publicapis);
//publicmodel

var sqlpublicmodel="select typecd from sys_pl_pub_model_release where applicationid=?";
sql.query(sqlpublicmodel,param_api_pub,"publicmodel");
var publicmodel1=sys.result.publicmodel;
var publicmodel=[];
for(l in publicmodel1){
    list.add(publicmodel,l.typecd);
}
map.put(create_app,"publicmodel",publicmodel);
sys.addRetData([create_app],"result");
sys.setRetData("0","", "result");