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

var bind = [];
var ssql = [ 'Select * From sys_webservice' ];
var hasWhere = 0;

//
// 这些都可以通过 http 参数传入作为查询条件
//
addCC('wsid', 'wsid = ?');
addCC('wsname', 'wsname like ?', true);
addCC('wsnote', 'wsnote like ?', true);
addCC('ws_mod_name', 'ws_mod_name like ?', true);
addCC('ws_func_name', 'ws_func_name like ?', true);
addCC('ws_uri', 'ws_uri like ?', true);
addCC('status', 'status = ?');

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