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
var instanceid = sys.request.instanceid;    //节点ID
var daqid = sys.request.daqid;  //采集点ID
var jobid = sys.request.jobid;  //作业ID

if(instanceid == null || jobid == null){
    sys.setRetData("1");
    return;
}
//采集点为空时
if(daqid==null){
    daqid="";
}

var dt = sys.request.dt;    //单个日期
var dt_from = sys.request.dt_from;  //开始日期
var dt_to = sys.request.dt_to;  //结束日期

//返回的数据
var data = [];
// 列的描述
var type = [
    {
      "en":"dt",
      "cn":"日期",
      "view":"1"
    },
    {
      "en":"instanceid",
      "cn":"节点ID",
      "view":"0"
    },
    {
      "en":"daqid",
      "cn":"采集点ID",
      "view":"0"
    },
    {
      "en":"jobid",
      "cn":"作业ID",
      "view":"0"
    },
    {
      "en":"runningid",
      "cn":"运行ID",
      "view":"0"
    },
    {
      "en":"time_start",
      "cn":"开始时间",
      "view":"1"
    },
    {
      "en":"time_end",
      "cn":"结束时间",
      "view":"1"
    },
    {
      "en":"processedcnt",
      "cn":"处理数",
      "view":"1"
    },
    {
      "en":"successedcnt",
      "cn":"成功数",
      "view":"1"
    },
    {
      "en":"failedcnt",
      "cn":"失败数",
      "view":"1"
    }
];
//日期点
if(dt != null){
    // 验证dt
    // if(sys.length(dt) != 8 || !sys.isNumber(dt)){
    //     sys.setRetData("2","日期参数错误！");
    //     return;
    // }
    //处理参数
    dt=sys.replace(dt,"-","");
    //处理数
    var sql = "select ts_select.log_date_char as dt,ts_select.instanceid,ts_select.daqid,ts_select.jobid,ts_select.runningid,ts_select.time_start,te_select.time_end,pro_select.cnt as processedcnt from (select log_date_char,instanceid,daqid,jobid,runningid,log_time_char as time_start from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and daqid=? and jobid=? and event_type='01') as ts_select, (select log_date_char,instanceid,daqid,jobid,runningid,log_time_char as time_end from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and daqid=? and jobid=? and event_type='04') as te_select, (select log_date_char,instanceid,daqid,jobid,runningid,cnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and daqid=? and jobid=? and event_type='02') as pro_select where ts_select.log_date_char = te_select.log_date_char and ts_select.instanceid = te_select.instanceid and ts_select.daqid = te_select.daqid and ts_select.jobid=te_select.jobid and ts_select.runningid = te_select.runningid and  te_select.log_date_char = pro_select.log_date_char and te_select.instanceid=pro_select.instanceid and te_select.daqid=pro_select.daqid and te_select.jobid=pro_select.jobid and te_select.runningid = pro_select.runningid";
    var params=[dt,instanceid,daqid,jobid,dt,instanceid,daqid,jobid,dt,instanceid,daqid,jobid];
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt,instanceid,daqid,jobid,runningid,count(*) cnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and daqid=? and jobid=? and event_type='03' group by runningid";
    var params2=[dt,instanceid,daqid,jobid];
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //dt,instanceid,daqid,jobid,runningid
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
else if(dt_from != null && dt_to != null){
    // 验证dt
    // if(sys.length(dt_from) != 8 || !sys.isNumber(dt_from) || sys.length(dt_to) != 8 || !sys.isNumber(dt_to)){
    //     sys.setRetData("2","日期参数错误！");
    //     return;
    // }
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    //处理数
    var sql = "select ts_select.log_date_char as dt,ts_select.instanceid,ts_select.daqid,ts_select.jobid,ts_select.runningid,ts_select.time_start,te_select.time_end,pro_select.cnt as processedcnt from (select log_date_char,instanceid,daqid,jobid,runningid,log_time_char as time_start from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and daqid=? and jobid=? and event_type='01') as ts_select, (select log_date_char,instanceid,daqid,jobid,runningid,log_time_char as time_end from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and daqid=? and jobid=? and event_type='04') as te_select, (select log_date_char,instanceid,daqid,jobid,runningid,cnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and daqid=? and jobid=? and event_type='02') as pro_select where ts_select.log_date_char = te_select.log_date_char and ts_select.instanceid = te_select.instanceid and ts_select.daqid = te_select.daqid and ts_select.jobid=te_select.jobid and ts_select.runningid = te_select.runningid and  te_select.log_date_char = pro_select.log_date_char and te_select.instanceid=pro_select.instanceid and te_select.daqid=pro_select.daqid and te_select.jobid=pro_select.jobid and te_select.runningid = pro_select.runningid";
    var params=[dt_from,dt_to,instanceid,daqid,jobid,dt_from,dt_to,instanceid,daqid,jobid,dt_from,dt_to,instanceid,daqid,jobid];
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt,instanceid,daqid,jobid,runningid,count(*) cnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and daqid=? and jobid=? and event_type='03' group by runningid";
    var params2=[dt_from,dt_to,instanceid,daqid,jobid];
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //dt,instanceid,daqid,jobid,runningid
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
//格式化日期（20151111->2015-11-11）,时间（100000->10:00:00）
for(r in data){
    map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    map.put(r,"time_start",sys.subStringTo(r.time_start,0,2)+":"+sys.subStringTo(r.time_start,2,4)+":"+sys.subStringTo(r.time_start,4,6));
    map.put(r,"time_end",sys.subStringTo(r.time_end,0,2)+":"+sys.subStringTo(r.time_end,2,4)+":"+sys.subStringTo(r.time_end,4,6));
}
sys.addRetData(type,"type");
sys.addRetData(data,"data");
sys.setRetData("0","","data","type");

/**返回图表数据*/
var chart_type=[],chart_data=[];
if(dt != null){
    chart_type = [
        {
          "en":"datetime",
          "cn":"日期时间",
          "view":"1",
          "chart":""
        },
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
    chart_data = [];
    for(r in data){
        list.add(chart_data,{
            "datetime":r.dt+" "+r.time_start,
            "dt":r.dt,
            "instanceid":r.instanceid,
            "daqid":r.daqid,
            "jobid":r.jobid,
            "runningid":r.runningid,
            "time_start":r.time_start,
            "time_end":r.time_end,
            "processedcnt":sys.parseInt(r.processedcnt),
            "successedcnt":sys.parseInt(r.successedcnt),
            "failedcnt":sys.parseInt(r.failedcnt)
        });
    }
}else if(dt_from != null && dt_to != null){
    chart_type=[
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
    chart_data = [];
    for(r in data){
        var find = false;
        for(r2 in chart_data){
            if(r2.dt == r.dt){
                find = true;
                map.put(r2,"processedcnt",sys.parseInt(r.processedcnt)+r2.processedcnt);
                map.put(r2,"successedcnt",sys.parseInt(r.successedcnt)+r2.successedcnt);
                map.put(r2,"failedcnt",sys.parseInt(r.failedcnt)+r2.failedcnt);
                break;
            }
        }
        if(!find){
            list.add(chart_data,{
                "dt":r.dt,
                "processedcnt":sys.parseInt(r.processedcnt),
                "successedcnt":sys.parseInt(r.successedcnt),
                "failedcnt":sys.parseInt(r.failedcnt)
            });
        }
    }
}
// 获取处理总数，成功总数，失败总数
var p = 0, s=0, f=0;
for(r in chart_data){
    p=p+sys.parseInt(r.processedcnt);
    s=s+sys.parseInt(r.successedcnt);
    f=f+sys.parseInt(r.failedcnt);
}
sys.addRetData({"p":p,"s":s,"f":f},"chart_count");
sys.addRetData(chart_type,"chart_type");
sys.addRetData(chart_data,"chart_data");
sys.setRetData("0","","chart_data","chart_type","chart_count","type","data");