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
//id:deletethirdapp
  //name:删除第三方应用
  //编写人：王莹莹
var tp_appid = sys.request.tp_appid;
var org = sys.request.org;
if (tp_appid == null) {
  sys.setRetData("1");
  return;
}
var sqlDlt = "delete from sys_pl_tp_app where tp_appid = ?";
var paramDlt = [tp_appid];
var dltCount = sql.update(sqlDlt,paramDlt);
if (dltCount == 0) {
  sys.setRetData("5");
}else {
  //设置缓存
  se.delCache(_CACHE_REGION_TP_APP_, org+":"+tp_appid);
  se.delCache(_CACHE_REGION_TP_APP_, tp_appid);
  sys.setRetData("0");
}