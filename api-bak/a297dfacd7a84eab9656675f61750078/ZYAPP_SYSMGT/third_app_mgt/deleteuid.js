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
//id:deleteuid
//name:删除第三方应用托管用户
//编写人：王莹莹

var tp_appid = sys.request.tp_appid;
var pid = sys.request.pid;
var org = sys.request.org;
if (tp_appid == null) {
  sys.setRetData("1");
  return;
}
var sqlDlt = "delete from sys_pl_tp_app_uid where tp_appid = ? and pid =?";
var paramDlt = [tp_appid,pid];
var dltCount = sql.update(sqlDlt,paramDlt);
if (dltCount == 0) {
  sys.setRetData("5");
}else {
  sys.setRetData("0");
}