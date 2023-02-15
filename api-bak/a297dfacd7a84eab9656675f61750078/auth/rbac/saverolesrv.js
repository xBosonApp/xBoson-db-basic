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
var requestJson = sys.requestJson;
if (requestJson == null || sys.size(requestJson) == 0){
  sys.setRetData("1", "JSON请求数据为空");
  return;
}

var roleid = requestJson.roleid;
var apis = requestJson.apis;
var models = requestJson.models;

if (roleid == null) {
  sys.setRetData("1", "未指定角色");
  return;
}
var dt = date.currentTimeString();
var apiParams = [];
var modelParams = [];
for (row in apis) {
  list.add(apiParams, [roleid, row.appid, row.moduleid, row.apiid, "1", dt, dt]);
}
for (row in models) {
  list.add(modelParams, [roleid, row.modelid, "1", dt, dt]);
}

// 角色API关联表
sql.update("delete from sys_role_api where roleid=?", [roleid], "1");
if (sys.size(apiParams) > 0) {
  sql.updateBatch("insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)", apiParams, "1");
}

// 角色模型关联表
sql.update("delete from sys_role_model where roleid=?", [roleid], "1");
if (sys.size(modelParams) > 0) {
  sql.updateBatch("insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)", modelParams, "1");
}
sql.commit();
// 更新角色缓存
http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"01"});
http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"02"});
sys.setRetData("0");