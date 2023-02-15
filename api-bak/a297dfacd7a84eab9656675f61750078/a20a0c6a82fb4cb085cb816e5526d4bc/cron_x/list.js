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

var schedule = require("schedule");
var orgid = sys.request.org;
var schedulenm = sys.request.schedulenm;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值
var task_ids = [];
var param=[orgid];

var sqls ="select scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api, mark, orgid, pid, status, createdt, updatedt from sys_pl_task_scheduler where orgid=? ";

if(null!=schedulenm){
    sqls=sqls+" and schedulenm like '%"+schedulenm+"%' ";
}
if(null==pagenum)pagenum = pNDefualt;
if(null==pagesize)pagesize = PSDefualt;

sqls = sqls + " order by createdt desc";
var counts = sql.queryPaging(sqls,param,pagenum,pagesize,"result");
if (0==counts) {
    sys.addRetData("result",[]);
    sys.setRetData("0","","result");
    return ;
}

    var res = sys.result.result;
    for(var i=0; i<sys.size(res); ++i) {
      var task = schedule.info(res[i].scheduleid);
      if (task) {
        res[i].task_status = task.state();
        res[i].next_run = task.nextDate();
        res[i].node_id = task.nodeID();
      } else {
        res[i].schedule_status = '3';
        res[i].task_status = 7;
        res[i].next_run = '';
        res[i].node_id = '';
      }
    }
    sys.setRetData("0", "ok", "result");