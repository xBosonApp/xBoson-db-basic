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
// HTTP 请求参数
var type = sys.request.type;
var appId = sys.request.appid;
var modId = sys.request.moduleid;
var apiId = sys.request.apiid;
var apiNm = sys.request.apinm;
var status = sys.request.status;
var orgid=sys.request.org;
var help_info = sys.request.help_info;
var prjid=sys.request.prjid;
if(prjid == null){
  sys.setRetData("1","项目ID为空");
  return;
}
// 验证必要参数
if (type == null) {
	sys.setRetData("1","维护类型为空");
	return;
}
// 验证必要参数
if (appId == null || modId == null || apiId == null) {
	sys.setRetData("1","APP或模型ID或APIID为空");
	return;
}
if (! /^[A-Za-z0-9_]{4,}$/.test(apiId)) {
  sys.setRetData("1","接口ID只能是字母数字下划线, 大于4个字符");
  return;
}
// 验证操作类型
if (type != "0" && type != "1") {
	sys.setRetData("2","维护类型错误");
	return;
}

// 验证 APPID, ModuleID, APIID 是否已经存在
var sqlApiCnt = "select count(*) cnt from sys_apps sys_apps, sys_modules sys_modules, sys_apis sys_apis where sys_apps.appid = sys_modules.appid and sys_apps.appid = sys_apis.appid and sys_apps.appflag = '0' and sys_modules.auflag = '0' and sys_apis.appid = ? and sys_apis.moduleid = ? and sys_apis.apiid = ?";
var paramApiCnt = [appId, modId, apiId];
sql.query(sqlApiCnt, paramApiCnt, "apicnt");
var apiCntRet = sys.result.apicnt;
var apiCnt = "";
for (acr in apiCntRet) {
	apiCnt = acr.cnt;
}

// 获取PID
var pId = sys.getUserPID();
var currentTime = date.currentTimeString();

// 获取 roleid
var roleid = null;
var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
sql.query(sqlRole, [prjid], "roleidSet");
var roleidSet = sys.result["roleidSet"];
if (roleidSet!=null && sys.size(roleidSet)>0) {
	roleid=roleidSet[0]["roleid"];
}
if (type == "0") {  // 创建操作
	// 存在：返回错误，处理结束 
	if (apiCnt != "0") {
	  sys.setRetData(6);
	  return;
	}

	// 根据请求数据向 apis 和 api_content 表中插入一条新数据
	var sqlApi = "insert into sys_apis (appid, moduleid, apiid, apinm, contentid, status, createdt, updatedt,op_type,help_info) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	var contentId = sys.uuid();
	var newApiStatus = status;
	if (newApiStatus == null) {
	  newApiStatus = "1";
	}
	// op_type废弃，为兼容，设置值为"0"
	var param = [appId, modId, apiId, apiNm, contentId, newApiStatus, currentTime, currentTime,"0",help_info];
	var sqlApiContent = "insert into sys_api_content (contentid, stability, pid, updatedt) values (?, '00', ?, ?)";
	var paramContent = [contentId,pId,currentTime];

	// 执行更新
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

	//返回添加的数据
	var ret=[{"appid":appId,"moduleid":modId,"apiid":apiId,"apinm":apiNm,"contentid":contentId,"status":newApiStatus,"createdt":currentTime,"updatedt":currentTime,"appnm":apiNm,"someid":appId+"@"+modId+"@"+apiId,"isParent":false}];
	//将创建的api付给角色id
	if (roleid!=null) {
		var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
		sql.update(authRoleSql,[roleid,appId,modId,apiId,"1",currentTime,currentTime], "1");
	}
	sql.commit();
	//返回数据
	sys.addRetData(ret,"result");
	sys.setRetData("0","","result");
} else if (type == "1") { // 更新操作
	// 不存在：返回错误，处理结束 
	if (apiCnt == "0") {
		sys.setRetData(6);
		return;
	}

	// 根据请求数据更新 apis 数据
	var param = [];
	var sqlApi = "update sys_apis set ";
	if (apiNm != null) {
	  sqlApi = sqlApi + "apinm = ?, ";
	  list.add(param, apiNm);
	}
	if (status != null) {
	  sqlApi = sqlApi + "status = ?, ";
	  list.add(param, status);
	}
	sqlApi = sqlApi + "updatedt = ?,help_info = ? where appid = ? and moduleid = ? and apiid = ?";
	list.add(param, currentTime);
	list.add(param, help_info);
	list.add(param, appId);
	list.add(param, modId);
	list.add(param, apiId);

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
	var selectstability="select b.stability from sys_apis a , sys_api_content b where a.contentid=b.contentid and a.appid = ? and a.moduleid = ? and a.apiid = ?";
	sql.query(selectstability,[appId,modId,apiId],"stability");
	var stability=sys.result.stability[0].stability;
	//获取stability数据字典缓存
	var tmpList = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0030");
	var name = "";
	if(tmpList != null){
	   for(r in tmpList){
			if(r.id == stability){
				name = r.name;
				break;
			}
		} 
	}

	var infonm="("+name+")";
	//返回添加的数据

	var ret=[{"appid":appId,"moduleid":modId,"apiid":apiId,"apinm":apiNm,"updatedt":currentTime,"appnm":infonm+apiNm,"someid":appId+"@"+modId+"@"+apiId,"isParent":false}];
	sys.addRetData(ret,"result");
	sys.setRetData("0","","result");
}
if (roleid!=null) {
  // 更新角色缓存
  http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
}