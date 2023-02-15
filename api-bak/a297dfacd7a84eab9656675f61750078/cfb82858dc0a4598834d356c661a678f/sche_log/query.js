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
"use strict";

// 查询条件
var dt_from=sys.request.dt_from;
var dt_to=sys.request.dt_to;
var time_from=sys.request.time_from;
var time_to=sys.request.time_to;

var pagenum=sys.request.pagenum;    //分页的第几页
var pagesize=sys.request.pagesize;  //每页条数
var scheduleid = sys.request.scheduleid;

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
var strISODateFrom = date.formattedTime(objDateFrom, "yyyy-MM-dd HH:mm:ss");
var strISODateTo = date.formattedTime(objDateTo, "yyyy-MM-dd HH:mm:ss");

sys.printValue(strISODateFrom,strISODateTo);

var start=0,end=0,ElapseInfo={"time1":0,"time2":0};    //sql耗时
var params=[];
var sqls = `
  SELECT 
      a.*, b.schedulenm
  FROM
      sys_pl_log_scheduler a
  LEFT JOIN
      sys_pl_task_scheduler b ON a.scheduleid = b.scheduleid 
  Where 
      create_date >= ? And create_date <= ? `;
      
//sqls += " Where create_date >= '" + strISODateFrom+"' and create_date <= '"+strISODateTo+"'";
list.add(params, strISODateFrom);
list.add(params, strISODateTo);

if (sys.getUserAdminFlag() != '1') {
  sqls += ' And b.orgid =? ';
  list.add(params, sys.request.org);
}

if (scheduleid != null) {
  sqls = sqls+" And a.scheduleid =? ";
  list.add(params, scheduleid);
}

sqls += ' Order BY create_date desc';

//分页查询
start=date.currentTimeMillis();

sql.queryPaging(sqls, params, pagenum, pagesize);

end=date.currentTimeMillis();
map.put(ElapseInfo, "time1", end-start);

//结果集添加userid,sysnm
start=date.currentTimeMillis();

end=date.currentTimeMillis();
map.put(ElapseInfo,"time2",end-start);

sys.addRetData(ElapseInfo,"ElapseInfo");
sys.setRetData("0","","result","ElapseInfo");