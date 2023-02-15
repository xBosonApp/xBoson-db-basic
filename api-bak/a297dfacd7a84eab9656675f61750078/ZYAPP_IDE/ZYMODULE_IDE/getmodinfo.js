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

// getmodinfo
// IDE，模块修改时同步模块信息
// 参数：appid(必须)，moduleid(必须)

var appid = sys.request.appid;
var modid = sys.request.moduleid;

// 验证必要参数
if (appid == null || modid == null) {
  sys.setRetData("1");
  return;
}

var sql = "select sys_modules.appid, sys_modules.moduleid, sys_modules.modulenm, sys_modules.about, sys_modules.status, sys_modules.createdt, sys_modules.updatedt, sys_modules.auflag from sys_apps, sys_modules where sys_modules.appid = ? and sys_modules.moduleid = ? and sys_modules.appid = sys_apps.appid";
var param = [appid, modid];
var cnt = sql.query(sql, param);
if (cnt > 0) {
  // 取到数据正常返回
  sys.setRetData("0", "", "result");
} else {
  // 未取到数据，返回排他异常
  sys.setRetData("6");
}