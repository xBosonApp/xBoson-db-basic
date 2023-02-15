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
var orgid=sys.request.org;
var userid=sys.request.userid;
var access_cd=sys.request.access_cd;

var pagenum=sys.request.pagenum;
var pagesize=sys.request.pagesize;

if(userid==null){
    sys.setRetData("1");
    return;
}

var sql="select log_time,log,access_cd,clientid from sys_pl_log_access a,sys_userinfo b,sys_tenant_user c where a.pid=b.pid and b.pid=c.pid and c.orgid=? and b.userid=?";
var params=[orgid,userid];
if(access_cd!=null){
    sql=sql+" and a.access_cd=?";
    list.add(params,access_cd);
}

sql.queryPaging(sql,params,pagenum,pagesize);

sys.setRetData("0","","result");