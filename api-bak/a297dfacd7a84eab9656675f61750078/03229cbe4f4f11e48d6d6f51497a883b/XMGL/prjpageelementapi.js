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
// prjpageelementapi 页面元素事件API信息
var prjid = sys.request.prjid;
if (prjid == null) {
  sys.setRetData("1","项目未指定");
  return;
}

// 获取项目所有api，sys_page_api中有的api checked为true，没有的为false，api状态不为1的将保持不可编辑状态
var sql="SELECT app.appid id,app.appnm name,'false' checked,CASE WHEN app.status='1' THEN 'false' ELSE 'true' END chkDisabled ";
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
sql.query(sql, [prjid]);
var apps = sys.result.result;

// 以下没有限定app会有冗余数据，但合并children后会被丢弃
    sql = "select appid, id, name, checked, chkDisabled from (";
sql=sql + "select appid appid, moduleid id, modulenm name, 'false' checked, case when status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_modules) B order by appid, id";
sql.query(sql, null, "modules");
var modules = sys.result.modules;

    sql = "select appid, moduleid, id, name, checked, chkDisabled from (";
sql=sql + "select appid appid, moduleid moduleid, apiid id, apinm name, 'false' checked, case when status='1' then 'false' else 'true' end chkDisabled ";
sql=sql + "from sys_apis) B order by appid, moduleid, id";
sql.query(sql, null, "apis");
var apis = sys.result.apis;

sys.setRetList(modules, apis, [["appid", "appid"], ["id", "moduleid"]], "children");
sys.setRetList(apps, modules, [["id", "appid"]], "children");

sys.setRetData("0", "", "result");