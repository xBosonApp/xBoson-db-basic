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
//setthirdappstatus
  //修改第三方应用状态
  //编写人：王莹莹
  var tp_appid = sys.request.tp_appid;
  var status = sys.request.status;
  var org = sys.request.org;

  var params=[status,tp_appid];
//sql语句
  if (tp_appid == null || status == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpdStatus = "update sys_pl_tp_app SET status = ?,updatedt = ? where tp_appid = ?";
  var paramStatus = [status,sys.currentTimeString(),tp_appid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }else{
    //更新缓存
    var _appinfo="select tp_appid,tp_appnm,app_secret,uri,scope,orgid,status from sys_pl_tp_app where tp_appid=?";            
    var _cnt = sql.query(_appinfo,[tp_appid],"appinfoSet");
    var appinfoSet=sys.result.appinfoSet;
   if(_cnt>0){
       se.setCache(_CACHE_REGION_TP_APP_, org+":"+tp_appid, appinfoSet[0], 0);
       se.setCache(_CACHE_REGION_TP_APP_, tp_appid, appinfoSet[0], 0);
     }else{
       se.delCache(_CACHE_REGION_TP_APP_, org+":"+tp_appid);
       se.delCache(_CACHE_REGION_TP_APP_, tp_appid);
    }
  }
  sys.setRetData("0");