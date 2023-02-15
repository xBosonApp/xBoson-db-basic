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
SELECT count(1) value, r.appid, a.appnm name
  FROM sys_pl_log_request r
  left join sys_apps a
    on a.appid = r.appid
 Where DATE_FORMAT(r.createdt,'%Y') = ? and DATE_FORMAT(r.createdt, '%c') = ? And orgid = ?
 GROUP BY r.appid `

sql.query(sql, [year, mon, sys.request.org], 't1');

var series = {
  type: 'pie',
  roseType: 'angle',
  data: sys.result.t1,
};
sys.put('series', series);
sys.setRetData(0, 'ok');