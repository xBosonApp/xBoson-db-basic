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
//id:getouttablecolumns
//name:获取外部数据源表列

var org = sys.request.org;
var did = sys.request.did;
var table_schema = sys.request.table_schema;
var table_name = sys.request.table_name;

if(did == null || table_schema == null || table_name == null){
    sys.setRetData("1");
    return;
}

//获取外部数据源的类型
//获取数据库类型等
var getinfo="select dbtype from sys_pl_drm_ds001 where did=? and status='1'";
var getinfo_params = [did];
if(did != "00000000000000000000000000000000"){
    getinfo = getinfo + " and owner=?";
    list.add(getinfo_params,org);
}
var getinfo_cnt = sql.query(getinfo,getinfo_params,"dbinfo");
if(getinfo_cnt==0){
    sys.setRetData("2");
    return;
}
var dbtype_R = sys.result.dbinfo;
var dbtype = dbtype_R[0].dbtype;
// var dbschema = dbtype_R[0].dbschema;
//获取sql语句
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//获取列信息SQL语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"02"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getcolumns=sys.result.sql0_r[0].sqltext;
//连接外部数据源
if(did != "00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("1","连接数据源异常");
        return;
    }
}
//获取表
sys.printValue(getcolumns);
//获取sql语句中参数个数
var tmp_sql = sys.replace(getcolumns,"?","??");
var tmp_num = sys.length(tmp_sql)-sys.length(getcolumns);
var gc_params=[table_schema,table_name];
if(tmp_num == 1){
    gc_params=[table_name];
}
se.query(getcolumns,gc_params,"result",false);
//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}

var result = sys.result.result;
//转换结构(添加column_type,column_key,column_comment字段)
for(r in result){
    if(r.character_maximum_length != null && r.character_maximum_length != ""){
        map.put(r,"column_type",r.data_type+"("+r.character_maximum_length+")");
    }else if(r.numeric_precision != "" && r.numeric_scale != ""){
        map.put(r,"column_type",r.data_type+"("+r.numeric_precision+","+r.numeric_scale+")");
    }else{
        map.put(r,"column_type",r.data_type);
    }
    if(!map.containsKey(r,"column_key")){
        map.put(r,"column_key","");    
    }
    // map.put(r,"column_comment","");
}

sys.setRetData("0","","result");