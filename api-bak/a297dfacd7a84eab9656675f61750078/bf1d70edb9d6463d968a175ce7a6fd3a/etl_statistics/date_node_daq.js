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

if(instanceid == null){
    sys.setRetData("1");
    return;
}

if(dt != null){
    //处理参数
    dt=sys.replace(dt,"-","");
    //执行数，处理数
    var sql = "SELECT runningcnt_select.daqid, sys_eeb_jobgroup.name AS daqnm, runningcnt_select.runningcnt, processedcnt_select.processedcnt FROM (SELECT daqid, count(distinct runningid) AS runningcnt FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? GROUP BY daqid) AS runningcnt_select, (SELECT daqid, sum(cnt) AS processedcnt FROM sys_pl_log_etl_statistics WHERE log_date_char=? AND instanceid=? AND event_type='02' GROUP BY daqid) AS processedcnt_select left join sys_eeb_jobgroup on sys_eeb_jobgroup.id=processedcnt_select.daqid WHERE runningcnt_select.daqid=processedcnt_select.daqid";
    var params=[dt,instanceid,dt,instanceid];
    // 是否指定采集点ID
    if(daqid != null){
        sql=sql+" and runningcnt_select.daqid=?";
        list.add(params,daqid);
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select daqid, count(*) AS failedcnt from sys_pl_log_etl_statistics  WHERE log_date_char=? AND instanceid=? AND event_type='03'";
    var params2=[dt,instanceid];
    if(daqid!=null){
        getFailedNum=getFailedNum+" and daqid=? group by daqid";
        list.add(params2,daqid);
    }else{
        getFailedNum=getFailedNum+" group by daqid";
    }
    sql.query(getFailedNum,params2,"failed_r");
    //合并记录
    var data=[];
    for(r in sys.result.result){
        var find=false; //daqid
        for(r2 in sys.result.failed_r){
            if(r2.daqid==r.daqid){
                find=true;
                list.add(data,{
                    "daqid":r.daqid,
                    "daqnm":r.daqnm,
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
                "daqid":r.daqid,
                "daqnm":r.daqnm,
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });    
        }
    }
    // 列的描述
    var type =[
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
    // 获取处理总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in data){
        p=p+sys.parseInt(r.processedcnt);
        s=s+sys.parseInt(r.successedcnt);
        f=f+sys.parseInt(r.failedcnt);
    }
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    //采集点为空时，显示空
    for(r in data){
        if(r.daqid==""){
            map.put(r,"daqnm","空");
        }
    }
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","count");
}else if(dt_from != null && dt_to != null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    
    var sql = "",params=[];
    if(daqid != null){
        sql = "SELECT runningcnt_select.log_date_char as dt, runningcnt_select.runningcnt, processedcnt_select.processedcnt FROM (SELECT log_date_char, count(distinct runningid) AS runningcnt FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND daqid=? GROUP BY log_date_char) AS runningcnt_select, (SELECT log_date_char, sum(cnt) AS processedcnt FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND event_type='02' AND daqid=? GROUP BY log_date_char) AS processedcnt_select WHERE runningcnt_select.log_date_char=processedcnt_select.log_date_char";
      params=[dt_from,dt_to,instanceid,daqid,dt_from,dt_to,instanceid,daqid];
    }else{
        sql = "SELECT runningcnt_select.log_date_char as dt, runningcnt_select.runningcnt, processedcnt_select.processedcnt FROM (SELECT log_date_char, count(distinct runningid) AS runningcnt FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? GROUP BY log_date_char) AS runningcnt_select, (SELECT log_date_char, sum(cnt) AS processedcnt FROM sys_pl_log_etl_statistics WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND event_type='02' GROUP BY log_date_char) AS processedcnt_select WHERE runningcnt_select.log_date_char=processedcnt_select.log_date_char";
      params=[dt_from,dt_to,instanceid,dt_from,dt_to,instanceid];
    }
    sql.query(sql,params,"result");
    //失败数
    var getFailedNum="select log_date_char as dt, count(*) AS failedcnt from sys_pl_log_etl_statistics  WHERE log_date_char>=? AND log_date_char<=? AND instanceid=? AND event_type='03'";
    var params2=[dt_from,dt_to,instanceid];
    if(daqid!=null){
        getFailedNum=getFailedNum+" and daqid=? group by dt";
        list.add(params2,daqid);
    }else{
        getFailedNum=getFailedNum+" group by dt";
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
                "runningcnt":r.runningcnt,
                "processedcnt":r.processedcnt,
                "successedcnt":r.processedcnt,
                "failedcnt":"0"
            });    
        }
    }
    // 列的描述
    var type =[
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
    // 获取处理总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in data){
        p=p+sys.parseInt(r.processedcnt);
        s=s+sys.parseInt(r.successedcnt);
        f=f+sys.parseInt(r.failedcnt);
    }
    //格式化日期（20151111->2015-11-11）
    for(r in data){
        map.put(r,"dt",sys.subStringTo(r.dt,0,4)+"-"+sys.subStringTo(r.dt,4,6)+"-"+sys.subStringTo(r.dt,6,8));
    }
    //采集点为空时，显示空
    for(r in data){
        if(r.daqid==""){
            map.put(r,"daqnm","空");
        }
    }
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    sys.addRetData(type,"type");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","count");
}else{
    sys.setRetData("1");
}