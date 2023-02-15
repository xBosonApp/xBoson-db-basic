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
//id:getgriddata
//name:获取动态表格数据

var org = sys.request.org;
var typecd = sys.request.typecd;
var en = sys.request.en;    //物理表名
var did = sys.request.did;
var where = sys.request.wherearea;  //where条件
var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;
if(pagesize == null){
    pagesize = 10;
}
if(pagenum == null){
    pagenum = 1;
}
if(typecd == null || en==null || did == null){
    sys.setRetData("1");
    return;
}

//判断where是否以order by 或group by开头
var isorderby=false,isgroupby=false;
{
    var lowerWhe=sys.toLowerCase(sys.trim(where));
    if(sys.regexFind("^order\\s+by\\s+",lowerWhe)){
        isorderby=true;
    }
    if(sys.regexFind("^group\\s+by\\s+",lowerWhe)){
        isgroupby=true;
    }
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
// var dbschema = sys.result.dbinfo[0].en;   //数据库schema
var dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型
//获取sql语句（检查表是否存在语句）
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//检查表是否存在语句(参数：表名)
var strucsql=sys.result.sql0_r[0].sqltext;
var selSql="";
try{
    //连接外部数据源
    if(did != "00000000000000000000000000000000"){
        sql.connection(did);
    }
    //检查表是否存在
    var _cnt = se.query(strucsql,[org,en],"result",false);
    if(_cnt == 0){
        sys.setRetData("2","表不存在！");
        return;
    }
    //select数据
    selSql = "select * from "+en;
    if(where != null){
        if(isorderby||isgroupby){
            selSql = selSql+" "+where;
        }else{
            selSql = selSql + " where "+where;
        }
    }
    sql.queryPaging(selSql,[],pagenum,pagesize,"data");
    //恢复连接
    if(did != "00000000000000000000000000000000"){
        sql.connection();
    }
    
    //获取列名
    var getTitle = "select en,cn,sorting from sys_md_mm002 where typecd=? order by sorting";
    sql.query(getTitle,[typecd],"type");
    var type = sys.result.type;
    for(r in type){
        map.put(r,"view","1");
        map.put(r,"ro","0");
        map.put(r,"search","0");
        map.put(r,"must", "1");
        map.put(r,"elemtype", "text");
        map.put(r,"datatype", "s");
        map.put(r,"numrange", "20");
        map.put(r,"dict", "");
    }
    sys.setRetData("0","","type","data");
}catch(error){
    sys.setRetData("2","sql语句执行异常，请检查("+selSql+")");
    return;
}