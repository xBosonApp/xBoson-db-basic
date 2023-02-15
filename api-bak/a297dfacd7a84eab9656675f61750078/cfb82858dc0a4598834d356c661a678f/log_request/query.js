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
// 查询条件
var dt_from=sys.request.dt_from;
var dt_to=sys.request.dt_to;
var time_from=sys.request.time_from;
var time_to=sys.request.time_to;
var appid=sys.request.appid;    //app
var modid=sys.request.modid;    //module
var apiid=sys.request.apiid;    //api
// var log_level=sys.request.log_level;    //日志级别
// var log_error_type=sys.request.log_error_type;  //日志异常类型
var request_id=sys.request.request_id;    //请求ID
var elapsed=sys.request.elapsed;    //最小请求耗时

var pagenum=sys.request.pagenum;    //分页的第几页
var pagesize=sys.request.pagesize;  //每页条数

if(pagenum==null || pagesize==null){
    sys.setRetData("1", "缺少分页参数");
    return;
}

if (dt_from==null || dt_to==null) {
  sys.setRetData("1", "请指定日期范围");
  return;
}
if (time_from==null || time_to==null) {
  sys.setRetData("1", "请指定时间范围");
  return;
}
var objDateFrom = date.parseDate(dt_from+time_from, "yyyy-MM-ddHH:mm:ss");
var objDateTo = date.parseDate(dt_to+time_to, "yyyy-MM-ddHH:mm:ss");
var strISODateFrom = date.formattedTime(objDateFrom, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
var strISODateTo = date.formattedTime(objDateTo, "yyyy-MM-dd'T'HH:mm:ss.999Z");

sys.printValue(strISODateFrom,strISODateTo);

var start=0,end=0,ElapseInfo={"time1":0,"time2":0};    //sql耗时
var sql="select logid,log_time,log_level,log_error_type,requestid,serverid,log,orgid,pid,sysid,user_key,remote_ip,appid,moduleid,apiid,elapsed,user_referer,user_agent,cookie,createdt from sys_pl_log_request where log_time >= '"+strISODateFrom+"' and log_time <= '"+strISODateTo+"'";
var params=[];

if(appid!=null){
    sql=sql+" and appid=?";
    list.add(params,appid);
}
//module
if(modid!=null){
    sql=sql+" and moduleid=?";
    list.add(params,modid);
}
//api
if(apiid!=null){
    sql=sql+" and apiid=?";
    list.add(params,apiid);
}
//请求耗时
if(elapsed!=null){
    sql=sql+" and elapsed>=?";
    list.add(params,sys.parseInt(elapsed));
}
//请求ID
if(request_id!=null){
    sql=sql+" and requestid=?";
    list.add(params,request_id);
}
// //log_level
// if(log_level!=null){
//     sql=sql+" and log_level=?";
//     list.add(params,log_level);
// }
// //log_error_type
// if(log_error_type!=null){
//     sql=sql+" and log_error_type=?";
//     list.add(params,log_error_type);
// }

//分页查询
start=date.currentTimeMillis();

sql.queryPaging(sql,params,pagenum,pagesize);

end=date.currentTimeMillis();
map.put(ElapseInfo,"time1",end-start);

//结果集添加userid,sysnm
start=date.currentTimeMillis();

if(sys.size(sys.result.result)>0){
    //pid->userid
    var pidArr=[];
    for(r in sys.result.result){
        if(!list.contain(pidArr,r.pid)){
            list.add(pidArr,r.pid);
        }
    }
    var inPid="";
    for(r in pidArr){
        inPid=inPid+",'"+r+"'";
    }
    inPid=sys.subString(inPid,1);
    sql.query("select pid,userid from sys_userinfo where pid in ("+inPid+")",null,"pid_userid");
    var userMap={};
    for(r in sys.result.pid_userid){
        map.put(userMap,r.pid,r.userid);
    }
    //sysid->sysnm
    var sysidArr=[];
    for(r in sys.result.result){
        if(!list.contain(sysidArr,r.sysid)){
            list.add(sysidArr,r.sysid);
        }
    }
    var insysid="";
    for(r in sysidArr){
        insysid=insysid+",'"+r+"'";
    }
    insysid=sys.subString(insysid,1);
    sql.query("select sysid,sysnm from sys_system where sysid in ("+insysid+")",null,"sysid_sysnm");
    var sysMap={};
    for(r in sys.result.sysid_sysnm){
        map.put(sysMap,r.sysid,r.sysnm);
    }
    //orgid->orgnm
    var orgidArr=[];
    for(r in sys.result.result){
        if(!list.contain(orgidArr,r.orgid)){
            list.add(orgidArr,r.orgid);
        }
    }
    var inorgid="";
    for(r in orgidArr){
        if(sys.contain(r,"'")){
            r=sys.replace(r,"'","\\'");
        }
        inorgid=inorgid+",'"+r+"'";
    }
    inorgid=sys.subString(inorgid,1);
    sys.printValue(inorgid);
    sql.query("select orgid,de0810013j orgnm from mdm_org where orgid in ("+inorgid+")",null,"orgid_orgnm");
    var orgMap={};
    for(r in sys.result.orgid_orgnm){
        map.put(orgMap,r.orgid,r.orgnm);
    }
    //添加userid,sysnm,orgnm
    for(r in sys.result.result){
        map.put(r,"userid",userMap[r.pid]==null?"":userMap[r.pid]);
        map.put(r,"sysnm",sysMap[r.sysid]==null?"":sysMap[r.sysid]);
        map.put(r,"orgnm",orgMap[r.orgid]==null?"":orgMap[r.orgid]);
    }
}

end=date.currentTimeMillis();
map.put(ElapseInfo,"time2",end-start);

sys.addRetData(ElapseInfo,"ElapseInfo");
sys.setRetData("0","","result","ElapseInfo");