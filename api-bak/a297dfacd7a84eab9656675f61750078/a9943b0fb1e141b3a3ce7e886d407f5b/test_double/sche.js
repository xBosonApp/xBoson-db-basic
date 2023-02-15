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
schedule.start("a", {
  "schedulenm" : "测试",
  "schedule_interval" : "1",
  "schedule_cycle" : "10",
  "run_times" : "1",
  "task_api" : "http://baidu.com",
  "start_time" : "2018-01-01 00:00:00",
  "run_end_time" : "2018-02-01 00:00:00"
});

/*
{
  "schedulenm" : "测试",
  "schedule_interval" : "1",
  "schedule_cycle" : "20",
  "run_times" : "1",
  "task_api" : "http://baidu.com",
  "start_time" : "2018-01-16 14:15:00",
  "run_end_time" : "2018-02-01 00:00:00"
}
*/

var task = schedule.info("a");
sys.printValue(task.state);

sys.setRetData(0, 'Do nothing.');