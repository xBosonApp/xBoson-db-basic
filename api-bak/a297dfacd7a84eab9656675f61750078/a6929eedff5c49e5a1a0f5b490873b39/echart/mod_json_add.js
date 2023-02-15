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
var modid  = sys.request.modid;
var modnm  = sys.request.modnm;
var jsondata  = sys.request.jsondata;
var modtype = sys.request.modtype;
var shareable = sys.request.shareable;
var typecd = sys.request.modolcd;
var apiid = sys.request.apiid;
var formhtml = sys.request.formhtml;
var copy = sys.request.copy;
var savesql="";
var paramIns=[];
var rsmod = "";
var res =[];
var systag = sys.request.systag;
var dt = sys.currentTimeString();
//必填参数
if(modnm==null||modtype==null){
    sys.setRetData("1");
    return;
}
  if("1"==systag){pid="sys00000000000000000000000001000";}
  sql.query(" select count(1) ct from sys_mod_kpi where pid=? and modtype=? and modnm=? ",[pid,modtype,modnm],"counts");
  
  if(null==modid){
      if("0"==sys.result.counts[0].ct){
          rsmod = sys.getUUID();
          savesql = "INSERT INTO sys_mod_kpi(pid, modid, modnm,jsondata, createdt, updatedt,modtype,shareable,typecd,apiid,formhtml) VALUES(?,?,?,? ,?,?,?,?,?,?,?)" ;
          if(copy!=null){
            sql.query("select * from sys_mod_kpi where modid=?",[copy],"copy");
            var _copy = sys.result.copy[0];
            typecd = _copy.typecd;
            apiid = _copy.apiid;
            formhtml = _copy.formhtml;
          }
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
      if(null!=modpid&&modpid!=pid){
          sys.setRetData("w","当前模块属与系统用户，请另存！");
          return;
      }
      else{
          savesql = "update sys_mod_kpi set modnm=?, modtype=?, jsondata=? ,updatedt=?,shareable=?,typecd=?,apiid=?,formhtml=? where pid = ? and modid=? " ;
          paramIns = [modnm,modtype,jsondata,dt,shareable,typecd,apiid,formhtml,pid,modid];
          rsmod=modid;
          sql.update(savesql,paramIns);
      }
  }
  //"modid":rsmod
  res =[{"data":rsmod,"upflag":"0"==sys.result.counts[0].ct,"modnm":modnm,"jsondata":jsondata,"modtype":modtype,"shareable":shareable,"modolcd":typecd,"apiid":apiid}];
  sys.addRetData(res, "res");																			
  sys.addRetData(false,"name_duplicate");
  sys.setRetData("0","", "res","name_duplicate");