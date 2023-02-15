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
var modNm = sys.request.modulenm;
var about = sys.request.about;
var status = sys.request.status;
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
if (appId == null || modId == null) {
	sys.setRetData("1","APP或模型ID为空");
	return;
}
if (! /^[A-Za-z0-9_]{4,}$/.test(modId)) {
  sys.setRetData("1","模型ID只能是字母数字下划线, 大于4个字符");
  return;
}
// 验证操作类型
if (type != "0" && type != "1" && type != "2") {
	sys.setRetData("2","维护类型错误");
	return;
}
//设置返回数据
var ret=[];

// 验证 APPID, ModuleID 是否已经存在
var sqlModCnt = "select count(*) cnt from sys_apps sys_apps, sys_modules sys_modules where sys_apps.appid = sys_modules.appid and sys_apps.appflag = '0' and sys_modules.appid = ? and sys_modules.moduleid = ?";
var paramModCnt = [appId, modId];
sql.query(sqlModCnt, paramModCnt, "modcnt");
var modCntRet = sys.result.modcnt;
var modCnt = "";
for (mcr in modCntRet) {
	modCnt = mcr.cnt;
}

var sqlMod = "";
var param = [];
var currentTime = date.currentTimeString();
if (type == "0") {  // 创建操作
	// 存在：返回错误，处理结束 
	if (modCnt != "0") {
		sys.setRetData(6);
		return;
	}

	// 根据请求数据向 modules 表中插入一条新数据
	sqlMod="insert into sys_modules (appid,moduleid,modulenm,about,auflag,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
	var newModStatus = status;
	if (newModStatus == null) {
		newModStatus = "1";
	}
	param = [appId, modId, modNm, about, "0", newModStatus, currentTime, currentTime];
	ret=[{"appid":appId,"moduleid":modId,"modulenm":modNm,"about":about,"status":status,"createdt":currentTime,"updatedt":currentTime,"appnm":modNm,"someid":appId+"@"+modId,"isParent":true}];
	//将创建的mod付给项目角色id
	var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
	sql.query(sqlRole, [prjid], "roleidSet");
	var roleidSet = sys.result["roleidSet"];
	if (roleidSet!=null && sys.size(roleidSet)>0) {
		var roleid=roleidSet[0]["roleid"];
		var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
		sql.update(authRoleSql,[roleid,appId,modId,"","1",currentTime,currentTime]);
		// 更新角色缓存
		http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
	}
	// 执行更新
	sql.update(sqlMod, param);

	//返回数据
	sys.addRetData(ret,"result");
	sys.setRetData("0","","result");
} else if (type == "1") { // 更新操作
	// 不存在：返回错误，处理结束 
	if (modCnt == "0") {
		sys.setRetData(6);
		return;
	}

	// 根据请求数据更新 modules 数据
	sqlMod = "update sys_modules set ";
	if (modNm != null) {
		sqlMod = sqlMod + "modulenm = ?, ";
		list.add(param, modNm);
	}
	if (about != null) {
		sqlMod = sqlMod + "about = ?, ";
		list.add(param, about);
	}
	if (status != null) {
		sqlMod = sqlMod + "status = ?, ";
		list.add(param, status);
	}
	sqlMod = sqlMod + "updatedt = ? where appid = ? and moduleid = ?";
	list.add(param, currentTime);
	list.add(param, appId);
	list.add(param, modId);

	ret=[{"appid":appId,"moduleid":modId,"modulenm":modNm,"about":about,"status":status,"updatedt":currentTime,"appnm":modNm,"someid":appId+"@"+modId,"isParent":true}];
	// 执行更新
	sql.update(sqlMod, param);
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
	sys.addRetData(ret,"result");
	sys.setRetData("0","","result");
} else if (type == "2") {
	// 只允许删除空模块
	//1.检查模块是否存在
	if (modCnt == "0") {
		sys.setRetData(6);
		return;
	}
	//2.判断模块下是否有API
	var cnt=sql.query("select apiid from sys_apis where appid=? and moduleid=?",[appId,modId]);
	if(cnt>0){
		sys.setRetData("2","模块下有API，不允许删除！");
		return;
	}
	//删除模块
	sql.update("delete from sys_modules where appid=? and moduleid=?",[appId,modId]);
	var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
	sql.query(sqlRole, [prjid], "roleidSet");
	var roleidSet = sys.result["roleidSet"];
	if (roleidSet!=null && sys.size(roleidSet)>0) {
		var roleid=roleidSet[0]["roleid"];
		sql.update("delete from sys_role_api where roleid=? and appid=? and moduleid=?",[roleid,appId,modId]);
		// 更新角色缓存
		http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
	}
	sys.setRetData("0");
}