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
var dt = sys.request.dt;    //日期
var dt_from = sys.request.dt_from;    // 开始日期，8位数字
var dt_to = sys.request.dt_to;    // 结束日期，8位数字
var instanceid = sys.request.instanceid;    //集群节点ID

var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
// 返回的grid数据
var data = [];
// 列的描述
var type = [
    {
        "en":"dt",
        "cn":"日期",
        "view":"1"
    },
    {
        "en":"instancenm",
        "cn":"节点",
        "view":"1"
    },
    {
        "en":"jobcnt",
        "cn":"作业量",
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
    },
    {
        "en":"instanceid",
        "cn":"节点ID",
        "view":"0"
    }
];
var start=date.currentTimeMillis();
// 单个日期
if(dt != null){
    //处理参数
    dt=sys.replace(dt,"-","");
    // 执行数，处理数
    var sql = "select jobcnt_select.instanceid,sys_eeb_work_node.ip instancenm,jobcnt_select.jobcnt,runningcnt_select.runningcnt,processedcnt_select.processedcnt from (select instanceid,count(distinct jobid) as jobcnt from sys_pl_log_etl_statistics where log_date_char=? group by instanceid) as jobcnt_select,(select instanceid,count(distinct runningid) as runningcnt from sys_pl_log_etl_statistics where log_date_char=? group by instanceid) as runningcnt_select,(select instanceid,sum(cnt) as processedcnt from  sys_pl_log_etl_statistics where log_date_char=? and event_type='02' group by instanceid) as processedcnt_select  left join sys_eeb_work_node on sys_eeb_work_node.id=processedcnt_select.instanceid where jobcnt_select.instanceid=runningcnt_select.instanceid and runningcnt_select.instanceid=processedcnt_select.instanceid ";
    var params = [dt,dt,dt];
    if(instanceid!=null){
        sql=sql+" and jobcnt_select.instanceid=? order by instancenm";
        list.add(params,instanceid);
    }else{
        sql=sql+" order by instancenm";
    }
    sql.query(sql,params,"result");
    // 失败数
    var getFailedNum="select instanceid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char=? and event_type='03' group by instanceid";
    var params2=[dt];
    if(instanceid!=null){
        getFailedNum="select instanceid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char=? and event_type='03' and instanceid=?";
        params2=[dt,instanceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //instanceid
        for(r2 in sys.result.failed_r){
            if(r2.instanceid==r.instanceid){
                find=true;
                list.add(data,{
                    "dt":dt,
                    "instanceid":r.instanceid,
                    "instancenm":r.instancenm,
                    "jobcnt":r.jobcnt,
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
                "instanceid":r.instanceid,
                "instancenm":r.instancenm,
                "jobcnt":r.jobcnt,
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
    //格式化日期（20151111->2015-11-11）
    for(r in data){
        map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    }
    sys.addRetData(data,"data");
    sys.addRetData(type,"type");
}
//开始日期，结束日期
else if(dt_from != null && dt_to != null){
    // 验证dt_from,dt_to
    // if(sys.length(dt_from)!=8 || sys.length(dt_to)!=8){
    //     sys.setRetData("2","开始日期，结束日期格式错误！");
    //     return;
    // }
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    //执行数，处理数
    var sql = "select jobcnt_select.log_date_char as dt,jobcnt_select.instanceid,sys_eeb_work_node.ip instancenm,jobcnt_select.jobcnt,runningcnt_select.runningcnt,processedcnt_select.processedcnt from (select log_date_char,instanceid,count(distinct jobid) as jobcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? group by log_date_char,instanceid) as jobcnt_select,(select log_date_char,instanceid,count(distinct runningid) as runningcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? group by log_date_char,instanceid) as runningcnt_select,(select log_date_char,instanceid,sum(cnt) as processedcnt from  sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and event_type='02' group by log_date_char,instanceid) as processedcnt_select left join sys_eeb_work_node on sys_eeb_work_node.id=processedcnt_select.instanceid where jobcnt_select.log_date_char=runningcnt_select.log_date_char and runningcnt_select.log_date_char=processedcnt_select.log_date_char and jobcnt_select.instanceid=runningcnt_select.instanceid and runningcnt_select.instanceid=processedcnt_select.instanceid ";
    var params = [dt_from,dt_to,dt_from,dt_to,dt_from,dt_to];
    if(instanceid!=null){
        sql=sql+" and jobcnt_select.instanceid=? order by dt,instancenm";
        list.add(params,instanceid);
    }else{
        sql=sql+" order by dt,instancenm";
    }
    // sys.printValue(sys.currentTimeString());
    sql.query(sql,params,"result");
    sys.printValue(date.currentTimeMillis()-start);
    // sys.printValue(sys.currentTimeString());
    // 失败数
    var getFailedNum="select log_date_char as dt,instanceid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and event_type='03' group by dt,instanceid";
    var params2=[dt_from,dt_to];
    if(instanceid!=null){
        getFailedNum="select log_date_char as dt,instanceid,count(*) as failedcnt from sys_pl_log_etl_statistics where log_date_char>=? and log_date_char<=? and event_type='03' and instanceid=? group by dt";
        params2=[dt_from,dt_to,instanceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //instanceid
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt&&r2.instanceid==r.instanceid){
                find=true;
                list.add(data,{
                    "dt":r.dt,
                    "instanceid":r.instanceid,
                    "instancenm":r.instancenm,
                    "jobcnt":r.jobcnt,
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
                "instanceid":r.instanceid,
                "instancenm":r.instancenm,
                "jobcnt":r.jobcnt,
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });
        }
    }
    //格式化日期（20151111->2015-11-11）
    for(r in data){
        map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    }
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
}
else{
    sys.setRetData("1");
}

/**返回图表数据*/
var chart_type=[],chart_data=[];
if(dt != null){
    chart_type = [
        {
            "en":"instancenm",
            "cn":"节点",
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
            "en":"instanceid",
            "cn":"节点ID",
            "view":"0",
            "chart":""
        }
    ];
    chart_data = [];
    for(r in data){
        list.add(chart_data,{
            "instanceid":r.instanceid,
            "instancenm":r.instancenm,
            "processedcnt":r.processedcnt,
            "successedcnt":r.successedcnt,
            "failedcnt":r.failedcnt
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