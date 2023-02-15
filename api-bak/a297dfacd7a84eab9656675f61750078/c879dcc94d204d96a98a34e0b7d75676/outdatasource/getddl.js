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
var org = sys.request.org;
var did = sys.request.did;  //数据源id
var schema_name = sys.request.table_schema;  //schema名
var table_name = sys.request.table_name;    //表名

if(did==null||table_name==null){
    sys.setRetData("1");
    return;
}

if (table_name.indexOf("'") >= 0) {
  sys.setRetData("1","table_name 带有非法字符");
  return;
}

//获取did对应的数据库类型
var dbtype="";
if(sql.query("select dbtype from sys_pl_drm_ds001 where did=? and status='1'",[did],"dbtypeR")>0){
    dbtype=sys.result.dbtypeR[0].dbtype;
}else{
    sys.setRetData("2","数据库did不存在或无效");
    return;
}

//获取SQL语句
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//获取当前schema的sql语句
var getSql_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql1_r");
if(getSql_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getschema = sys.result.sql1_r[0].sqltext;

if(did!="00000000000000000000000000000000"){
    sql.connection(did);
}

if(schema_name==null){
    if(did!="00000000000000000000000000000000"){
        
        //如果不是平台数据源，则当前schema为获取到的schema
        getSql_cnt=se.query(getschema,null,"schemanm_r");
        if(getSql_cnt == 0){
            sys.setRetData("2","获取schema异常");
            return;
        }
        schema_name=sys.result.schemanm_r[0].schema_name;
    }else{
        schema_name=org;
    }
} else if (schema_name.indexOf("'") >= 0) {
  sys.setRetData("1","schema_name 带有非法字符");
  return;
}

var sql="",cnt=0;
var iscatch=false, catchmsg="";

//mysql
if(dbtype=="01"){
    sql="show create table "+schema_name+"."+table_name;
    try{
        var a=1;    //预防try catch报错bug
        cnt=se.query(sql,null);    
    }catch(e){
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("2","SQL异常："+catchmsg);
        return;
    }
    if(cnt>0){
        sys.addRetData(sys.result.result[0]["Create Table"],"data");
    }else{
        sys.setRetData("2","异常");
        return;
    }
}
//sqlserver
else if(dbtype=="02"){
    sys.addRetData("data","");    
}
//oracle
else if(dbtype=="03"){
    sql="SELECT DBMS_METADATA.GET_DDL('TABLE', '"+table_name+"','"+schema_name+"') as ddlsql FROM dual";
    try{
        var a=1;    //预防try catch报错bug
        cnt=se.query(sql,null);    
    }catch(e){
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("2","SQL异常："+catchmsg);
        return;
    }
    if(cnt>0){
        sys.addRetData(sys.result.result[0]["ddlsql"],"data");
    }else{
        sys.setRetData("2","异常");
        return;
    }
}
//db2
else if(dbtype=="04"){
    sys.addRetData("data","");
}

sys.setRetData("0", "", "data");