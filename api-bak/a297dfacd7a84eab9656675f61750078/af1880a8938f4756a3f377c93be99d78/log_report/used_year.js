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
Select t.value, concat(e*300, '~', (e+1)*300, ' ms') name 
From (
	SELECT count(1) value, floor(elapsed/300) e
	  FROM sys_pl_log_request r
	 Where DATE_FORMAT(r.createdt,'%Y') = ? And orgid = ?
	 GROUP BY e
 ) t
`

sql.query(sql, [year, sys.request.org], 't1');

var series = {
  type: 'pie',
  data: sys.result.t1,
  startAngle: '11',
};
sys.put('series', series);
sys.setRetData(0, 'ok');