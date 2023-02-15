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
var scheduleid = sys.request.scheduleid;
var schedulenm=sys.request.schedulenm;
var schedule_cycle=sys.request.schedule_cycle;
var time_year=sys.request.time_year;
var time_month=sys.request.time_month;
var time_day=sys.request.time_day;
var time_hour=sys.request.time_hour;
var time_min=sys.request.time_min;
var time_sec=sys.request.time_sec;
var time_dayofweek=sys.request.time_dayofweek;
var schedule_interval=sys.request.schedule_interval;
var run_end_time=sys.request.run_end_time;
var run_times=sys.request.run_times;
var task_api=sys.request.task_api;
var inner_api=sys.request.inner_api;
var mark=sys.request.mark;
var status=1;
var updatedt=sql.currentDBTimeString();
var orgid=sys.request.org;

if(null==scheduleid)
{
    sys.setRetData("1","缺少必要参数！");
    return;
}
var params=[schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, task_api, mark, orgid, pid, updatedt,inner_api,scheduleid];
if(0<sql.query("select 1 from sys_pl_task_scheduler where scheduleid=? and schedule_status=1 ",[scheduleid],"result")){
    var sqls= "update sys_pl_task_scheduler set schedulenm=?, schedule_cycle=?, time_year=?, time_month=?, time_day=?, time_hour=?, time_min=?, time_sec=?, time_dayofweek=?, schedule_interval=?, run_end_time=?, run_times=?, task_api=?, mark=?, orgid=?, pid=?, updatedt=?,inner_api=? where scheduleid=?";
    
     if(0<sql.update(sqls,params,1)) {
        sql.commit();
        sys.setRetData("0","");
        return;
      } 
      sql.rollback();
      sys.setRetData("1","修改失败!");
}
sys.setRetData("0","当前状态不可修改！");
return;