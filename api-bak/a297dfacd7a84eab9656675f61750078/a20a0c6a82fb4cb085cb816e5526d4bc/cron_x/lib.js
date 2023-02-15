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

var periodTypeMap = {
  '10':   0, '20':   0, '30': 'y', '31': 'M', '40': 'ew',
  '50': 'd', '60': 'd', '70': 'h', '80': 'm', '90': 's'
};

module.exports = {
  parseBeginDateFromReq : parseBeginDateFromReq,
  parseParameter : parseParameter,
};


function parseParameter(query) {
  if (query.run_times == null || query.run_times === 0) {
    query.run_times = -1;  
  }
  
  switch (parseInt( query.schedule_cycle )) {
    case 10:
      query.run_times = 1;
      // 立即开始的任务全部设置为当前时间
      query.start_time = parseBeginDateFromReq('s', query);
      break;

    case 20:
      query.run_times = 1;
      // 一次性任务全部设置为用户指定时间
      query.start_time = parseBeginDateFromReq('A', query);
      break;

    case 40:
      // job lib 需要使用 interval 传递星期参数
      query.schedule_interval = q.time_dayofweek;
      query.start_time = parseBeginDateFromReq('d', query);
      break;

    case 30:
    case 31:
    case 50:
      query.schedule_interval = 1;
    default:
      query.start_time = parseBeginDateFromReq(periodTypeMap[query.schedule_cycle], query);
  }
}


function parseBeginDateFromReq(periodType, query) {
  var ct = new Date();
  var dt = []; // 5y 4M 3d 2h 1m 0s

  // not break !!
  switch(periodType) {
    case 'A': dt[5] = query.time_year;
    case 'y': dt[4] = query.time_month;
    case 'M': dt[3] = query.time_day;
    case 'd': dt[2] = query.time_hour;
    case 'h': dt[1] = query.time_min;
    case 'm': dt[0] = query.time_sec;
  }

  // not break !!
  switch(periodType) {
    case 's': dt[0] = ct.getSeconds();
    case 'm': dt[1] = ct.getMinutes();
    case 'h': dt[2] = ct.getHours();
    case 'd': dt[3] = ct.getDate();
    case 'M': dt[4] = ct.getMonth()+1;
    case 'y': dt[5] = ct.getFullYear();
  }

  var startDate =     dt[5] + '-' + d2(dt[4]) + '-' + d2(dt[3]);
  var startTime = d2(dt[2]) + ':' + d2(dt[1]) + ':' + d2(dt[0]);
  return startDate +' '+ startTime;
}


function d2(i) {
  if (isNaN(i)) {
    return '00';
  }
  if (i < 10) {
    return '0' + i;
  }
  return ''+ i;
}