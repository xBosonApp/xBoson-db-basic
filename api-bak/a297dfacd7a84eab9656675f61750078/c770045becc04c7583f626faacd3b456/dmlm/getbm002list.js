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
//id:getbm002list
//name:获取操纵定义一览

var typecd=sys.request.typecd;
var status=sys.request.status;
var sqltype=sys.request.sqltype;
var mark=sys.request.mark;
var modolnm=sys.request.modolnm;
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
if(typecd == null){
    sys.setRetData("1");
    return;
}

var sel="select modolcd,modolnm,dstypecd,tablenm,sqltype,sqltext,status,mark,createdt,updatedt,isui,typecontent from sys_bm002 where dstypecd=? ";
var param=[typecd];

if(status != null){
    sel=sel+" and status=?";
    list.add(param,status);
}
if(modolnm != null){
    sel=sel+" and modolnm like ?";
    list.add(param,"%"+modolnm+"%");
}
if(sqltype != null){
    sel=sel+" and sqltype=?";
    list.add(param,sqltype);
}
if(mark != null){
    sel=sel+" and mark like ?";
    list.add(param,"%"+mark+"%");
}

if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
sql.queryPaging(sel,param,pagenum,pagesize);
sys.setRetData("0","","result");