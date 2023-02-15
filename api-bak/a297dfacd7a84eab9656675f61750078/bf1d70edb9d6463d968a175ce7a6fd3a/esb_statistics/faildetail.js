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
var dt_from=sys.request.dt_from;    //开始日期
var dt_to=sys.request.dt_to;    //结束日期
var instanceid=sys.request.instanceid;  //节点ID
var serviceid=sys.request.serviceid;    //服务ID

if(instanceid==null||serviceid==null){
    sys.setRetData("1");
    return;
}

var sql="";
var params=[];
if(dt!=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    sql="select log_date_char,log_time_char,runningid,log from sys_pl_log_esb_statistics where log_date_char=? and instanceid=? and serviceid=? and event_type='03'";
    params=[dt,instanceid,serviceid];
}else if(dt_from!=null && dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    
    sql="select log_date_char,log_time_char,runningid,log from sys_pl_log_esb_statistics where log_date_char>=? and log_date_char<=? and instanceid=? and serviceid=? and event_type='03'";
    params=[dt_from,dt_to,instanceid,serviceid];
}else{
    sys.setRetData("1");
}

sql.query(sql,params,"data");
// 列的描述
var type=[
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
        "en":"runningid",
        "cn":"执行ID",
        "view":"1"
    },
    {
        "en":"log",
        "cn":"消息",
        "view":"1"
    }
    ];
//格式化日期（20151111->2015-11-11）
for(r in sys.result.data){
    map.put(r,"dt",sys.subStringTo(r.log_date_char,0,4)+"-"+sys.subStringTo(r.log_date_char,4,6)+"-"+sys.subStringTo(r.log_date_char,6,8)+" "+sys.subStringTo(r.log_time_char,0,2)+":"+sys.subStringTo(r.log_time_char,2,4)+":"+sys.subStringTo(r.log_time_char,4,6));
}
sys.addRetData(type,"type");
sys.setRetData("0","","data","type");