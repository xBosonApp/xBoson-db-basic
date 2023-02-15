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
var pid = sys.getUserPID(sys.request.openid);
    
  var sqlpid = " select distinct (case when pid='sys00000000000000000000000001000' then 0 "
  +" when (pid<>? and shareable='1') then 2 else 1 end ) id, (case when pid='sys00000000000000000000000001000' then '系统定义' "
  +" when (pid<>? and shareable='1') then '他人共享' else '用户自定义' end ) name  FROM sys_mod_kpi "
  +" where pid = 'sys00000000000000000000000001000' or pid = ? or (pid<>? and shareable='1') ";
  
  var sqltype = " select distinct (case when pid='sys00000000000000000000000001000' then 0 "
  +" when (pid<>? and shareable='1') then 2 else 1 end ) id,modtype, modtype name FROM sys_mod_kpi where "
  +" pid = 'sys00000000000000000000000001000' or pid = ?  or (pid<>? and shareable='1') ";
  
  var sqlmod = " select (case when pid='sys00000000000000000000000001000' then 0 "
  +" when (pid<>? and shareable='1') then '2' else '1' end ) id,modtype,modid,modnm name,jsondata FROM sys_mod_kpi WHERE pid = ? or "
  +" pid = 'sys00000000000000000000000001000' or (pid<>? and shareable='1') ";
  
  sql.query(sqlpid, [pid,pid,pid,pid], "pids");
  var pids = sys.result.pids;
  
  sql.query(sqltype, [pid,pid,pid], "sqltypes");
  var sqltypes = sys.result.sqltypes;
  
  sql.query(sqlmod, [pid,pid,pid], "mods");
  var mods = sys.result.mods;
   
  sys.setRetList(sqltypes, mods, [["id", "id"],["modtype", "modtype"]], "children");
  sys.setRetList(pids, sqltypes, [["id", "id"]], "children");
  
  sys.setRetData("0","","pids");