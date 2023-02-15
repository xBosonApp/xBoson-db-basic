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

var year = sys.request.getInteger('year', false, 2000, 9999);
var mon  = sys.request.getInteger('month', false, 1, 12);

var sql = `
SELECT count(1) access, sum(elapsed) elapsed, concat(DATE_FORMAT(createdt,'%e'), ' 日') name
  FROM sys_pl_log_request 
 Where DATE_FORMAT(createdt,'%Y') = ? 
   and DATE_FORMAT(createdt, '%c') = ? 
   And orgid = ?
 GROUP BY name`;

sql.query(sql, [year, mon, sys.request.org], 't1');

var option = {
  xAxis: {
    type: 'category', 
    data: genDay(),
  },
  "yAxis": [
    { "type": "value", "name": "访问次数" },
    { "type": "value", "name": "消耗时间(毫秒)" }
  ],
  "series": [{
    "type": "bar",
    'name': '访问次数'
  }, {
    'type': 'bar',
    'name': '消耗时间(毫秒)'  ,
    yAxisIndex: 1,
  }],
  dataset: {
    source: sys.result.t1,
    dimensions: ['name', 'access', 'elapsed'],
  }
};


sys.put('option', option);
sys.setRetData(0, 'ok');


function genDay() {
  var r = [];
  for (var i=0; i<29; ++i) {
    r.push(i + ' 日');
  }
  return r;
}