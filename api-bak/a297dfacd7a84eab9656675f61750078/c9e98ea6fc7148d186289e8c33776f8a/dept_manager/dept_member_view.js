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
//liufengyuan

var deptid=sys.request.deptid;
var orgid=sys.request.org;
if(null==deptid || null==orgid){
    sys.setRetData("1");
    return;
}
//判断数据库类型
 var dbType = se.dbType();
//01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
 var sql1;
 if(dbType == '01'){
    sql1= "select a.pid id,b.de0201039 name,CASE WHEN a.pid IN (SELECT pid FROM sys_user_dept WHERE deptid=? ) THEN 'true' ELSE 'false' END checked,concat('性别：',case when b.de0201040='1' then '男' WHEN b.de0201040='2' then '女' else '' end,' 电话：',IFNULL(b.de0201010,''),' 邮箱：',IFNULL(b.de0201012,'')) title from sys_tenant_user a left join mdm_personal_info b on a.pid=b.pid and a.status='1' where a.orgid=? and a.status='1' ORDER BY convert(name using gbk) asc";
 }else if(dbType == '02'){
    sql1= "select a.pid id,b.de0201039 name,CASE WHEN a.pid IN (SELECT pid FROM sys_user_dept WHERE deptid=? ) THEN 'true' ELSE 'false' END checked,'性别：'+ case when b.de0201040='1' then '男' WHEN b.de0201040='2' then '女' else '' end + ' 电话：' + ISNULL(b.de0201010,'') + ' 邮箱：' + ISNULL(b.de0201012,'') title from sys_tenant_user a left join mdm_personal_info b on a.pid=b.pid and a.status='1' where a.orgid=? and a.status='1' ORDER BY name  asc";
 }else if(dbType == '03'){
   sql1="select a.pid id,b.de0201039 name,CASE WHEN a.pid IN (SELECT pid FROM sys_user_dept WHERE deptid=? ) THEN 'true' ELSE 'false' END checked,'性别：'|| case when b.de0201040='1' then '男' WHEN b.de0201040='2' then '女' else '' end || ' 电话：'|| VAL(b.de0201010,'') || ' 邮箱：'|| VAL(b.de0201012,'')) title from sys_tenant_user a left join mdm_personal_info b on a.pid=b.pid and a.status='1' where a.orgid=? and a.status='1' ORDER BY name  asc";  
 }

var param=[deptid,orgid];
sql.query(sql1,param,"result");
sys.setRetData("0","","result");