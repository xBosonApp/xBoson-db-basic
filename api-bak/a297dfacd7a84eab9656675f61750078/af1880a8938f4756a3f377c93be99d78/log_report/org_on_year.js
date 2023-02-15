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

var sql = `
SELECT count(1) value, r.orgid, a.de0810013j name
  FROM sys_pl_log_request r
  left join mdm_org a
    on a.orgid = r.orgid
 Where DATE_FORMAT(r.createdt,'%Y') = ?
 GROUP BY r.orgid `

sql.query(sql, [year], 't1');

var series = {
  type: 'pie',
  data: sys.result.t1,
};
sys.put('series', series);
sys.setRetData(0, 'ok');