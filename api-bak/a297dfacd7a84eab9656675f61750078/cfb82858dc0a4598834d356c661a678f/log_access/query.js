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
// 查询条件
var dt_from=sys.request.dt_from;
var dt_to=sys.request.dt_to;
var time_from=sys.request.time_from;
var time_to=sys.request.time_to;

var userid=sys.request.userid;  //用户ID
var access_cd=sys.request.access_cd;    //登录状态代码

var pagenum=sys.request.pagenum;    //分页的第几页
var pagesize=sys.request.pagesize;  //每页条数

if(pagenum==null || pagesize==null){
    sys.setRetData("1");
    return;
}

if (dt_from==null || dt_to==null) {
  sys.setRetData("1", "请指定日期范围");
  return;
}
if (time_from==null || time_to==null) {
  sys.setRetData("1", "请指定时间范围");
  return;
}
var objDateFrom = date.parseDate(dt_from+time_from, "yyyy-MM-ddHH:mm:ss");
var objDateTo = date.parseDate(dt_to+time_to, "yyyy-MM-ddHH:mm:ss");
var strISODateFrom = date.formattedTime(objDateFrom, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
var strISODateTo = date.formattedTime(objDateTo, "yyyy-MM-dd'T'HH:mm:ss.999Z");

sys.printValue(strISODateFrom,strISODateTo);

var sql="select a.log_time,a.log_level,a.log_error_type,a.requestid,a.log,a.pid,a.user_key,a.access_cd,a.clientid,a.createdt,b.userid from sys_pl_log_access a left join sys_userinfo b on a.pid=b.pid left join sys_tenant_user c on a.pid=c.pid and c.orgid=? where a.log_time >= '"+strISODateFrom+"' and a.log_time <= '"+strISODateTo+"'";
var params=[orgid];

if(userid!=null){
    sql=sql+" and b.userid=?";
    list.add(params,userid);
}
if(access_cd!=null){
    sql=sql+" and a.access_cd=?";
    list.add(params,access_cd);
}

sql.queryPaging(sql,params,pagenum,pagesize);

sys.setRetData("0","","result");