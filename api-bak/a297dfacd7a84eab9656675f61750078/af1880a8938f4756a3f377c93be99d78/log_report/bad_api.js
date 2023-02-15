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
var day  = sys.request.getInteger('day', false, 1, 31);
var hour = sys.request.getInteger('hour', false, 1, 60);
var sec  = sys.request.getInteger('sec', false, 1, 60);

var sql = `
Select createdt, elapsed, orgid, log, '' c
  From sys_pl_log_request
 Where DATE_FORMAT(createdt, '%Y') = ? 
   and DATE_FORMAT(createdt, '%c') = ?
   and DATE_FORMAT(createdt, '%d') = ?
   and DATE_FORMAT(createdt, '%k') = ?
   and DATE_FORMAT(createdt, '%i') = ?
   And orgid = ?
 Order BY elapsed DESC
 limit 10`;
 
sql.query(sql, [year, mon, day, hour, sec, sys.request.org], 'data');
sys.setRetData(0, 'ok', 'data');