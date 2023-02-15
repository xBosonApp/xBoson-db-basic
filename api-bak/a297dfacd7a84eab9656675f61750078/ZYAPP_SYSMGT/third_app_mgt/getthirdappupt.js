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
//id:getthirdappupt
//name:同步第三方应用
//编写人：王莹莹
var tp_appid = sys.request.tp_appid;
//查询 sys_server 表
if (tp_appid != null) {
  var sql = "select tp_appid,tp_appnm,app_secret,uri,mark,status,createdt,updatedt from sys_pl_tp_app where tp_appid = ?";
  var param = [tp_appid];
  var query = sql.query(sql, param);
  sys.setRetData("0","","result");
} else {
  sys.setRetData("1");
}