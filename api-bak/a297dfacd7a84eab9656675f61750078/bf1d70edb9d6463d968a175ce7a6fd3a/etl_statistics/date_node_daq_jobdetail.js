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
var dt=sys.request.dt;  //日期点
var dt_from =sys.request.dt_from;   //开始日期
var dt_to=sys.request.dt_to;    //结束日期
var instanceid=sys.request.instanceid;    //节点ID
var daqid=sys.request.daqid;    //采集点ID
var jobid=sys.request.jobid;    //作业ID

if(instanceid == null || jobid==null){
    sys.setRetData("1");
    return;
}
if(daqid==null){
    daqid="";
}
//返回的数据
var data = [];
// 列的描述
var type = [
    {
      "en":"dt",
      "cn":"日期",
      "view":"1",
      "chart":""
    },
    {
      "en":"instanceid",
      "cn":"节点ID",
      "view":"0",
      "chart":""
    },
    {
      "en":"daqid",
      "cn":"采集点ID",
      "view":"0",
      "chart":""
    },
    {
      "en":"jobid",
      "cn":"作业ID",
      "view":"0",
      "chart":""
    },
    {
      "en":"runningid",
      "cn":"运行ID",
      "view":"0",
      "chart":""
    },
    {
      "en":"time_start",
      "cn":"开始时间",
      "view":"1",
      "chart":""
    },
    {
      "en":"time_end",
      "cn":"结束时间",
      "view":"1",
      "chart":""
    },
    {
      "en":"processedcnt",
      "cn":"处理数",
      "view":"1",
      "chart":"bar",
      "stack":""
    },
    {
      "en":"successedcnt",
      "cn":"成功数",
      "view":"1",
      "chart":"bar",
      "stack":"成功数失败数"
    },
    {
      "en":"failedcnt",
      "cn":"失败数",
      "view":"1",
      "chart":"bar",
      "stack":"成功数失败数"
    }
];
// 日期点
if(dt != null){
    //处理参数
    dt=sys.replace(dt,"-","");
    var sql="SELECT ts_select.log_date_char AS dt, ts_select.instanceid, ts_select.daqid, ts_select.jobid, ts_select.runningid, ts_select.time_start, te_select.time_end, pro_select.cnt AS processedcnt FROM (SELECT log_date_char, instanceid, daqid, jobid, runningid, log_time_char AS time_start FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='01') AS ts_select, (SELECT log_date_char, instanceid, daqid, jobid, runningid, log_time_char AS time_end FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='04') AS te_select, (SELECT log_date_char, instanceid, daqid, jobid, runningid, cnt FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='02') AS pro_select WHERE ts_select.log_date_char = te_select.log_date_char AND ts_select.instanceid = te_select.instanceid AND ts_select.daqid = te_select.daqid AND ts_select.jobid=te_select.jobid AND ts_select.runningid = te_select.runningid AND te_select.log_date_char = pro_select.log_date_char AND te_select.instanceid=pro_select.instanceid AND te_select.daqid=pro_select.daqid AND te_select.jobid=pro_select.jobid AND te_select.runningid = pro_select.runningid";
    var params=[dt,instanceid,daqid,jobid,dt,instanceid,daqid,jobid,dt,instanceid,daqid,jobid];
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="SELECT log_date_char as dt, instanceid, daqid, jobid, runningid, count(*) cnt  FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='03' group by runningid";
    var params2=[dt,instanceid,daqid,jobid];
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false;
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt&&r2.instanceid==r.instanceid&&r2.daqid==r.daqid&&r2.jobid==r.jobid&&r2.runningid==r.runningid){
                find=true;
                list.add(data,{
                    "dt":r.dt,
                    "instanceid":r.instanceid,
                    "daqid":r.daqid,
                    "jobid":r.jobid,
                    "runningid":r.runningid,
                    "time_start":r.time_start,
                    "time_end":r.time_end,
                    "processedcnt":r.processedcnt,
                    "successedcnt":sys.parseInt(r.processedcnt)-sys.parseInt(r2.cnt),
                    "failedcnt":r2.cnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":r.dt,
                "instanceid":r.instanceid,
                "daqid":r.daqid,
                "jobid":r.jobid,
                "runningid":r.runningid,
                "time_start":r.time_start,
                "time_end":r.time_end,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
}
// 开始日期，结束日期
else if(dt_from!=null && dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    var sql="SELECT ts_select.log_date_char AS dt, ts_select.instanceid, ts_select.daqid, ts_select.jobid, ts_select.runningid, ts_select.time_start, te_select.time_end, pro_select.cnt AS processedcnt FROM (SELECT log_date_char, instanceid, daqid, jobid, runningid, log_time_char AS time_start FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='01') AS ts_select, (SELECT log_date_char, instanceid, daqid, jobid, runningid, log_time_char AS time_end FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='04') AS te_select, (SELECT log_date_char, instanceid, daqid, jobid, runningid, cnt FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='02') AS pro_select WHERE ts_select.log_date_char = te_select.log_date_char AND ts_select.instanceid = te_select.instanceid AND ts_select.daqid = te_select.daqid AND ts_select.jobid=te_select.jobid AND ts_select.runningid = te_select.runningid AND te_select.log_date_char = pro_select.log_date_char AND te_select.instanceid=pro_select.instanceid AND te_select.daqid=pro_select.daqid AND te_select.jobid=pro_select.jobid AND te_select.runningid = pro_select.runningid";
    var params=[dt_from,dt_to,instanceid,daqid,jobid,dt_from,dt_to,instanceid,daqid,jobid,dt_from,dt_to,instanceid,daqid,jobid];
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="SELECT log_date_char as dt, instanceid, daqid, jobid, runningid, count(*) cnt  FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND daqid=? AND jobid=? AND event_type='03' group by runningid";
    var params2=[dt_from,dt_to,instanceid,daqid,jobid];
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false;
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt&&r2.instanceid==r.instanceid&&r2.daqid==r.daqid&&r2.jobid==r.jobid&&r2.runningid==r.runningid){
                find=true;
                list.add(data,{
                    "dt":r.dt,
                    "instanceid":r.instanceid,
                    "daqid":r.daqid,
                    "jobid":r.jobid,
                    "runningid":r.runningid,
                    "time_start":r.time_start,
                    "time_end":r.time_end,
                    "processedcnt":r.processedcnt,
                    "successedcnt":sys.parseInt(r.processedcnt)-sys.parseInt(r2.cnt),
                    "failedcnt":r2.cnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":r.dt,
                "instanceid":r.instanceid,
                "daqid":r.daqid,
                "jobid":r.jobid,
                "runningid":r.runningid,
                "time_start":r.time_start,
                "time_end":r.time_end,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
}else{
    sys.setRetData("1");
}
//格式化日期（20151111->2015-11-11）,时间（100000->10:00:00）
for(r in data){
    map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    map.put(r,"time_start",sys.subStringTo(r.time_start,0,2)+":"+sys.subStringTo(r.time_start,2,4)+":"+sys.subStringTo(r.time_start,4,6));
    map.put(r,"time_end",sys.subStringTo(r.time_end,0,2)+":"+sys.subStringTo(r.time_end,2,4)+":"+sys.subStringTo(r.time_end,4,6));
}
// 获取处理总数，成功总数，失败总数
var p = 0, s=0, f=0;
for(r in data){
    p=p+sys.parseInt(r.processedcnt);
    s=s+sys.parseInt(r.successedcnt);
    f=f+sys.parseInt(r.failedcnt);
}
sys.addRetData({"p":p,"s":s,"f":f},"count");
sys.addRetData(type,"type");
sys.addRetData(data,"data");
sys.setRetData("0","","data","type","count");