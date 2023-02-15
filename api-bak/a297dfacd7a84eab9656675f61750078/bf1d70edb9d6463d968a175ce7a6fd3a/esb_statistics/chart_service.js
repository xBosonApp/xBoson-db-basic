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

if(dt!=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    //请求数
    var sql="select serviceid,(select name from sys_eeb_run_conf where id=serviceid) as  servicenm,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=?";
    var params=[dt,instanceid];
    if(serviceid!=null){
        sql=sql+" and serviceid=? group by serviceid";
        list.add(params,serviceid);
    }else{
        sql=sql+" group by serviceid";
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? and event_type='03' group by serviceid";
    var params2=[dt,instanceid];
    if(serviceid!=null){
        getFailedNum="select serviceid,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? and event_type='03' and serviceid=? group by serviceid";
        params2=[dt,instanceid,serviceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    var data=[];
    for(r in sys.result.result){
        var find=false; //serviceid
        for(r2 in sys.result.failed_r){
            if(r2.serviceid==r.serviceid){
                find=true;
                list.add(data,{
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
                "serviceid":r.serviceid,
                "servicenm":r.servicenm,
                "req_cnt":r.req_cnt,
                "successed_cnt":r.req_cnt,
                "failed_cnt":"0"
            });
        }
    }
    // 获取调用总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in data){
        p=p+sys.parseInt(r.req_cnt);
        s=s+sys.parseInt(r.successed_cnt);
        f=f+sys.parseInt(r.failed_cnt);
    }
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    // 列的描述
    var type=[
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
    //服务名称是否为空
    for(r in data){
        if(r.servicenm==""){
            map.put(r,"servicenm","此服务已删除");
        }
    }
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","count");
}else if(dt_from!=null && dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    // 请求数
    var sql="select log_date_char dt,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and serviceid=? group by log_date_char";
    var params=[dt_from,dt_to,instanceid,serviceid];
    if(serviceid!=null){
    }else{
        sql=sys.replace(sql,"and serviceid=?","");
        params=[dt_from,dt_to,instanceid];
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt,count(distinct runningid) as failed_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and serviceid=? and event_type='03' group by dt";
    var params2=[dt_from,dt_to,instanceid,serviceid];
    if(serviceid!=null){
    }else{
        getFailedNum=sys.replace(getFailedNum,"and serviceid=?","");
        params2=[dt_from,dt_to,instanceid];
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    var data=[];
    for(r in sys.result.result){
        var find=false; //dt
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt){
                find=true;
                list.add(data,{
                    "dt":r.dt,
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
                "req_cnt":r.req_cnt,
                "successed_cnt":r.req_cnt,
                "failed_cnt":"0"
            });
        }
    }
    // 获取调用总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in data){
        p=p+sys.parseInt(r.req_cnt);
        s=s+sys.parseInt(r.successed_cnt);
        f=f+sys.parseInt(r.failed_cnt);
    }
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    // 列的描述
    var type=[
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
    //格式化日期（20151111->2015-11-11）
    for(r in data){
        map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    }
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","count");
}else{
    sys.setRetData("1");
}