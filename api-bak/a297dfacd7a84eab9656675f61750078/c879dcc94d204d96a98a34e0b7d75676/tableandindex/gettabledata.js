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
//id:gettabledata
//name:获取指定表数据

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
//验证操作者机构是否含有en,did
//暂空

//判断where是否以order by 或group by开头
var isorderby=false;
var isgroupby=false;
var islimit=false;

{
    var lowerWhe=sys.toLowerCase(sys.trim(where));
    if(sys.regexFind("^order\\s+by\\s+",lowerWhe)){
        isorderby=true;
    }
    if(sys.regexFind("^group\\s+by\\s+",lowerWhe)){
        isgroupby=true;
    }
    if(sys.regexFind("^limit\\s+",lowerWhe)){
        islimit=true;
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
//获取当前schema语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var selschema=sys.result.sql1_r[0].sqltext; 
var selSql="";
try{
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
            sys.setRetData("1","连接数据源异常！");
            return;
        }
    }else{
        current_schema=org;
    }
    //获取当前schema
    var selschema_cnt=se.query(selschema,null,"selschema_r");
    if(selschema_cnt==0){
        sys.setRetData("2","异常");
        return;
    }
    if(current_schema==""){
        current_schema=sys.result.selschema_r[0].schema_name;
    }
    //检查表是否存在
    var _cnt = se.query(strucsql,[current_schema,en],"result",false);
    if(_cnt == 0){
        sys.setRetData("2","表不存在！");
        return;
    }
    //select数据
    selSql = "select * from "+en;
    if(where != null){
        if(isorderby||isgroupby||islimit){
            selSql = selSql+" "+where;
        }else{
            selSql = selSql + " where "+where;
        }
    }
    sql.queryPaging(selSql,[],pagenum,pagesize,"data");
    var data = sys.result.data;
    //恢复连接
    if(did != "00000000000000000000000000000000"){
        sql.connection();
    }
    //获取列名
    var getTitle = "select sys_md_mm002.en,sys_md_mm002.cn,sys_md_mm002.mk,sys_md_mm002.must,sys_mdm003.datatype,sys_mdm003.numrange,sys_mdm003.dict,sys_mdm003.format from sys_md_mm002,sys_mdm003 where sys_md_mm002.decd=sys_mdm003.decd and sys_md_mm002.typecd=? and sys_md_mm002.status='1' order by sys_md_mm002.sorting";
    sql.query(getTitle,[typecd],"type");
    var type = sys.result.type;
    for(r in type){
        if(r.mk == "1"){
            map.put(r,"ro","1");
        }else{
            map.put(r,"ro","0");
        }
        map.put(r,"cn",r.cn+"（"+r.en+"）");
        map.put(r,"dict","");
        map.put(r,"view","1");
        map.put(r,"search","0");
        map.put(r,"elemtype", "text");
    }
    
    //找出非小写的列名
    var nonLower=[];
    for(t in type){
      if(t.en != sys.toLowerCase(t.en)){
        list.add(nonLower,t.en);
      }
    }
    //将data中的小写字段名，转成正确的
    for(d in data){
      for(t in nonLower){
        if(map.containsKey(d,sys.toLowerCase(t))){
          map.put(d,t,d[sys.toLowerCase(t)]);
          map.remove(d,sys.toLowerCase(t));
        }
      }
    }
    // sys.printValue(data,type);
    sys.setRetData("0","","type","data");
}catch(error){
    sys.setRetData("2","sql语句执行异常，请检查("+selSql+")");
    return;
}