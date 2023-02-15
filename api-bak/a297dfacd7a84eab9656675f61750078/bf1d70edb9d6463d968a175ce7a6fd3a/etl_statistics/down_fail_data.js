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
// download接口
var dt = sys.request.dt;    // 日期点
var dt_from = sys.request.dt_from;  //开始日期
var dt_to = sys.request.dt_to;    //结束日期
var instanceid = sys.request.instanceid;    //节点ID
var daqid = sys.request.daqid;  //采集点ID
var jobid = sys.request.jobid;  //作业ID
var runningid = sys.request.runningid;  //单次运行ID
var withdetail = sys.request.isdetail;    //是否包含详细信息
var withdata = sys.request.withdata;    //是否包含失败数据

if(instanceid==null || jobid==null){
    sys.setRetData("1");
    return;
}
if(daqid==null){
    daqid="";
}
// 生成CSV文件路径
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");

var sql = "select a.log_date_char,a.log_time_char,a.runningid,a.data_row,a.log from sys_pl_log_etl_statistics a where a.log_date_char=? and a.instanceid=? and a.daqid=? and a.jobid=? and a.event_type='03'";
var params = [];
//带失败数据的sql
if(withdata=="1"){
    sql = "select a.log_date_char,a.log_time_char,a.runningid,a.data_row,a.log,b.log_data  from sys_pl_log_etl_statistics a,sys_pl_log_etl_statistics_data b where a.runningid=b.runningid and a.data_row=b.data_row and a.log_date_char=? and a.instanceid=? and a.daqid=? and a.jobid=? and a.event_type='03'";
}
// 日期点还是日期段
if(dt!=null){
    //处理参数
    dt=sys.replace(dt,"-","");
    params = [dt,instanceid,daqid,jobid];
}else if(dt_from!=null&&dt_to!=null){
    //处理参数
    dt_from=sys.replace(dt_from,"-","");
    dt_to=sys.replace(dt_to,"-","");
    
    sql=sys.replace(sql,"a.log_date_char=?","a.log_date_char>=? and a.log_date_char<=?");
    params = [dt_from,dt_to,instanceid,daqid,jobid];
}else{
    sys.setRetData("1");
}
if(runningid != null){
    sql=sql+" and a.runningid=?";
    list.add(params,runningid);
}
sql.query(sql,params,"data");
if(sys.size(sys.result.data)>0){
    // 详细信息
    if(withdetail=="1"){
        // 节点名称
        var getInstancenm = "select ip from sys_eeb_work_node where id=?";
        sql.query(getInstancenm,[instanceid],"instancenm_r");
        var Instancenm = "节点不存在";
        if(sys.size(sys.result.instancenm_r)>0){
            Instancenm = sys.result.instancenm_r[0].name;
        }
        // 采集点名称
        var getDaqnm = "select name from sys_eeb_jobgroup where id=?";
        sql.query(getDaqnm,[daqid],"daqnm_r");
        var Daqnm = "未指定";
        if(sys.size(sys.result.daqnm_r)>0){
            Daqnm = sys.result.daqnm_r[0].name;
        }
        // 作业名称
        var getJobnm = "select name from sys_eeb_run_conf where id=?";
        sql.query(getJobnm,[jobid],"jobnm_r");
        var Jobnm = "作业已删除";
        if(sys.size(sys.result.jobnm_r)>0){
            Jobnm = sys.result.jobnm_r[0].name;
        }
        for(r in sys.result.data){
            map.put(r,"集群节点",Instancenm);
            map.put(r,"采集点",Daqnm);
            map.put(r,"作业名称",Jobnm);
        }
    }
}
// 生成CSV文件
var reFile = sys.listToCsv(path,"log_info"+sys.currentTimeMillis()+".csv","UTF-8",sys.result.data);
var filenm = reFile[0];
// 返回文件路径和名称
sys.addRetData([{"path":path,"name":filenm}],"result");
sys.setRetData("0","","result");