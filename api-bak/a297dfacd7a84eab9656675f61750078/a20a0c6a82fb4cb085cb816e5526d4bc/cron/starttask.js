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
var openid=sys.request.openid;
var pid=sys.getUserPID(openid); 
var orgid=sys.request.org;
var scheduleid = sys.request.scheduleid;
if(null==scheduleid){ 
    sys.setRetData("1","");
    return;
}
var sqls ="select scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api,inner_api, mark, orgid, pid, status, createdt, updatedt from sys_pl_task_scheduler where scheduleid=?";
var counts = sql.query(sqls,[scheduleid],"result");

if(counts>0){
 var paramJs=sys.result.result[0];

  //成功后调用计划任务接口
  var retUri=se.getCache(_CACHE_REGION_TP_APP_,"e0b5f238be924796b318a97d4e7e022c");//http://172.0.0.1:8088/cron/
  if (retUri==null) {
    sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址是否已经设定");
    return;
  }
  var uri = retUri.uri;
  if (uri==null) {
    sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址是否已经设定");
    return;
  }
  var tmpstr = se.getCache(_CACHE_REGION_SCHEDULE_,orgid+":"+scheduleid);
  var hiscache=sys.instanceFromJson(tmpstr);
  
  if(null==hiscache){
    se.setCache(_CACHE_REGION_SCHEDULE_,orgid+":"+scheduleid,paramJs,0);
  } else {      
    map.put(hiscache,"run_times",paramJs.run_times);
    se.setCache(_CACHE_REGION_SCHEDULE_,orgid+":"+scheduleid,hiscache,0);
  }

  var resGet=http.get(uri+"start",{"id":orgid+":"+scheduleid},"json");
  if (resGet == null) {
    sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址");
    return;
  }
  var resJs=resGet.data;
  if(0==resJs.ret){
    if(0<sql.update("update sys_pl_task_scheduler set schedule_status=2 where scheduleid=?",[scheduleid],1)){
        sql.commit();
        sys.setRetData("0","任务执行成功！");
        return;
    }
  } 
    sql.rollback();
    sys.setRetData("1","启动任务失败！");
    sys.printValue(resJs);
    return;
}
sys.setRetData("1","查找不到选择的任务！");