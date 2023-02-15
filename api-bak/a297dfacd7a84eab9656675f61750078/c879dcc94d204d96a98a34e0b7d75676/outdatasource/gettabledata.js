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
var table_name = sys.request.table_name;    //表名
var where = sys.request.wherearea;

var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

if(did==null||table_name==null){
    sys.setRetData("1");
    return;
}

if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}

//where是否order by ,group by , limit
var isorderby=false;
var isgroupby=false;
var islimit=false;

if(where!=null){
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
var iscatch=false,catchmsg="";
var sql="";
//平台数据源
if(did=="00000000000000000000000000000000"){
    sql="select * from "+org+"."+table_name;
}
//外部数据源
else{
    sql.connection(did);
    sql="select * from "+table_name;
}
if(where!=null){
    if(isorderby||isgroupby||islimit){
        sql=sql+" "+where;
    }else{
        sql=sql+" where "+where;
    }
}
try{
    sql.queryPaging(sql,null,pagenum,pagesize,"data");    
}catch(e){
    iscatch=true;
}
if(iscatch){
    sys.setRetData("2","请检查SQL语句："+sql);
    return;
}

//title
var metaData=sql.metaData(sql);
var title=[];
// sys.printValue(metaData);
for (r in metaData) {
  list.add(title, {
    "en": sys.toLowerCase(r.ColumnLabel), 
    "cn": r.ColumnName,
  });
}
sys.addRetData(title,"type");
sys.setRetData("0","","data","type");