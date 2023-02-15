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
var dt = sys.request.dt;    // 日期点
var dt_from = sys.request.dt_from;  //开始日期
var dt_to = sys.request.dt_to;    //结束日期
var instanceid = sys.request.instanceid;    //节点ID
var daqid = sys.request.daqid;  //采集点ID
var jobid = sys.request.jobid;  //作业ID
var runningid = sys.request.runningid;  //单次运行ID

var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}

if(instanceid==null || jobid==null){
    sys.setRetData("1");
    return;
}
if(daqid==null){
    daqid="";
}

// 日期点
if(dt !=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    
    var sql = "select a.log_date_char,a.log_time_char,a.runningid,a.data_row,a.log,b.log_data from sys_pl_log_etl_statistics a,sys_pl_log_etl_statistics_data b where a.runningid=b.runningid and a.data_row=b.data_row and  a.log_date_char=? and a.instanceid=? and a.daqid=? and a.jobid=? and a.event_type='03'";
    var params = [dt,instanceid,daqid,jobid];
    if(runningid != null){
        sql=sql+" and a.runningid=?";
        list.add(params,runningid);
    }
    sql.queryPaging(sql,params,pagenum,pagesize,"data");
}
// 日期段
else if(dt_from!=null && dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    
    var sql = "select a.log_date_char,a.log_time_char,a.runningid,a.data_row,a.log,b.log_data from sys_pl_log_etl_statistics a,sys_pl_log_etl_statistics_data b where a.runningid=b.runningid and a.data_row=b.data_row and a.log_date_char>=? and   a.log_date_char<=? and a.instanceid=? and a.daqid=? and a.jobid=? and a.event_type='03'";
    var params = [dt_from,dt_to,instanceid,daqid,jobid];
    if(runningid != null){
        sql=sql+" and a.runningid=?";
        list.add(params,runningid);
    }
    sql.queryPaging(sql,params,pagenum,pagesize,"data");
}
else{
    sys.setRetData("1");
}
//格式化日期（20151111->2015-11-11）
for(r in sys.result.data){
    map.put(r,"dt",sys.subStringTo(r.log_date_char,0,4)+"-"+sys.subStringTo(r.log_date_char,4,6)+"-"+sys.subStringTo(r.log_date_char,6,8)+" "+sys.subStringTo(r.log_time_char,0,2)+":"+sys.subStringTo(r.log_time_char,2,4)+":"+sys.subStringTo(r.log_time_char,4,6));
}
var type=[
    {
        "en":"runningid",
        "cn":"单次运行ID",
        "view":"1"
    },
    {
        "en":"dt",
        "cn":"DATETIME",
        "view":"1"
    },
    {
        "en":"log_date_char",
        "cn":"日期",
        "view":"0"
    },
    {
        "en":"log_time_char",
        "cn":"时间",
        "view":"0"
    },
    {
        "en":"data_row",
        "cn":"数据行",
        "view":"0"
    },
    {
        "en":"log",
        "cn":"消息",
        "view":"1"
    }
];
sys.addRetData(type,"type");
sys.setRetData("0","","data","type");