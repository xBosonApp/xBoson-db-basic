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
//项目
var sqlitem="select roleid,rolenm,rolenm name,op_type,role_type,role_desc,status,createdt,updatedt from sys_role where role_type='02'";
sql.query(sqlitem,null,"item_r");
var in_roleid="";
for(r in sys.result.item_r){
  in_roleid=in_roleid+",'"+r.roleid+"'";
}
in_roleid=sys.subString(in_roleid,1);

if(sys.size(sys.result.item_r)>0){
  //项目app
  var sqlapp="select distinct b.roleid,a.appid,a.appnm,a.appnm name,a.about,a.appflag,a.status,a.createdt,a.updatedt from sys_apps a,sys_role_api b where a.appid=b.appid and b.roleid in ("+in_roleid+")";
  sql.query(sqlapp,null,"app_r");
  //mod
  var sqlmod="select distinct b.roleid,a.appid,a.moduleid,a.modulenm,a.modulenm name,a.about,a.auflag,a.status,a.createdt,a.updatedt from sys_modules a,sys_role_api b where a.appid=b.appid and a.moduleid=b.moduleid and b.roleid in ("+in_roleid+")";
  sql.query(sqlmod,null,"mod_r");
  //api
  var sqlapi="select distinct b.roleid,a.appid,a.moduleid,a.apiid,a.apinm,a.apinm name,a.op_type,a.contentid,a.help_info,a.status,a.createdt,a.updatedt from sys_apis a,sys_role_api b where a.appid=b.appid and a.moduleid=b.moduleid and a.apiid=b.apiid and b.roleid in ("+in_roleid+")";
  sql.query(sqlapi,null,"api_r");
  
  //合并记录
  sys.setRetList(sys.result.mod_r,sys.result.api_r,[["appid","appid"],["moduleid","moduleid"]],"children");
  sys.setRetList(sys.result.app_r,sys.result.mod_r,[["appid","appid"]],"children");
  sys.setRetList(sys.result.item_r,sys.result.app_r,[["roleid","roleid"]],"children");
  sys.addRetData(sys.result.item_r,"result");
  sys.setRetData("0","","result");
}else{
  sys.addRetData([],"result");
  sys.setRetData("0","","result");
}