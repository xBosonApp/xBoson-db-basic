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
// 根据项目显示能看到的APP列表
var id = sys.request.id;
var prjid=sys.request.prjid;
if(prjid == null){
	sys.setRetData("1","项目ID为空");
	return;
}
if (id == null) {
	id = "";
}
var sql = "";
var param = [];
var queryIds = strutil.split(id, "@");
var len = sys.size(queryIds);
switch (len) {
	case 1:
		if (id == "") {
			// APP
			sql="select app.appid someid,'' belongto,app.appid,app.appid showid,app.appnm,app.about,app.status,app.createdt,app.updatedt ";
		sql=sql+"from sys_apps app,";
		sql=sql+"(select distinct sys_role_api.appid appid";
		sql=sql+" from sys_role_api sys_role_api,";
		sql=sql+"      (";
		sql=sql+"       select ugrole.roleid roleid from sys_role_ug ugrole,sys_prj prj,sys_ug ug,sys_role role";
		sql=sql+"       where prj.prjid=? and prj.ugid=ugrole.ugid and ugrole.ugid=ug.ugid and ugrole.roleid=role.roleid";
		sql=sql+"         and role.status='1' and ug.status='1' and prj.status='1' and ugrole.status='1' and role.status='1'";
		sql=sql+"      ) prjrole";
		sql=sql+" where sys_role_api.roleid=prjrole.roleid";
		sql=sql+"   and sys_role_api.status='1') role_app ";
		sql=sql+"where app.appflag='0' and app.appid=role_app.appid ";
		sql=sql+"order by app.appnm";
			param=[prjid];
		} else {
			// 模块
			var appid = id;
			//判断数据库类型
			var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
			if(dbType == "01"){
				sql = "select concat(appid,'@',moduleid) someid, concat(appid) belongto, appid, moduleid,moduleid showid, concat(modulenm) appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where (auflag = '0' or auflag = '2') and appid = ? ";  
			}else if(dbType == "02"){
				sql = "select appid + '@'+ moduleid someid, appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where (auflag = '0' or auflag = '2') and appid = ? "; 
			}else if(dbType == "03"){
				sql = "select appid||'@'||moduleid someid, appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where (auflag = '0' or auflag = '2') and appid = ? "; 
			}
			sql = sql + "order by appnm ";
			param=[appid];
		}
		break;
	case 2:
		// API
		var appid = queryIds[0];
		var moduleid = queryIds[1];
		//判断数据库类型
		var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
		if(dbType == "01"){
			sql = "select concat(appid,'@',moduleid,'@',apiid) someid, concat(appid,'@',moduleid) belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis sys_apis , sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";
		}else if(dbType == "02"){
			sql = "select appid + '@' + moduleid+ '@'+ apiid someid, appid+'@'+moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis sys_apis , sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";   
		}else if(dbType == "03"){
			sql = "select appid|| '@'|| moduleid ||'@'+ apiid someid, appid|| '@'|| moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis sys_apis , sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";    
		}
		sql = sql + "order by appnm ";
		param=[appid,moduleid];
		break;
	case 3:
		// API 历史
		var appid = queryIds[0];
		var moduleid = queryIds[1];
		var apiid = queryIds[2];
		//判断数据库类型
		var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
		if(dbType == "01"){
			sql = "select concat(appid,'@',moduleid,'@',apiid,'@',hisid) someid, concat(appid,'@',moduleid,'@',apiid) belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";
		}else if(dbType == "02"){
			sql = "select appid + '@'+ moduleid+ '@'+ apiid + '@'+ hisid someid,appid+'@'+ moduleid + '@'+ apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";   
		}else if(dbType == "03"){
			sql = "select appid||'@'||moduleid ||'@'|| apiid ||'@'||hisid someid, appid|| '@'|| moduleid ||'@'|| apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";   
		}
		sql = sql + " order by apihis.updatedt desc ";
		param=[appid,moduleid,apiid];
		break;
	default:
	  sys.setRetData("2");
	  return;
}
sql.query(sql, param, "value");
var value = sys.result.value;
// 为tree节点显示的name加上（稳定性状态）
if (len == 3 || len == 2) {
	var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
	if(_tmp != null){
		for(v in value){
			var _name = "";
			for(t in _tmp){
			  if(t.id == v.stability){
				  _name = t.name;
				  break;
			  }
			} 
			_name = "("+_name+")"+v.appnm;
			map.put(v,"appnm", _name);
		}
	}
}
sys.setRetData("0", "", "value");