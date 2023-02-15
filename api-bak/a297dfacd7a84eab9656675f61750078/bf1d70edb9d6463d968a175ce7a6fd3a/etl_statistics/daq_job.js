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
var dt = sys.request.dt;    //日期
var dt_from = sys.request.dt_from;  //开始日期
var dt_to = sys.request.dt_to;  //结束日期

if(instanceid == null){
    sys.setRetData("1");
    return;
}
//返回的数据
var data=[];
// 列的描述
var type=[
    {
        "en":"dt",
        "cn":"日期",
        "view":"1"
    },
    {
        "en":"daqid",
        "cn":"daqid",
        "view":"0"
    },
    {
        "en":"jobid",
        "cn":"jobid",
        "view":"0"
    },
    {
        "en":"daqnm",
        "cn":"采集点",
        "view":"1"
    },
    {
        "en":"jobnm",
        "cn":"作业",
        "view":"1"
    },
    {
        "en":"runningcnt",
        "cn":"执行次数",
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
// 单个日期
if(dt != null){
    // 验证dt
    // if(sys.length(dt) != 8 || !sys.isNumber(dt)){
    //     sys.setRetData("2","日期参数错误！");
    //     return;
    // }
    //处理参数
    dt=sys.replace(dt,"-","");
    // 执行次数，处理数
    var sql = "select runningcnt_select.daqid,sys_eeb_jobgroup.name as daqnm,runningcnt_select.jobid,sys_eeb_sche.name as jobnm,runningcnt_select.runningcnt,processedcnt_select.processedcnt from (select daqid,jobid,count(distinct runningid) as runningcnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? group by daqid,jobid) as runningcnt_select, (select daqid,jobid,sum(cnt) as processedcnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and event_type='02' group by daqid,jobid) as processedcnt_select left join sys_eeb_jobgroup on sys_eeb_jobgroup.id=processedcnt_select.daqid left join sys_eeb_sche on sys_eeb_sche.id=processedcnt_select.jobid where runningcnt_select.daqid=processedcnt_select.daqid and runningcnt_select.jobid=processedcnt_select.jobid ";
    var params=[dt,instanceid,dt,instanceid];
    if(daqid!=null){
        sql=sql+" and runningcnt_select.daqid=? order by daqnm,jobnm";
        list.add(params,daqid);
    }else{
        sql=sql+" order by daqnm,jobnm";
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select daqid,jobid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and event_type='03' group by daqid,jobid";
    var params2=[dt,instanceid];
    if(daqid!=null){
        getFailedNum="select daqid,jobid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char=? and instanceid=? and event_type='03' and daqid=? group by jobid";
        params2=[dt,instanceid,daqid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //daqid,jobid
        for(r2 in sys.result.failed_r){
            if(r2.daqid==r.daqid&&r2.jobid==r.jobid){
                find=true;
                list.add(data,{
                    "dt":dt,
                    "daqid":r.daqid,
                    "jobid":r.jobid,
                    "daqnm":r.daqnm,
                    "jobnm":r.jobnm,
                    "runningcnt":r.runningcnt,
                    "processedcnt":r.processedcnt,
                    "successedcnt":sys.parseInt(r.processedcnt)-sys.parseInt(r2.failedcnt),
                    "failedcnt":r2.failedcnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":dt,
                "daqid":r.daqid,
                "jobid":r.jobid,
                "daqnm":r.daqnm,
                "jobnm":r.jobnm,
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
}
// 日期段
else if(dt_from != null && dt_to != null){
    // 验证dt
    // if(sys.length(dt_from) != 8 || !sys.isNumber(dt_from) || sys.length(dt_to) != 8 || !sys.isNumber(dt_to)){
    //     sys.setRetData("2","日期参数错误！");
    //     return;
    // }
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    // 执行次数，处理数
    var sql = "select runningcnt_select.log_date_char as dt,runningcnt_select.daqid,sys_eeb_jobgroup.name as daqnm,runningcnt_select.jobid,sys_eeb_sche.name as jobnm,runningcnt_select.runningcnt,processedcnt_select.processedcnt from (select log_date_char,daqid,jobid,count(distinct runningid) as runningcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? group by log_date_char,daqid,jobid) as runningcnt_select, (select log_date_char,daqid,jobid,sum(cnt) as processedcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and event_type='02' group by log_date_char,daqid,jobid) as processedcnt_select left join  sys_eeb_jobgroup on sys_eeb_jobgroup.id=processedcnt_select.daqid left join sys_eeb_sche on sys_eeb_sche.id=processedcnt_select.jobid where runningcnt_select.log_date_char=processedcnt_select.log_date_char and runningcnt_select.daqid=processedcnt_select.daqid and runningcnt_select.jobid=processedcnt_select.jobid ";
    var params=[dt_from,dt_to,instanceid,dt_from,dt_to,instanceid];
    if(daqid!=null){
        sql=sql+" and runningcnt_select.daqid=? order by dt,daqnm,jobnm";
        list.add(params,daqid);
    }else{
        sql=sql+" order by dt,daqnm,jobnm";
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt,daqid,jobid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and event_type='03' group by dt,daqid,jobid";
    var params2=[dt_from,dt_to,instanceid];
    if(daqid!=null){
        getFailedNum="select log_date_char as dt,daqid,jobid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and event_type='03' and daqid=? group by dt,daqid,jobid";
        params2=[dt_from,dt_to,instanceid,daqid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //dt,daqid,jobid
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt&&r2.daqid==r.daqid&&r2.jobid==r.jobid){
                find=true;
                list.add(data,{
                    "dt":r.dt,
                    "daqid":r.daqid,
                    "jobid":r.jobid,
                    "daqnm":r.daqnm,
                    "jobnm":r.jobnm,
                    "runningcnt":r.runningcnt,
                    "processedcnt":r.processedcnt,
                    "successedcnt":sys.parseInt(r.processedcnt)-sys.parseInt(r2.failedcnt),
                    "failedcnt":r2.failedcnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":r.dt,
                "daqid":r.daqid,
                "jobid":r.jobid,
                "daqnm":r.daqnm,
                "jobnm":r.jobnm,
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
}
else{
    sys.setRetData("1","缺少日期参数！");
    return;
}
//格式化日期（20151111->2015-11-11）
for(r in data){
    map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
}
//采集点为空，则显示 空
for(r in data){
    if(r.daqid==""){
        map.put(r,"daqnm","未指定");
    }
}
sys.addRetData(type,"type");
sys.addRetData(data,"data");

/**返回图表数据*/
var chart_type=[],chart_data=[];
if(dt != null){
    chart_type = [
        {
            "en":"daqnm",
            "cn":"采集点名称",
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
        },
        {
            "en":"daqid",
            "cn":"采集点ID",
            "view":"0"
        }
    ];
    chart_data = [];
    for(r in data){
        var find = false;
        for(r2 in chart_data){
            if(r2.daqid == r.daqid){
                find = true;
                map.put(r2,"processedcnt",sys.parseInt(r.processedcnt)+r2.processedcnt);
                map.put(r2,"successedcnt",sys.parseInt(r.successedcnt)+r2.successedcnt);
                map.put(r2,"failedcnt",sys.parseInt(r.failedcnt)+r2.failedcnt);
                break;
            }
        }
        if(!find){
            list.add(chart_data,{
                "daqid":r.daqid,
                "daqnm":r.daqnm,
                "processedcnt":sys.parseInt(r.processedcnt),
                "successedcnt":sys.parseInt(r.successedcnt),
                "failedcnt":sys.parseInt(r.failedcnt)
            });
        }
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