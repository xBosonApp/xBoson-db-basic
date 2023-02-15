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

var sqls = [
  `Select 'total' type, count(1) v from sys_pl_log_request`,
  
  `Select 'year' type, count(1) v
     from sys_pl_log_request a
    where DATE_FORMAT(createdt,'%Y') = ? And orgid = ?`,
    
  `Select 'ring' type, count(1) v
     from sys_pl_log_request
    where DATE_FORMAT(createdt,'%Y') = ?-1 And orgid = ?`,
    
  `SELECT 'app' type, a.appnm v, count(1) x
	   FROM sys_pl_log_request r
	   left join sys_apps a
	     on a.appid = r.appid
	  Where DATE_FORMAT(r.createdt,'%Y') = ? And r.orgid = ?
	  GROUP BY r.appid
    order By x desc limit 1`,
    
  `SELECT count(1) value, r.orgid, a.de0810013j v, 'org' type
      FROM sys_pl_log_request r
      left join mdm_org a
        on a.orgid = r.orgid
     Where DATE_FORMAT(r.createdt,'%Y') = ?
     GROUP BY r.orgid 
     order by value desc 
     limit 1`,
     
  `SELECT 'badapp' type, concat(elapsed, 'ms ', log) v
     FROM sys_pl_log_request  
    where DATE_FORMAT(createdt,'%Y') = ? And orgid = ?
    order by elapsed desc
    limit 1`,
    
  `SELECT sum(elapsed) v, 'utime' type
     FROM sys_pl_log_request
    where DATE_FORMAT(createdt,'%Y') = ? And orgid = ?`,
];

var arg = [year, sys.request.org];
var data = {};
sqls.forEach(function(s) {
  sql.query(s, arg, 't');
  var r = sys.result.t[0];
  if (r) data[ r.type ] = r.v;
});

data.ring = rate(data.year, data.ring);
data.utime = utime(data.utime);

sys.put('data', data);
sys.setRetData(0, 'ok');


function utime(m) {
  try {
  if (isNaN(m)) return m;
  if (m > 1000*60*60) {
    return (m/(1000*60*60)).toFixed(2) + '小时';
  }
  if (m > 1000*60) {
    return (m/(1000*60)).toFixed(2) +'分钟';
  }
  if (m > 1000) {
    return (m/(1000)).toFixed(2) +"秒";
  }
  return m +'毫秒';
  } catch(e) {
    sys.printValue(e, typeof e);
    return m;
  }
}

function rate(a, b) {
  if (!a) return '';
  var r = (b ? (a - b)/b: 100);
  return (r<0 ? '减少 ':'增长 ') + r + "%";
}