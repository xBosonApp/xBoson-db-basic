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
var openid =sys.request.openid;
var pid = sys.getUserPID(openid);
var roleid=sys.request.roleid;

if(roleid == null){
  sys.setRetData("1");
  return;
}
var sqls ="SELECT distinct appid FROM  sys_role_api a WHERE ";
if(roleid!=null){
    sqls=sqls+" a.roleid=? and ";
}
sqls=sqls+"EXISTS ( SELECT 1 FROM sys_user_role WHERE a.roleid=roleid and status=1 AND pid=? UNION SELECT roleid FROM sys_dept_role b,sys_user_dept c WHERE a.roleid=roleid and b.deptid=c.deptid AND b.status=1 AND c.status=1 AND pid=? )";
var param=[pid,pid];
if(roleid!=null){
    param=[roleid,pid,pid];
}
sql.query(sqls,param,"appid");
var sqlstr ="";
for(i in sys.result.appid){
    sqlstr = sqlstr+",'"+i.appid+"'";
}
sqlstr=sys.subString(sqlstr,1);


//存储已经下线的contentid
 var tmpcid=[];
 sqls = "select * from (select contentid,updatedt,stability FROM sys_api_content where stability='60' union SELECT contentid,updatedt,stability FROM sys_api_his_content WHERE stability='50' OR stability='60' ) aa ORDER BY contentid,updatedt desc ";
var count=sql.query(sqls,[],"cid");
if(count>0){
    var cid = "";
    for(i in sys.result.cid){
        if(cid!=i.contentid && i.stability=="60"){
            list.add(tmpcid,i);
        }
        cid=i.contentid;
    }
}

if(""!=sqlstr){
    sqls="";
    var cidstr = "";
    for(i in tmpcid){
        cidstr = cidstr+",'"+i.contentid+"'";
    }
    cidstr=sys.subString(cidstr,1);
            //判断数据库类型
       var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(""!=cidstr){
        sqls="SELECT DISTINCT contentid FROM sys_api_his_content WHERE stability=50 AND contentid NOT IN("+cidstr+")";
        if(dbType == "01"){
             sqls="union SELECT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis where contentid in ("+sqls+") AND appid IN ("+sqlstr+") ";
         }else if(dbType == "02"){
            sqls="union SELECT appid,appid + '--' + '--'+ apiid id,appid+'--'+ moduleid  pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis where contentid in ("+sqls+") AND appid IN ("+sqlstr+") ";  
         }else if(dbType == "03"){
           sqls="union SELECT appid,appid || '--'|| moduleid||'--'||apiid id,appid||'--'|| moduleid pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis where contentid in ("+sqls+") AND appid IN ("+sqlstr+") ";   
         }
    }
     if(dbType == "01"){
        sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid) id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT DISTINCT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c WHERE c.contentid IN ( SELECT contentid FROM sys_api_content  WHERE stability = 50 ) AND appid IN ("+sqlstr+") "+sqls+") aa "; 
     }else if(dbType == "02"){
        sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid + '--'+ moduleid id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT DISTINCT appid,appid +'--'+ moduleid + '--'+ apiid id,appid + '--'+ moduleid  pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c WHERE c.contentid IN ( SELECT contentid FROM sys_api_content  WHERE stability = 50 ) AND appid IN ("+sqlstr+") "+sqls+") aa ";   
     }else if(dbType == "03"){
        sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid||'--'||moduleid id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT DISTINCT appid,appid||'--'||moduleid||'--'||apiid id,appid || '--'|| moduleid pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c WHERE c.contentid IN ( SELECT contentid FROM sys_api_content  WHERE stability = 50 ) AND appid IN ("+sqlstr+") "+sqls+") aa ";   
     }

// UNION SELECT contentid, stability,updatedt FROM (SELECT contentid, stability,updatedt FROM sys_api_his_content WHERE stability = '50' or stability = '60' ORDER BY updatedt DESC) d GROUP BY contentid ORDER BY updatedt DESC ) e WHERE c.contentid=e.contentid AND e.stability='50'
    sql.query(sqls,[],"result");
    sys.setRetData("0","","result");
    return;
}
sys.addRetData([],"result");
sys.setRetData("0","","result");
// sys.setRetData("1","未找到数据！");