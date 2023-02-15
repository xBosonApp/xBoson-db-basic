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
// getappinfo
// IDE，APP 修改时同步 APP 信息
// 参数：appid(必须),moduleid(必须)，apiid(必须)

var appid = sys.request.appid;
var modid = sys.request.moduleid;
var apiid = sys.request.apiid;

// 验证必要参数
if (appid == null || modid == null || apiid == null) {
  sys.setRetData("1");
  return;
}

var sql = "select sys_apis.appid, sys_apis.moduleid, sys_apis.apiid, sys_apis.apinm, sys_apis.status,sys_apis.createdt, sys_apis.updatedt,sys_apis.op_type optype,sys_apis.help_info   from sys_apps, sys_modules, sys_apis where sys_apis.appid = ? and sys_apis.moduleid = ? and sys_apis.apiid = ? and sys_apis.appid = sys_modules.appid and sys_apis.moduleid = sys_modules.moduleid and sys_modules.appid = sys_apps.appid";
var param = [appid, modid, apiid];
var cnt = sql.query(sql, param);
if (cnt > 0) {
  // 取到数据正常返回
  sys.setRetData("0", "", "result");
} else {
  // 未取到数据，返回排他异常
  sys.setRetData("6");
}