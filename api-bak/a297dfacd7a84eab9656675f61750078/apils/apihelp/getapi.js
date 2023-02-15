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
"use strict";

// getapi 获取APP、模块、API列表 for zTree
var id = sys.request.id;
var pid = sys.request.pid;
var prjid = sys.request.prjid; //项目id
var flg = sys.request.flg;  // 1:app;2:mod;3:api
if(id == null || pid == null || flg == null){
	sys.setRetData("1","请求参数id、pid、flg不能为空");
	return;
}

var sql = "";
var param = [];

switch (flg) {
	case '0':
	  sys.setRetData("0");
	  return;
	case '1':
		// 获取APP
		var prj_id = id;
		sql="select app.appid id, app.appid nid,'"+prj_id+"' prjid,'"+prj_id+"' pid, '2' flg, 'true' parent, concat('（app）',app.appnm) name,app.about mark,app.status,app.createdt,app.updatedt";
		sql=sql+" from sys_apps app,";
		sql=sql+" (select distinct sys_role_api.appid appid";
		sql=sql+" from sys_role_api sys_role_api,";
		sql=sql+" (";
		sql=sql+" select ugrole.roleid roleid from sys_role_ug ugrole,sys_prj prj,sys_ug ug,sys_role role";
		sql=sql+" where prj.prjid=? and prj.ugid=ugrole.ugid and ugrole.ugid=ug.ugid and ugrole.roleid=role.roleid";
		sql=sql+" and role.status='1' and ug.status='1' and prj.status='1' and ugrole.status='1' and role.status='1'";
		sql=sql+" ) prjrole";
		sql=sql+" where sys_role_api.roleid=prjrole.roleid";
		sql=sql+" and sys_role_api.status='1') role_app ";
		sql=sql+" where app.appflag='0' and app.appid=role_app.appid ";
		sql=sql+" order by name";
		param=[prj_id];
		break;
	case '2':
		// 获取mod模块
		var appid = id;
		sql = "select moduleid id, moduleid nid, appid pid,'"+prjid+"' prjid, '3' flg, 'true' parent, concat('（mod）',modulenm) name, about mark, status, createdt, updatedt, auflag from sys_modules where (auflag = '0' or auflag = '2') and appid = ? ";  
		sql = sql + "order by name";
		param=[appid];
		break;
	case '3':
		// 获取API
		var appid = pid;
		var moduleid = id;
		sql = "select sa.appid aid, sa.apiid id, concat(sa.apiid, '-') nid, sa.moduleid pid,'"+prjid+"' prjid, '0' flg, 'false' parent, sa.apinm, sa.apinm name, '' uri, sa.contentid, sa.status, sa.createdt, sa.updatedt,sa.op_type optype,sac.stability from sys_apis sa , sys_api_content sac where sa.contentid=sac.contentid  and sa.appid = ? and sa.moduleid = ? ";
		sql = sql + "order by name";
		param=[appid,moduleid];
		break;
	default:
	  sys.setRetData("2","请求参数flg值域范围（1:app;2:mod;3:api）不正确");
	  return;
}
sql.query(sql, param, "value");
var value = sys.result.value;
// 为API的 tree节点显示的name加上（稳定性状态）
if(flg==='3'){
	var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
//sys.printValue(_tmp);
	if(_tmp != null){
		for(var v in value){
			var _name = "";
      if (value[v].status == '1') {
        for(var t in _tmp){
          if(_tmp[t].id === value[v].stability){
            _name = _tmp[t].name;
          }
        }
      } else {
        _name = '未知';
      }
      // _name = "("+_name+")"+value[v].name;
      map.put(value[v],"sta", _name);
			value[v].uri = value[v].aid+"/"+value[v].pid+"/"+value[v].id;
		}
	}
}
sys.setRetData("0", "", "value");