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
// 清空已有缓存
se.delCache(_CACHE_REGION_TP_APP_);

// 第三方应用信息
var sqlapp = "select tp_appid,tp_appnm,app_secret,uri,orgid,status from sys_pl_tp_app order by tp_appid";
sql.query(sqlapp, null, "apps");
var apps=sys.result["apps"];
sql.query("select client_id,scope from sys_pl_client_scope where status='1' order by client_id",null,"sr");
sys.setRetList(apps,sys.result["sr"],[["tp_appid","client_id"]],"children");
for(app in apps){
  var appid=app["tp_appid"];
  var orgid=app["orgid"];
  var children = app["children"];
  var scope = "";
  if (children != null) {
    for (row in children) {
      scope = scope + row["scope"] + " ";
    }
  }
  scope = sys.trim(scope);
  map.put(app,"scope", scope);
  map.remove(app,"children");
  se.setCache(_CACHE_REGION_TP_APP_, orgid+":"+appid, app, 0);
  se.setCache(_CACHE_REGION_TP_APP_, appid, app, 0);
}
se.setCache(_CACHE_REGION_TP_APP_, _CACHE_KEY_READY_, true, 0);