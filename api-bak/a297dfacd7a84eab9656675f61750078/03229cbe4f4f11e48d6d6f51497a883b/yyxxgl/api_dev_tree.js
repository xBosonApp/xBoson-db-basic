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
if(roleid==null){
    sys.setRetData("1");
    return;
}

// var sqls="SELECT * FROM ( SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_apps  UNION ALL SELECT appid,concat(appid,'--',moduleid) id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules UNION ALL SELECT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a WHERE EXISTS (SELECT 1 from sys_api_content b WHERE a.contentid=b.contentid AND b.stability in('50','60'))) bb WHERE EXISTS (SELECT DISTINCT roleid FROM sys_role_api d WHERE bb.appid = d.appid AND EXISTS (SELECT roleid FROM (SELECT distinct roleid FROM sys_user_role WHERE status = 1 AND pid = ? UNION SELECT DISTINCT roleid FROM sys_dept_role a LEFT JOIN sys_user_dept b ON a.deptid = b.deptid AND a.status = 1 AND b.status = 1 WHERE b.pid =? ) cc WHERE d.roleid = cc.roleid))  ORDER BY name ";

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

if(""!=sqlstr){
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(dbType == "01"){
       sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid) id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a , sys_api_content b WHERE a.contentid=b.contentid AND b.stability in('50','60') and a.appid in ("+sqlstr+")) aa ORDER BY name ";
      }else if(dbType == "02"){
          sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid+ '--'+ moduleid id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid + '--'+ moduleid + '--'+ apiid id,appid + '--'+ moduleid pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a , sys_api_content b WHERE a.contentid=b.contentid AND b.stability in('50','60') and a.appid in ("+sqlstr+")) aa ORDER BY name ";
      }else if(dbType == "03"){
    sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid || '--'|| moduleid id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid|| '--'|| moduleid|| '--'|| apiid id,appid|| '--'|| moduleid pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a , sys_api_content b WHERE a.contentid=b.contentid AND b.stability in('50','60') and a.appid in ("+sqlstr+")) aa ORDER BY name ";
     }
    sql.query(sqls,[],"result");
    sys.setRetData("0","","result");
    return;
}
sys.addRetData([],"result");
sys.setRetData("0","","result");
// sys.setRetData("1","未找到数据！");