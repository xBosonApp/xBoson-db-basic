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
//id:deletetableindex
//name:删除指定表的索引

var org = sys.request.org;
var typecd = sys.request.typecd;
var did = sys.request.did;      //数据源id
var en = sys.request.en;        //表名
var index_name = sys.request.index_name;        //索引名

//验证参数
if(typecd == null || did == null || en==null || index_name == null){
    sys.setRetData("1");
    return;
}

//验证索引是否存在

//获取数据源id对应的数据库物理名称和数据库类型
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
var endbtype = sys.result.dbinfo;
// var dbschema = endbtype[0].en;      //数据源schema
var dbtype = endbtype[0].dbtype;    //数据源数据库类型


//获取sql语句（检查表是否存在语句）
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//检查表是否存在语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//检查索引是否存在语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"08"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//删除索引语句
var sql2_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"18"],"sql2_r");
if(sql2_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//检查索引是否是主键索引语句
var sql3_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"19"],"sql3_r");
if(sql3_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var selSql = sys.result.sql0_r[0].sqltext;
var selIndexSql = sys.result.sql1_r[0].sqltext;
var delSql = sys.result.sql2_r[0].sqltext;
delSql = sys.replace(delSql,"p_indexnm",index_name);
delSql = sys.replace(delSql,"p_tablenm",en);
var checkPKSql = sys.result.sql3_r[0].sqltext;
//获取当前schema语句
var sql4_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql4_r");
if(sql4_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var selSchema = sys.result.sql4_r[0].sqltext;

//连接外部数据源
var current_schema="";
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
}else{
    current_schema=org;
}
//获取当前schema
var selSchema_cnt=se.query(selSchema,null,"selschema_r");
if(selSchema_cnt==0){
    sys.setRetData("2","异常");
    return;
}
if(current_schema!=""){
    current_schema=sys.result.selschema_r[0].schema_name;
}
var _cnt = se.query(selSql,[current_schema,en],"result",false);
if(_cnt == 0){
    sys.setRetData("1","表不存在");
    return;
}
var _cnt0 = se.query(selIndexSql,[current_schema,en,index_name],"result",false);
if(_cnt0 == 0){
    sys.setRetData("1","索引不存在或已删除！");
    return;
}
//判断是否是主键索引
var checkPKSql_cnt = se.query(checkPKSql,[current_schema,en,index_name],"checkpk_r",false);
// if(checkPKSql_cnt == 0){
//     sys.setRetData("2","获取是否主键sql语句执行异常！");
//     return;
// }
if(checkPKSql_cnt > 0){
    if(sys.result.checkpk_r[0].is_pk == "1"){
        sys.setRetData("1","主键不可删除！");
        return;
    }
}

sql.update(delSql,[]);
//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}

//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});    
sys.setRetData("0");