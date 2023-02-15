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
var appId = sys.uuid();
var appId_u=sys.request.appid;
var appNm = sys.request.appnm;
var about = sys.request.about;
var appFlag = sys.request.appflag;
var status = sys.request.status;
var prjid=sys.request.prjid;
if(prjid == null){
  sys.setRetData("1","项目ID为空");
  return;
}
if (! /^[A-Za-z0-9_]{4,}$/.test(prjid)) {
  sys.setRetData("1","项目ID只能是字母数字下划线, 大于4个字符");
  return;
}
// 验证必要参数
if (type == null) {
	sys.setRetData("1","维护类型为空");
	return;
}

// 验证操作类型
if (type != "0" && type != "1" && type != "2") {
	sys.setRetData("2","维护类型错误");
	return;
}
//设置返回数据
var set=[];
var ret=[];
// 验证 APPID 是否已经存在
var sqlAppCnt = "select count(*) cnt from sys_apps where appid = ?";
var paramAppCnt = [appId];
if (type=="1"||type=="2"){
    paramAppCnt=[appId_u];
}

sql.query(sqlAppCnt, paramAppCnt, "appcnt");
var appCntRet = sys.result.appcnt;
var appCnt = "";
for (acr in appCntRet) {
	appCnt = acr.cnt;
}

var sqlApp = "";
var param = [];
var currentTime = date.currentTimeString();
if (type == "0") {  // 创建操作
	// 存在：返回错误，处理结束 
	if (appCnt != "0") {
	  sys.setRetData(6);
	  return;
	}

	// 根据请求数据向 apps 表中插入一条新数据
	sqlApp = "insert into sys_apps (appid, appnm, about, appflag, status, createdt, updatedt) values (?, ?, ?, ?, ?, ?, ?)";
	if (appFlag == null) {
	  appFlag = "0";
	}
	if (status == null) {
	  status = "1";
	}
	param = [appId, appNm, about, appFlag, status, currentTime, currentTime];
	set=[{"appid":appId,"appnm":appNm,"about":about,"appflag":appFlag,"status":status,"createdt":currentTime,"updatedt":currentTime,"someid":appId,"isParent":true}];
	//将创建的app付给项目角色id
	var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
	sql.query(sqlRole, [prjid], "roleidSet");
	var roleidSet = sys.result["roleidSet"];
	if (roleidSet!=null && sys.size(roleidSet)>0) {
		var roleid=roleidSet[0]["roleid"];
		var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
		sql.update(authRoleSql,[roleid,appId,"","","1",currentTime,currentTime], "1");
	}
	// 执行更新
	sql.update(sqlApp, param, "1");
	sql.commit();
	//返回数据
	sys.addRetData(set,"result");
	sys.setRetData("0","","result");
} else if (type == "1") { // 更新操作
	if (appCnt == "0") {
	  sys.setRetData("2","APP 不存在");
	  return;
	}

	// 根据请求数据更新 apps 数据
	sqlApp = "update sys_apps set ";
	if (appNm != null) {
	  sqlApp = sqlApp + "appnm = ?, ";
	  list.add(param, appNm);
	}
	if (about != null) {
	  sqlApp = sqlApp + "about = ?, ";
	  list.add(param, about);
	}
	if (appFlag != null) {
	  sqlApp = sqlApp + "appflag = ?, ";
	  list.add(param, appFlag);
	}
	if (status != null) {
	  sqlApp = sqlApp + "status = ?, ";
	  list.add(param, status);
	}
	sqlApp = sqlApp + "updatedt = ? where appid = ?";
	list.add(param, currentTime);
	list.add(param, appId_u);
	set=[{"appid":appId_u,"appnm":appNm,"about":about,"appflag":appFlag,"status":status,"updatedt":currentTime,"someid":appId_u,"isParent":true}];

	// 执行更新
	sql.update(sqlApp, param);
	//status可能变更，所以更新缓存
	var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
	sql.query(sqlRole, [prjid], "roleidSet");
	var roleidSet = sys.result["roleidSet"];
	if (roleidSet!=null && sys.size(roleidSet)>0) {
		var roleid=roleidSet[0]["roleid"];
		// 更新角色缓存
		http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
	}
	//返回数据
	sys.addRetData(set,"result");
	sys.setRetData("0","","result");
} else if (type == "2") {
	//只允许删除空APP
	var appidDel=sys.request.appid;
	if(appidDel==null){
		sys.setRetData("1", "APP ID为空");
		return;
	}

	//1.检查app是否存在
	if (appCnt == "0") {
	  sys.setRetData("2","APP 不存在");
	  return;
	}
	//2.检查app下是否有模块
	cnt=sql.query("select moduleid from sys_modules where appid=?",[appidDel]);
	if(cnt>0){
		sys.setRetData("2","APP下有模块，不允许删除！");
		return;
	}
	//删除app
	sql.update("delete from sys_apps where appid=?",[appidDel]);
	var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
	sql.query(sqlRole, [prjid], "roleidSet");
	var roleidSet = sys.result["roleidSet"];
	if (roleidSet!=null && sys.size(roleidSet)>0) {
		var roleid=roleidSet[0]["roleid"];
		sql.update("delete from sys_role_api where roleid=? and appid=?",[roleid,appidDel]);
		// 更新角色缓存
		http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
	}
	sys.setRetData("0");
}

se.sendAppReleased();