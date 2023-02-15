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
//"use strict";

// HTTP 请求参数
var orgid=sys.request.org;
var type = sys.request.type;
var appId = sys.request.appid;
var modId = sys.request.moduleid;
var apiId = sys.request.apiid;
var apiNm = sys.request.apinm;
var status = sys.request.status;
var op_type = sys.request.optype; //0=数据查询类；1=数据更新类
var help_info = sys.request.help_info;
var prjid = sys.request.prjid;   //项目id

// 验证必要参数
if (type == null || appId == null || modId == null || apiId == null) {
  sys.setRetData("1");
  return;
}

// 验证操作类型：0=新增；1=更新
if (type != "0" && type != "1") {
  sys.setRetData("2","参数type值不正确（值域：[0]新增, [1]更新）");
  return;
}

// 验证 APPID, ModuleID, APIID 是否已经存在
var sqlApiCnt = "select count(*) cnt from sys_apps, sys_modules, sys_apis where sys_apps.appid = sys_modules.appid and sys_apps.appid = sys_apis.appid and sys_apps.appflag = '0' and sys_modules.auflag = '0' and sys_apis.appid = ? and sys_apis.moduleid = ? and sys_apis.apiid = ?";
var paramApiCnt = [appId, modId, apiId];
var apiCnt=sql.query(sqlApiCnt, paramApiCnt, "apicnt");

// 获取PID
var pId = sys.getUserPID();
// 获取 roleid
var roleid = null;
var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
sql.query(sqlRole, [prjid], "roleidSet");
var roleidSet = sys.result["roleidSet"];
if (roleidSet!=null && sys.size(roleidSet)>0) {
	roleid=roleidSet[0]["roleid"];
}

// 新增API操作
if (type == "0") {
  // 存在：返回错误，处理结束 
  if (apiCnt != 0) {
    sys.setRetData(6);
    return;
  }

  // 根据请求数据向 apis 和 api_content 表中插入一条新数据
  var sqlApi = "insert into sys_apis (appid, moduleid, apiid, apinm, contentid, status, createdt, updatedt, op_type, help_info) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  var contentId = sys.getUUID();
  var newApiStatus = status;
  if (newApiStatus == null) {
    newApiStatus = "1";
  }
  if (op_type == null) {
    op_type = "1";
  }
  
  var codeTemplate = "B4EC06C696732A5500C6D15B00858396435E446673D6AF93E2B859AA74961FB89F9546AB791AC89C208AB58C26A80B231054D5AD0E78B0428798E50D52FA7C72";
  var currentTime = sys.getCurrentTimeString();
  var param = [appId, modId, apiId, apiNm, contentId, newApiStatus, currentTime, currentTime, op_type, help_info];
  var sqlApiContent = "insert into sys_api_content (contentid, stability, pid, updatedt, content) values (?, '00', ?, ?, ?)";
  var paramContent = [contentId,pId,currentTime, codeTemplate];

  // 执行添加数据操作
  var newApiCnt = sql.update(sqlApi, param, "1");
  if (newApiCnt == 0) {
    sql.rollback();
    sys.setRetData("5");
    return;
  }
  var newApiContentCnt = sql.update(sqlApiContent, paramContent, "1");
  if (newApiContentCnt == 0) {
    sql.rollback();
    sys.setRetData("5");
    return;
  }
  // 提交事务并返回
  sql.commit();

  //返回添加的数据
  var ret=[{"appid":appId,"moduleid":modId,"apiid":apiId,"apinm":apiNm,"contentid":contentId,"status":newApiStatus,"createdt":currentTime,"updatedt":currentTime,"appnm":"(开发中)"+apiNm,"someid":appId+"@"+modId+"@"+apiId,"isParent":true, "optype":op_type, "showid":apiId,"help_info":help_info}];
  sys.addRetData(ret,"result");
  //将创建的api付给项目id
  var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
  sql.update(authRoleSql,[roleid,appId,modId,apiId,"1",currentTime,currentTime]);
} else if (type == "1") { // 更新操作
  // 不存在：返回错误，处理结束 
  if (apiCnt == 0) {
    sys.setRetData(6);
    return;
  }

  // 根据请求数据更新 apis 数据
  var param = [];
  var sqlApi = "update sys_apis set ";
  if (apiNm != null) {
    sqlApi = sqlApi + "apinm = ?, ";
    param.push(apiNm);
  }
  if (status != null) {
    sqlApi = sqlApi + "status = ?, ";
    param.push(status);
  }
  if (op_type != null) {
    sqlApi = sqlApi + "op_type = ?, ";
    param.push(op_type);
  }
  sqlApi = sqlApi + "updatedt = ?, help_info = ? where appid = ? and moduleid = ? and apiid = ?";
  var dt=sys.getCurrentTimeString();
  param.push(dt);
  param.push(help_info);
  param.push(appId);
  param.push(modId);
  param.push(apiId);

  // 执行更新
  var updApiCnt = sql.update(sqlApi, param, "1");
  if (updApiCnt == 0) {
    sql.rollback();
    sys.setRetData("5");
    return;
  }

  // 提交事务并返回
  sql.commit();
  //查询api的稳定性状态
  var selectstability="select b.stability from sys_apis a , sys_api_content b where a.contentid=b.contentid  and a.appid = ? and a.moduleid = ? and a.apiid = ?";
  sql.query(selectstability,[appId,modId,apiId],"stability");
  var stability=sys.result.stability[0].stability;
  //获取stability数据字典缓存
  var tmpList = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0030");
  var name = "";
  
  if (status == null || status != '0') {
    if(tmpList != null){
      for(var i=0;i<tmpList.length;i++){
        if(tmpList[i].id == stability){
          name = tmpList[i].name;
        }
      }
    }
  } else {
    name = '无效';
  }
  
  var infonm="("+name+")";
  //返回添加的数据
  
  var ret=[{"appid":appId,"moduleid":modId,"apiid":apiId,"apinm":apiNm,"status":status,"updatedt":dt,"appnm":infonm+apiNm,"someid":appId+"@"+modId+"@"+apiId,"isParent":true, "optype":op_type,"help_info":help_info}];
  sys.addRetData(ret,"result");
}

//更新角色api缓存
var app_mod_api = sys.toLowerCase(appId + modId + apiId);
if(status != "0"){
   se.setCache(_CACHE_REGION_SYS_AUTHORITY_, orgid + ":" + roleid + ":" + app_mod_api, 0, 0);
   se.setCache(_CACHE_REGION_RBAC_, roleid + ":01:" + app_mod_api, 0, 0);
}else if(status == "0"){
   se.delCache(_CACHE_REGION_SYS_AUTHORITY_, orgid + ":" + roleid + ":" + app_mod_api);
   se.delCache(_CACHE_REGION_RBAC_, roleid + ":01:" + app_mod_api);
}
sys.setRetData("0", "ok", "result");