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
//id:getsystemlist
//name:获取系统信息一览
var orgid=sys.request.org;
var paramdata=sys.request.paramdata;
// var arraydata=sys.convertToObject(paramdata);
// sys.setRetData("0",paramdata); return;


var sql="select sysid,sysnm,ip,port,uri,inner_flag,sys_desc,status,createdt,updatedt from sys_system "
+"where status='1' and sysid not in (select a.sysid from sys_system_role a , sys_system b, sys_role c where a.sysid=b.sysid and a.roleid=c.roleid and c.orgid=? and a.status='1' and b.status='1' and c.status='1' ) and orgid = ? ";

var inparam="";
if(paramdata!=null){
    sql=sql+" and sysid not in (";
    var arraydata=sys.split(paramdata,",");
    var i=0;
    while(i<arraydata.~size){
        inparam=inparam+"'"+arraydata[i]+"',";
        i=i+1;
    }
    inparam=sys.subStringTo(inparam,0,sys.length(inparam)-1);
    sql=sql+inparam+")";
}

var param = [orgid,orgid];

sql.query(sql,param);
sys.setRetData("0","","result");