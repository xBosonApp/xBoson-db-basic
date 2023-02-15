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
//setuidstatus
  //修改托管用户状态
  //编写人：王莹莹

  var tp_appid = sys.request.tp_appid;
  var pid = sys.request.pid;
  var status = sys.request.status;
  var org = sys.request.org;

  var params=[status,tp_appid,pid];
//sql语句
  if (tp_appid == null || pid == null||status == null) {
    sys.setRetData("1");
    return;
  }
 var sqlUpdStatus ="update sys_pl_tp_app_uid SET status = ? where tp_appid =? and pid= ?";
  var paramStatus = [status,tp_appid,pid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
  }else{
    sys.setRetData("0");
  }