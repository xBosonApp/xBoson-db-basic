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
//setthirdapp
  //修改第三方应用
  //编写人：王莹莹
 
var tp_appid=sys.request.tp_appid;
var tp_appnm=sys.request.tp_appnm;
var app_secret = sys.request.app_secret;
var uri = sys.request.uri;
var org = sys.request.org;
var mark = sys.request.mark;
var status = sys.request.status; 

//判断不为空
if (tp_appid == null || tp_appnm == null || app_secret==null||uri==null||status ==null) {
    sys.setRetData("1");
    return;
}
var sqlM_B_CUpd1 = "update sys_pl_tp_app set tp_appnm=?,app_secret=?,uri=?,mark=?,status =?";
var sqlM_B_CUpd2 = "";
var sqlWhere = " where tp_appid = ?";
var paramUpd = [tp_appnm,app_secret,uri,mark,status];
//获取当前时间
sqlM_B_CUpd2 = sqlM_B_CUpd2 + ",updatedt = ?";
@paramUpd.add(sys.currentTimeString());
var sqlM_B_CUpd = sqlM_B_CUpd1 + sqlM_B_CUpd2 + sqlWhere;
@paramUpd.add(tp_appid);
var updCount = sql.update(sqlM_B_CUpd,paramUpd);

if (updCount == 0) {
  sys.setRetData("5");
  return;
}else{
    //更新缓存
    var _appinfo="select tp_appid,tp_appnm,app_secret,uri,scope,orgid,status from sys_pl_tp_app where tp_appid=?";
    var _cnt = sql.query(_appinfo,[tp_appid],"appinfoSet");
    var appinfoSet=sys.result.appinfoSet;
    if(_cnt>0){
      se.setCache(_CACHE_REGION_TP_APP_, org+":"+sys.toLowerCase(tp_appid), appinfoSet[0], 0);
      se.setCache(_CACHE_REGION_TP_APP_, sys.toLowerCase(tp_appid), appinfoSet[0], 0);
    }else{
      se.delCache(_CACHE_REGION_TP_APP_, org+":"+sys.toLowerCase(tp_appid));
      se.delCache(_CACHE_REGION_TP_APP_, sys.toLowerCase(tp_appid));
    }
}
sys.setRetData("0");