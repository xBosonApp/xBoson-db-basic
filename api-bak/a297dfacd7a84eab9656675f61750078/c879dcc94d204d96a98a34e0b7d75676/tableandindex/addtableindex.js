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
//id:addtableindex
//name:添加指定表的索引

var org = sys.request.org;
var typecd = sys.request.typecd;    //typecd
var did = sys.request.did;  //数据源id
var en = sys.request.en;    //索引物理名称
var table = sys.request.table;    //表名
// var cn = sys.request.cn;    //索引中文名称
var fields = sys.request.fields;    //表字段物理名称字符串
var mark = sys.request.mark;    //说明

//验证参数
if(typecd == null || en == null || fields == null || did == null || table==null){
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

//获取sql语句（检查索引是否存在语句，创建索引语句）
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"08"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"09"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var selIndexSql = sys.result.sql0_r[0].sqltext;
var addindex = sys.result.sql1_r[0].sqltext;
addindex = sys.replace(addindex,"p_idname",en);
addindex = sys.replace(addindex,"p_tname",table);
addindex = sys.replace(addindex,"p_fields",fields);


try{
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
    var _cnt0 = se.query(selIndexSql,[org,table,en],"result",false);
    if(_cnt0 > 0){
        sys.setRetData("1","索引已存在，请刷新！");
        return;
    }
    sql.update(addindex,[]);
    //恢复连接
    if(did != "00000000000000000000000000000000"){
        sql.connection();
    }
    
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});    
    sys.setRetData("0");
}catch(error){
    sys.setRetData("1","添加索引失败，请检查选择的索引信息（列是否存在）是否正确！");
    return;
}