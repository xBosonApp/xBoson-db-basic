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

var openid=sys.request.openid;
var pid=sys.getUserPID(openid); 
var orgid=sys.request.org;
var scheduleid = sys.request.scheduleid;
if(null==scheduleid){ 
    sys.setRetData("1","scheduleid 不能为空");
    return;
}

var sqls ="select scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api,inner_api, mark, orgid, pid, status, createdt, updatedt from sys_pl_task_scheduler where scheduleid=?";
var counts = sql.query(sqls, [scheduleid], "result");

if(counts > 0) {
  var parm = sys.result.result[0];
  var schedule = require("schedule");
  var slib = require("./lib");
  slib.parseParameter(parm);
  parm.userid = sys.getUserIdByOpenId();
 
  schedule.start(scheduleid, parm);
  if(0<sql.update("update sys_pl_task_scheduler set schedule_status=2 where scheduleid=?",[scheduleid])){
    sys.setRetData("0","任务执行成功！");
    return;
  }

  sys.setRetData("1","启动任务失败！");
  return;
}

sys.setRetData("1","查找不到选择的任务！");