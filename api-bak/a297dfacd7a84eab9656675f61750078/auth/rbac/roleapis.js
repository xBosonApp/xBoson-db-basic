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
// roleapis 角色API列表
var roleid = sys.request.roleid;
if (roleid == null) {
  sys.setRetData("1","未指定角色");
  return;
}

// 获取所有app，sys_role_api中有的app checked为true，没有的为false，app状态不为1的将保持不可编辑状态
var params0=[roleid];

var sql = "SELECT appid id,appnm name,CASE WHEN a.appid IN (SELECT DISTINCT appid FROM sys_role_api WHERE roleid=?) THEN 'true' ELSE 'false' END checked,CASE WHEN a.status='1' THEN  'false' ELSE 'true' END chkDisabled FROM sys_apps a ";
sql.query(sql, params0);
var apps = sys.result.result;

var params = [roleid, roleid];
    sql = "select appid, id, name, checked, chkDisabled from (";
sql=sql + "select appid appid, moduleid id, modulenm name, 'false' checked, case when status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_modules where not exists (select distinct moduleid from sys_role_api where sys_modules.appid = sys_role_api.appid and sys_modules.moduleid = sys_role_api.moduleid and roleid = ?)";
sql=sql + " union ";
sql=sql + "select distinct sys_modules.appid appid, sys_role_api.moduleid id, sys_modules.modulenm name, 'true' checked, case when sys_modules.status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_role_api, sys_modules where sys_role_api.roleid = ? and sys_role_api.appid = sys_modules.appid and sys_role_api.moduleid = sys_modules.moduleid";
sql=sql + ") B order by appid, id";
sql.query(sql, params, "modules");
var modules = sys.result.modules;

    sql = "select appid, moduleid, id, name, checked, chkDisabled from (";
sql=sql + "select appid appid, moduleid moduleid, apiid id, apinm name, 'false' checked, case when status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_apis where not exists (select distinct apiid from sys_role_api where sys_apis.appid = sys_role_api.appid and sys_apis.moduleid = sys_role_api.moduleid and sys_apis.apiid = sys_role_api.apiid and roleid = ?)";
sql=sql + " union ";
sql=sql + "select distinct sys_apis.appid appid, sys_apis.moduleid moduleid, sys_role_api.apiid id, sys_apis.apinm name, 'true' checked, case when sys_apis.status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_role_api, sys_apis where sys_role_api.roleid = ? and sys_role_api.appid = sys_apis.appid and sys_role_api.moduleid = sys_apis.moduleid and sys_role_api.apiid = sys_apis.apiid";
sql=sql + ") B order by appid, moduleid, id";

sql.query(sql, params, "apis");
var apis = sys.result.apis;

sys.setRetList(modules, apis, [["appid", "appid"], ["id", "moduleid"]], "children");
sys.setRetList(apps, modules, [["id", "appid"]], "children");

sys.setRetData("0", "", "result");