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
var scheduleid = sys.getUUID();
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
var createdt=sql.currentDBTimeString();
var updatedt=createdt;
var orgid=sys.request.org;
var schedule_status=1;
if(null==schedulenm || null==schedule_cycle){ 
    sys.setRetData("1","");
    return;
}
var param=[scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api, mark, orgid, pid, status, createdt, updatedt,inner_api];
sys.printValue(param);
//添加数据库
var sqls="insert into sys_pl_task_scheduler (scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api, mark, orgid, pid, status, createdt, updatedt,inner_api)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

var counts = sql.update(sqls,param,1);

if(counts>0){
    sql.commit();
    // 返回计划任务ID
    sys.addRetData(scheduleid,"scheduleid");
    sys.setRetData("0","","scheduleid");
    return;
}
  sql.rollback();
  sys.setRetData("1","添加失败!");