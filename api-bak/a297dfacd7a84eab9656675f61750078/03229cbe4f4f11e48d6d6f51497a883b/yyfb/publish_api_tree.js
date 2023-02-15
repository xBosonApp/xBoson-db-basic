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

var sqls ="SELECT distinct appid FROM  sys_role_api a WHERE EXISTS ( SELECT 1 FROM sys_user_role WHERE a.roleid=roleid and status=1 AND pid=? UNION SELECT roleid FROM sys_dept_role b,sys_user_dept c WHERE a.roleid=roleid and b.deptid=c.deptid AND b.status=1 AND c.status=1 AND pid=? )";

sql.query(sqls,[pid,pid],"appid");
var sqlstr ="";
for(i in sys.result.appid){
    sqlstr = sqlstr+",'"+i.appid+"'";
}
sqlstr=sys.subString(sqlstr,1);

if(""!=sqlstr){
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(dbType == "01"){
        //SELECT contentid, stability,updatedt FROM (SELECT contentid, stability,updatedt FROM sys_api_his_content WHERE stability = '50' or stability = '60' ORDER BY updatedt DESC) d GROUP BY contentid ORDER BY updatedt DESC
       sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid) id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c ,( SELECT contentid, stability, updatedt FROM sys_api_content WHERE stability = 50 UNION SELECT contentid, stability, updatedt from sys_api_his_content where (contentid,updatedt) in (select DISTINCT contentid,max(updatedt) from sys_api_his_content WHERE (stability='50' or stability='60') group by contentid) ) e WHERE c.contentid=e.contentid AND e.stability=50 AND appid IN ("+sqlstr+")) aa ORDER BY name "; 
     }else if(dbType == "02"){
       sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid + '--'+ moduleid id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid +'--' + moduleid + '--' + apiid id,appid + '--'+ moduleid pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c ,( SELECT contentid, stability, updatedt FROM sys_api_content WHERE stability = 50 UNION SELECT contentid,stability,updatedt FROM sys_api_his_content WHERE contentid+CONVERT(varchar(100), updatedt, 25) IN ( SELECT DISTINCT contentid+CONVERT(varchar(100), MAX (updatedt), 25)	FROM sys_api_his_content WHERE ( stability = '50' OR stability = '60') GROUP BY contentid)	) e WHERE c.contentid=e.contentid AND e.stability=50 AND appid IN ("+sqlstr+")) aa ORDER BY name ";
     }else if(dbType == "03"){
      sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,'false' chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid ||'--'|| moduleid id, appid pid, modulenm name ,'false' checked,'false' chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid ||'--'|| moduleid || '--'|| apiid id,appid||'--'||moduleid  pid,apinm name ,'false' checked,'false' chkDisabled,'false' isparient FROM sys_apis c ,( SELECT contentid, stability, updatedt FROM sys_api_content WHERE stability = 50 UNION SELECT contentid, stability,updatedt FROM (SELECT contentid, stability,updatedt FROM sys_api_his_content WHERE stability = '50' or stability = '60' ORDER BY updatedt DESC) d GROUP BY contentid ORDER BY updatedt DESC ) e WHERE c.contentid=e.contentid AND e.stability=50 AND appid IN ("+sqlstr+")) aa ORDER BY name ";   
     }
    sql.query(sqls,[],"result");
    sys.setRetData("0","","result");
    return;
}

sys.setRetData("1","未找到数据！");