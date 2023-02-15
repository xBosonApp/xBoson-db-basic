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
var orgid = sys.request.org;
var schedulenm = sys.request.schedulenm;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值
var task_ids = [];
var param=[orgid];
var sqls ="select scheduleid, schedulenm, schedule_cycle, time_year, time_month, time_day, time_hour, time_min, time_sec, time_dayofweek, schedule_interval, run_end_time, run_times, schedule_status, task_api, mark, orgid, pid, status, createdt, updatedt from sys_pl_task_scheduler where orgid=? ";
if(null!=schedulenm){
    sqls=sqls+" and schedulenm like '%"+schedulenm+"%' ";
}
if(null==pagenum)pagenum = pNDefualt;
if(null==pagesize)pagesize = PSDefualt;
sqls = sqls + " order by createdt desc";
var counts = sql.queryPaging(sqls,param,pagenum,pagesize,"result");
if (0==counts) {
    sys.addRetData("result",[]);
    sys.setRetData("0","","result");
    return ;
}
try{
    var res = sys.result.result;
    for(var i=0;i<sys.size(res);i++){
        list.add(task_ids,orgid+":"+res[i].scheduleid);
    }
    var retUri=se.getCache(_CACHE_REGION_TP_APP_,"e0b5f238be924796b318a97d4e7e022c");//http://172.0.0.1:8088/cron/
    if (retUri==null) {
      sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址是否已经设定");
      return;
    }
    var uri = retUri.uri;
    if (uri==null) {
      sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址是否已经设定");
      return;
    }
    var resGet=http.get(uri+"list",{"id":task_ids},"json");
    if (resGet == null) {
      sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务地址");
      return;
    }
    var resJs=resGet.data;
    if(0==resJs.ret){
        for(var j=0;j<sys.size(task_ids);j++){
            var task_status=3;
            if(null!=resJs.list && sys.size(resJs.list)>=j+1){
                if(null!=resJs.list[j]){
                    task_status=null==resJs.list[j].cd?3:resJs.list[j].cd;
                }
            }
            if("1"==res[j].schedule_status) {
                task_status = 0;
            }
            map.put(res[j],"task_status",task_status);
            //map.put(res[j],"history",resJs.list[j].history);
        }
        sys.addRetData("result",res);
        sys.setRetData("0","","result");
        return;
    }
    sys.setRetData("1","数据异常！");
    return;
}catch(error){
    sys.setRetData("1","计划任务服务调用失败，请联系管理员检查服务器状态");
    sys.printValue(error);
    return;
}