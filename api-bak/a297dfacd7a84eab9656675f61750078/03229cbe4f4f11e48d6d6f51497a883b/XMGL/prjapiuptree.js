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
var prjid=sys.request.prjid;
if(prjid==null){
    sys.setRetData("1", "项目ID为空");
    return;
}

// copy from prjapis
var sql="select distinct sys_role_api.appid appid";
sql=sql+" from sys_role_api sys_role_api,";
sql=sql+"      (";
sql=sql+"       select ugrole.roleid roleid from sys_role_ug ugrole,sys_prj prj,sys_ug ug,sys_role role";
sql=sql+"       where prj.prjid=? and prj.ugid=ugrole.ugid and ugrole.ugid=ug.ugid and ugrole.roleid=role.roleid";
sql=sql+"         and role.status='1' and ug.status='1' and prj.status='1' and ugrole.status='1' and role.status='1'";
sql=sql+"      ) prjrole";
sql=sql+" where sys_role_api.roleid=prjrole.roleid";
sql=sql+"   and sys_role_api.status='1'";
sql.query(sql, [prjid], "appid");
var sqlstr = "";
for (i in sys.result.appid) {
    sqlstr = sqlstr + ",'" + i.appid+ "'";
}
sqlstr = sys.subString(sqlstr, 1);

if(""!=sqlstr){
    var sqls="";
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if (dbType == "01"){
      sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid) id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,concat(appid,'--',moduleid,'--',apiid) id,concat(appid,'--',moduleid) pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a,sys_api_content b WHERE a.contentid=b.contentid and b.stability='30' and a.appid in ("+sqlstr+")) aa ORDER BY name ";  
    }else if(dbType == "02"){
     sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid + '--'+ moduleid id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid+ '--'+ moduleid+ '--'+ apiid id,appid+ '--' + moduleid pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a,sys_api_content b WHERE a.contentid=b.contentid and b.stability='30' and a.appid in ("+sqlstr+")) aa ORDER BY name ";   
    }else if(dbType == "03"){
      sqls="SELECT * FROM (SELECT appid,appid id,'' pid, appnm name,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled, 'true' isparient FROM sys_apps a WHERE a.appid in ("+sqlstr+") union all SELECT appid,appid|| '--'|| moduleid id, appid pid, modulenm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'true' isparient FROM sys_modules b where b.appid in ("+sqlstr+") union all SELECT appid,appid|| '--'|| moduleid|| '--'|| apiid id,appid|| '--'|| moduleid pid, apinm name ,'false' checked,CASE WHEN status=1 THEN 'fasle' ELSE 'true' end chkDisabled,'false' isparient FROM sys_apis a,sys_api_content b WHERE a.contentid=b.contentid and b.stability='30' and a.appid in ("+sqlstr+")) aa ORDER BY name ";  
    }

    sql.query(sqls,[],"result");
    sys.setRetData("0","","result");
    return;
}
sys.addRetData([],"result");
sys.setRetData("0","","result");