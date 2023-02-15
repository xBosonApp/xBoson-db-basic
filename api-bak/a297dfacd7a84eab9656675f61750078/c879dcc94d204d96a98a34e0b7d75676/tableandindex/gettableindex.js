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
//id:gettableindex
//name: 获取指定表的索引
var org = sys.request.org;  
var did = sys.request.did;  //数据库id
var en = sys.request.en;    //表名称
var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;
if(pagesize == null){
    pagesize = 10;
}
if(pagenum == null){
    pagenum == 1;
}
if(did == null || en == null){
    sys.setRetData("1");
    return;
}

//获取数据库名称，类型等
//获取数据库类型等
var getinfo = "select dbtype from sys_pl_drm_ds001 where did=? ";
var getinfo_params = [did];
if(did != "00000000000000000000000000000000"){
    getinfo = getinfo + " and owner=? and status='1'";
    list.add(getinfo_params,org);
}
var getinfo_cnt = sql.query(getinfo,getinfo_params,"dbinfo");
if(getinfo_cnt==0){
    sys.setRetData("2");
    return;
}
var dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型

//获取指定数据库中指定表的索引(索引名称，列的顺序，列名，升序降序，注释)

var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//获取表索引语句
var getSql_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"03"],"sql_r");
if(getSql_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getindex = sys.result.sql_r[0].sqltext;
//获取当前schema的sql语句
getSql_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql1_r");
if(getSql_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getschema = sys.result.sql1_r[0].sqltext;
//检查表是否存在语句
getSql_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql2_r");
if(getSql_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var strucsql=sys.result.sql2_r[0].sqltext; 

//连接外部数据源
var current_schema=org;
if(did != "00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常！");
        return;
    }
    //如果不是平台数据源，则当前schema为获取到的schema
    getSql_cnt=se.query(getschema,null,"schemanm_r");
    if(getSql_cnt == 0){
        sys.setRetData("2","获取schema异常");
        return;
    }
    current_schema=sys.result.schemanm_r[0].schema_name;
    
}
//检查表是否存在
if(se.query(strucsql,[current_schema,en],"chek")==0){
    sys.setRetData("2","表不存在");
    return;
}
//获取表索引
var params = [current_schema,en];
se.query(getindex,params,"result",false);
// sql.queryPaging(getindex,params,pagenum,pagesize);
//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}

sys.setRetData("0","","result");