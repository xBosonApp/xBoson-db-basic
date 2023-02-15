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
//id:addthirdapp
//name:添加第三方应用
//编写人：王莹莹

var tp_appid=sys.uuid();
var tp_appnm = sys.request.tp_appnm;
var app_secret = sys.request.app_secret;
var uri = sys.request.uri;
var status= sys.request.status;
var mark = sys.request.mark;
var orgid=sys.request.org;  

//判断数据库中不允许为空的字段 
if(tp_appid==null||tp_appnm==null||app_secret==null||uri==null||status==null){
  sys.setRetData("1");
  return;
}

//插入sys_pl_tp_app表
var dt = sys.currentTimeString();//获取当前时间
var params=[tp_appid,tp_appnm,app_secret,uri,orgid,mark,status,dt,dt];
var sql="insert into sys_pl_tp_app (tp_appid,tp_appnm,app_secret,uri,orgid,mark,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)";

//判断主键是否重复
var sqlSel="select tp_appid from sys_pl_tp_app where tp_appid = ? ";
var param=[tp_appid];
var countSel=sql.query(sqlSel,param);
if(countSel>=1){
  sys.setRetData("6");
  return;
}
var count = sql.update(sql,params);
if (count == 0) {
  sys.setRetData("5");
  return;
}
//更新缓存
var _appinfo="select tp_appid,tp_appnm,app_secret,uri,scope,orgid,status from sys_pl_tp_app where tp_appid=?";
var _cnt = sql.query(_appinfo,[tp_appid],"appinfoSet");
var appinfoSet=sys.result.appinfoSet;
if(_cnt>0){
  se.setCache(_CACHE_REGION_TP_APP_, orgid+":"+sys.toLowerCase(tp_appid), appinfoSet[0], 0);
  se.setCache(_CACHE_REGION_TP_APP_, sys.toLowerCase(tp_appid), appinfoSet[0], 0);
}else{
  se.delCache(_CACHE_REGION_TP_APP_, orgid+":"+sys.toLowerCase(tp_appid));
  se.delCache(_CACHE_REGION_TP_APP_, sys.toLowerCase(tp_appid));
}
sys.setRetData("0");