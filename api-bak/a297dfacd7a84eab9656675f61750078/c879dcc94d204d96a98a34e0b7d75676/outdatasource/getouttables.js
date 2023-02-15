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
//id:getouttables
//name:获取外部数据源表
var org = sys.request.org;
var did = sys.request.did;
var schema_name = sys.request.schema_name;
// var flag = sys.request.flag;      //1:表示schema, 2:表示表

if(did == null){
    sys.setRetData("1");
    return;
}
// if(flag == "2" && schema_name == null){
//     sys.setRetData("1","缺少参数：schema_name");
//     return;
// }
//获取外部数据源的类型
//获取数据库类型等
var getinfo="select dbtype from sys_pl_drm_ds001 where did=? and status='1'";
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
var dbtype_R = sys.result.dbinfo;
var dbtype = dbtype_R[0].dbtype;
//获取sql语句
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
////查询数据源Schema的SQL语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getschema=sys.result.sql0_r[0].sqltext;
//查询用户表sql语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"17"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getTables=sys.result.sql1_r[0].sqltext;
//连接外部数据源
if(did != "00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常，请检查数据源配置");
        return;
    }
    
}
// if(flag == "1"){
if(schema_name == null){
    if(did!="00000000000000000000000000000000"){
        //获取schema
        se.query(getschema,[],"result",false);
        sys.printValue(sys.result.result);
        //组装数据
        var result = sys.result.result;
        for(r in result){
            map.put(r,"shownm",r.schema_name);
            map.put(r,"did",did);
            map.put(r,"isParent",true);
        }
    }else{
        sys.addRetData([{
            "schema_name":org,
            "shownm":org,
            "did":"00000000000000000000000000000000",
            "isParent":true
        }],"result");
    }
    
}else{
   //获取getTables参数个数
    var gt_params=null;
    if(sys.contain(getTables,"?")){
        gt_params=[schema_name];
    }
    se.query(getTables,gt_params,"result",false); 
    //组装数据
    var result = sys.result.result;
    for(r in result){
        map.put(r,"shownm",r.table_name);
        map.put(r,"did",did);
    }
    //数据集物理表映射里是否存在这些表
    sql.connection();   //恢复连接
    if(result && sys.size(result)>0){
        var sql_ds_table="select typecd,en from sys_md_mm003 where did=? and en in (";
        for(r in result){
            sql_ds_table=sql_ds_table+"'"+r.table_name+"',";
        }
        //去除最后一个逗号
        sql_ds_table=sys.subStringTo(sql_ds_table,0,sys.length(sql_ds_table)-1)+")";
        sql.query(sql_ds_table,[did],"ds_tableR");
        var tmpMap={};
        for(r in sys.result.ds_tableR){
            map.put(tmpMap,r.en,r.typecd);
        }
        for(r in result){
            if(map.containsKey(tmpMap,r.table_name)){
                map.put(r,"tbl_typecd",tmpMap[r.table_name]);
                map.put(r,"shownm",r.shownm+"（"+tmpMap[r.table_name]+"）");
            }
        }    
    }
}

//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}

sys.setRetData("0","","result");