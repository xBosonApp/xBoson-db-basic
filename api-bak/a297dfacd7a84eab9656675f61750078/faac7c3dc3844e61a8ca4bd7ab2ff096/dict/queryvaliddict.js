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
var typecd=sys.request.typecd;
var version=sys.request.version;
var dictcd=sys.request.dictcd;
var dictnm=sys.request.dictnm;
var shortkey=sys.request.shortkey;
var pagenum=sys.request.pagenum;
var pagesize=sys.request.pagesize;

if(typecd==null){
    sys.setRetData("1");
    return;
}
if(pagenum==null){
    pagenum=1;
}
if(pagesize==null){
    pagesize=10;
}

// 执行sql
var sql="select typecd,version,dictcd,dictnm,shortkey,status,mark,createdt,updatedt from sys_pl_cd2 where typecd=? and status='1'";
var params=[typecd];
if(version!=null){
    sql=sql+" and version=?";
    list.add(params,version);
}
if(dictcd!=null){
    sql=sql+" and dictcd like ?";
    list.add(params,"%"+dictcd+"%");
}
if(dictnm!=null){
    sql=sql+" and dictnm like ?";
    list.add(params,"%"+dictnm+"%");
}
if(shortkey!=null){
    sql=sql+" and shortkey like ?";
    list.add(params,"%"+shortkey+"%");
}
sql.queryPaging(sql,params,pagenum,pagesize);
sys.setRetData("0","","result");