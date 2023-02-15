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
var dt = sys.request.dt;    //日期点
var dt_from = sys.request.dt_from;  //开始日期
var dt_to = sys.request.dt_to;  //结束日期
var instanceid = sys.request.instanceid;    //节点ID
var serviceid = sys.request.serviceid;  //服务ID

if(instanceid==null){
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
        "en":"servicenm",
        "cn":"服务",
        "view":"1"
    },
    {
        "en":"req_cnt",
        "cn":"调用次数",
        "view":"1"
    },
    {
        "en":"successed_cnt",
        "cn":"成功数",
        "view":"1"
    },
    {
        "en":"failed_cnt",
        "cn":"失败数",
        "view":"1"
    },
    {
        "en":"serviceid",
        "cn":"服务ID",
        "view":"0"
    }
];
if(dt!=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    //请求数
    var sql="select req_cnt_select.serviceid,sys_eeb_run_conf.name servicenm,req_cnt_select.req_cnt from (select serviceid,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? group by serviceid) req_cnt_select left join sys_eeb_run_conf on req_cnt_select.serviceid=sys_eeb_run_conf.id";
    var params=[dt,instanceid];
    if(serviceid!=null){
        sql=sql+" where req_cnt_select.serviceid=? group by servicenm";
        list.add(params,serviceid);
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? and event_type='03' group by serviceid";
    var params2=[dt,instanceid];
    if(serviceid!=null){
        getFailedNum="select serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? and event_type='03' and serviceid=?";
        params2=[dt,instanceid,serviceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //serviceid
        for(r2 in sys.result.failed_r){
            if(r2.serviceid==r.serviceid){
                find=true;
                list.add(data,{
                    "dt":dt,
                    "serviceid":r.serviceid,
                    "servicenm":r.servicenm,
                    "req_cnt":r.req_cnt,
                    "successed_cnt":sys.parseInt(r.req_cnt)-sys.parseInt(r2.failed_cnt),
                    "failed_cnt":r2.failed_cnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":dt,
                "serviceid":r.serviceid,
                "servicenm":r.servicenm,
                "req_cnt":r.req_cnt,
                "successed_cnt":r.req_cnt,
                "failed_cnt":"0"
            });
        }
    }
}else if(dt_from!=null && dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    // 请求数
    var sql="select req_cnt_select.log_date_char dt,req_cnt_select.serviceid,sys_eeb_run_conf.name servicenm,req_cnt_select.req_cnt from (select log_date_char,serviceid,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? group by log_date_char,serviceid) req_cnt_select left join sys_eeb_run_conf on req_cnt_select.serviceid=sys_eeb_run_conf.id";
    var params=[dt_from,dt_to,instanceid];
    if(serviceid!=null){
        sql=sql+" where req_cnt_select.serviceid=? order by dt,servicenm";
        list.add(params,serviceid);
    }else{
        sql=sql+" order by dt,servicenm";
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt,serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and event_type='03' group by dt,serviceid";
    var params2=[dt_from,dt_to,instanceid];
    if(serviceid!=null){
        getFailedNum="select log_date_char as dt,serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and event_type='03' and serviceid=? group by dt,serviceid";
        params2=[dt_from,dt_to,instanceid,serviceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    data=[];
    for(r in sys.result.result){
        var find=false; //serviceid
        for(r2 in sys.result.failed_r){
            if(r2.serviceid==r.serviceid){
                find=true;
                list.add(data,{
                    "dt":r.dt,
                    "serviceid":r.serviceid,
                    "servicenm":r.servicenm,
                    "req_cnt":r.req_cnt,
                    "successed_cnt":sys.parseInt(r.req_cnt)-sys.parseInt(r2.failed_cnt),
                    "failed_cnt":r2.failed_cnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "dt":r.dt,
                "serviceid":r.serviceid,
                "servicenm":r.servicenm,
                "req_cnt":r.req_cnt,
                "successed_cnt":r.req_cnt,
                "failed_cnt":"0"
            });
        }
    }
}else{
    sys.setRetData("1");
}
//格式化日期（20151111->2015-11-11）
for(r in data){
    map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    //服务名称为空，则服务已被删除
    if(r.servicenm==""){
        map.put(r,"servicenm","此服务已删除");
    }
}
sys.addRetData(type,"type");
sys.addRetData(data,"data");

/**返回图表数据*/
var chart_type=[],chart_data=[];
if(dt != null){
    chart_type = [
        {
            "en":"servicenm",
            "cn":"服务",
            "view":"1",
            "chart":""
        },
        {
            "en":"req_cnt",
            "cn":"调用次数",
            "view":"1",
            "chart":"bar",
            "stack":""
        },
        {
            "en":"successed_cnt",
            "cn":"成功数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"failed_cnt",
            "cn":"失败数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"serviceid",
            "cn":"服务ID",
            "view":"0",
            "chart":""
        }
    ];
    chart_data = [];
    for(r in data){
        list.add(chart_data,{
            "serviceid":r.serviceid,
            "servicenm":r.servicenm,
            "req_cnt":r.req_cnt,
            "successed_cnt":r.successed_cnt,
            "failed_cnt":r.failed_cnt
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
            "en":"req_cnt",
            "cn":"调用次数",
            "view":"1",
            "chart":"bar",
            "stack":""
        },
        {
            "en":"successed_cnt",
            "cn":"成功数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"failed_cnt",
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
                map.put(r2,"req_cnt",sys.parseInt(r.req_cnt)+r2.req_cnt);
                map.put(r2,"successed_cnt",sys.parseInt(r.successed_cnt)+r2.successed_cnt);
                map.put(r2,"failed_cnt",sys.parseInt(r.failed_cnt)+r2.failed_cnt);
                break;
            }
        }
        if(!find){
            list.add(chart_data,{
                "dt":r.dt,
                "req_cnt":sys.parseInt(r.req_cnt),
                "successed_cnt":sys.parseInt(r.successed_cnt),
                "failed_cnt":sys.parseInt(r.failed_cnt)
            });
        }
    }
}
// 获取处理总数，成功总数，失败总数
var p = 0, s=0, f=0;
for(r in chart_data){
    p=p+sys.parseInt(r.req_cnt);
    s=s+sys.parseInt(r.successed_cnt);
    f=f+sys.parseInt(r.failed_cnt);
}
sys.addRetData({"p":p,"s":s,"f":f},"chart_count");
sys.addRetData(chart_type,"chart_type");
sys.addRetData(chart_data,"chart_data");
sys.setRetData("0","","chart_data","chart_type","chart_count","type","data");