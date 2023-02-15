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
var pid = sys.getUserPID(sys.request.openid),
      pageid = sys.request.pageid,
      domid = sys.request.domid,
      modid  = sys.request.modid,
      optdata = sys.request.optdata,
      ct = "";
      var dt = sys.currentTimeString();
  sql.query("select count(1) ct from sys_user_html where pid = ? and pageid = ? and domid = ? ",[pid,pageid,domid],"counts");

  if(sys.result.counts[0].ct == "0"){
    var savesql = "Insert into sys_user_html(pid, pageid, domid, modid, optdata, createdt, updatedt)  values(?,?,?,?,?,?,?)" ;
    var paramIns = [pid, pageid, domid, modid,optdata,dt,dt];
    var upcount = sql.update(savesql,paramIns);
  } else {
    var savesql = "update sys_user_html set modid = ? , optdata = ?,  updatedt = ? where pid = ? and pageid = ? and domid = ?" ;
    var paramIns = [modid,optdata,dt,pid, pageid, domid];
    var upcount = sql.update(savesql,paramIns);
  }
  
  sys.setRetData("0");