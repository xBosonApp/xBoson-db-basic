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
var dt=sys.request.dt;
var dt_from=sys.request.dt_from;
var dt_to=sys.request.dt_to;
var instanceid=sys.request.instanceid;

if(dt!=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    // 节点的服务数量，调用次数
    var sql = "select serv_cnt_select.instanceid,sys_eeb_work_node.ip instancenm,serv_cnt_select.serv_cnt,req_cnt_select.req_cnt from (select instanceid,count(distinct serviceid) as serv_cnt from sys_pl_log_esb_statistics where log_date_char=? group by instanceid) serv_cnt_select, (select instanceid,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char=? group by instanceid) req_cnt_select left join  sys_eeb_work_node on req_cnt_select.instanceid=sys_eeb_work_node.id where serv_cnt_select.instanceid=req_cnt_select.instanceid ";
    var params=[dt,dt];
    if(instanceid!=null){
        sql=sql+" and serv_cnt_select.instanceid=?";
        list.add(params,instanceid);
    }else{
        sql=sql+" order by instancenm";
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum = "SELECT instanceid,count(DISTINCT runningid) AS failed_cnt FROM sys_pl_log_esb_statistics WHERE log_date_char=? AND event_type='03' ";
    var params2=[dt];
    if(instanceid!=null){
        getFailedNum=getFailedNum+" and instanceid=? GROUP BY instanceid";
        params2=[dt,instanceid];
    }else{
        getFailedNum=getFailedNum+" GROUP BY instanceid";
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    var data=[];
    for(r in sys.result.result){
        var find = false;   //instanceid
        for(r2 in sys.result.failed_r){
            if(r2.instanceid==r.instanceid){
                find = true;
                list.add(data,{
                    "instanceid":r.instanceid,
                    "instancenm":r.instancenm,
                    "serv_cnt":r.serv_cnt,
                    "req_cnt":r.req_cnt,
                    "successed_cnt":sys.parseInt(r.req_cnt)-sys.parseInt(r2.failed_cnt),
                    "failed_cnt":r2.failed_cnt
                });
                break;
            }
        }
        if(!find){
            list.add(data,{
                "instanceid":r.instanceid,
                "instancenm":r.instancenm,
                "serv_cnt":r.serv_cnt,
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
    //列的描述
    var type=[
        {
            "en":"instancenm",
            "cn":"节点",
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
            "en":"instanceid",
            "cn":"节点ID",
            "view":"0",
            "chart":""
        }
    ];
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","count");
}
else if(dt_from!=null&&dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    //服务数，请求数
    var sql = "select serv_cnt_select.log_date_char dt,serv_cnt_select.serv_cnt,req_cnt_select.req_cnt from (select log_date_char,count(distinct serviceid) as serv_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=?  group by log_date_char) serv_cnt_select, (select log_date_char,count(distinct runningid) as req_cnt from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? group by log_date_char) req_cnt_select where serv_cnt_select.log_date_char=req_cnt_select.log_date_char";
    var params=[dt_from,dt_to,instanceid,dt_from,dt_to,instanceid];
    if(instanceid!=null){
    }else{
        sql=sys.replace(sql,"and instanceid=?","");
        params=[dt_from,dt_to,dt_from,dt_to];
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum = "SELECT log_date_char AS dt,count(DISTINCT runningid) AS failed_cnt FROM sys_pl_log_esb_statistics WHERE log_date_char>=? and log_date_char<=? AND event_type='03' ";
    var params2=[dt_from,dt_to];
    if(instanceid!=null){
        getFailedNum=getFailedNum+" and instanceid=? GROUP BY dt";
        params2=[dt_from,dt_to,instanceid];
    }else{
        getFailedNum=getFailedNum+" GROUP BY dt";
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    var data=[];
    for(r in sys.result.result){
        var find = false;   //dt
        for(r2 in sys.result.failed_r){
            if(r2.dt==r.dt){
                find = true;
                list.add(data,{
                    "dt":r.dt,
                    "serv_cnt":r.serv_cnt,
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
                "serv_cnt":r.serv_cnt,
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
    //列的描述
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
}
else{
    sys.setRetData("1");
}