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

var pagenum  = sys.request.pagenum  || 1;
var pagesize = sys.request.pagesize || 10;
var pcount   = sys.request.count    || null;

var hasWhere = 0;
var bind = [];
var ssql = [`
  Select m.*, c.standardname cri_name, r.rname, ws.wsname
    From ns_ex_mapper m
    left join ns_ex_cri c
      on c.criid = m.criid
    left join ns_ex_remote r
      on r.rtid = m.rtid
    left join sys_webservice ws
      on ws.wsid = m.wsid `];

//
// 这些都可以通过 http 参数传入作为查询条件
//
addCC('map_name',     'map_name like ?', true);
addCC('cri_name',     'c.standardname like ?', true);
addCC('rname',        'r.rname like ?', true);
addCC('wsname',       'ws.wsname like ?', true);
addCC('sourceorgan',  'sourceorgan like ?', true);
addCC('sourcedomain', 'sourcedomain like ?', true);
addCC('targetorgan',  'targetorgan like ?', true);
addCC('targetdomain', 'targetdomain like ?', true);
addCC('status',       'm.status = ?');

sql.queryPaging(ssql.join(''), bind, pagenum, pagesize, "data", pcount);
sys.setRetData(0, 'data-list', 'data');


function addCC(name, stat, islike) {
  var bv = sys.request[name];
  if (!bv) return;
  
  if (islike) bv = '%'+ bv +'%';
  bind.push(bv);
  
  if (! hasWhere) {
    ssql.push(" Where ");
    hasWhere = 1;
  } else {
    ssql.push(" And ");
  }
  ssql.push(stat);
}