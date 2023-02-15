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
"use strict";

var scheduleid=sys.request.scheduleid;
if(null==scheduleid)
{
    sys.setRetData("1","");
    return;
}
var sqls="select scheduleid,schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api, mark, orgid, pid, status, createdt, updatedt,inner_api from sys_pl_task_scheduler where scheduleid=? ";

var counts=sql.query(sqls,[scheduleid],"result");
for(var i=0; i<sys.result.result.length; ++i) {
  var r = sys.result.result[i];
  if(r.run_end_time != ""){
    var a=sys.formattedTime(sys.parseDate(r.run_end_time,"yyyyMMdd"),"yyyy-MM-dd");
    map.put(r,"run_end_time",a);
  }
}
sys.setRetData("0","","result");