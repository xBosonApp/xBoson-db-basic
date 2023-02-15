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
  modid  = sys.request.modid,
  modnm  = sys.request.modnm,
  jsondata  = sys.request.jsondata,
  modtype = sys.request.modtype,
  shareable = sys.request.shareable,
  typecd = sys.request.modolcd,
  apiid = sys.request.apiid,
  formhtml = sys.request.formhtml,
  savesql="",
  paramIns=[],
  rsmod = "",
  res =[];
var dt = sys.currentTimeString();
//必填参数
if(modnm==null||modtype==null){
    sys.setRetData("1");
    return;
}
  sql.query(" select count(1) ct from sys_mod_kpi where modtype=? and modnm=? ",[modtype,modnm],"counts");
  
  if(null==modid){
      if("0"==sys.result.counts[0].ct){
          rsmod = sys.getUUID();
          savesql = "INSERT INTO sys_mod_kpi(pid, modid, modnm,jsondata, createdt, updatedt,modtype,shareable,typecd,apiid,formhtml) VALUES(?,?,?,? ,?,?,?,?,?,?,?)" ;
          paramIns = [pid, rsmod, modnm, jsondata,dt,dt,modtype,shareable,typecd,apiid,formhtml];
          sql.update(savesql,paramIns);
      }else{
          //已有相同模块名称
          sys.addRetData(true,"name_duplicate");
          sys.setRetData("0","","name_duplicate");
          return;
      }
      
  } else {
      sql.query("SELECT pid FROM sys_mod_kpi where modid=?",[modid],"modpid");
      var modpid = sys.result.modpid[0].pid;
      
      savesql = "update sys_mod_kpi set modnm=?, modtype=?, jsondata=? ,updatedt=?,shareable=?,typecd=?,apiid=?,formhtml=? where modid=? " ;
      paramIns = [modnm,modtype,jsondata,dt,shareable,typecd,apiid,formhtml,modid];
      rsmod=modid;
      sql.update(savesql,paramIns);
      
  }
  //"modid":rsmod
  res =[{"data":rsmod,"upflag":"0"==sys.result.counts[0].ct,"modnm":modnm,"jsondata":jsondata,"modtype":modtype,"shareable":shareable,"modolcd":typecd,"apiid":apiid}];
  sys.addRetData(res, "res");																			
  sys.addRetData(false,"name_duplicate");
  sys.setRetData("0","", "res","name_duplicate");