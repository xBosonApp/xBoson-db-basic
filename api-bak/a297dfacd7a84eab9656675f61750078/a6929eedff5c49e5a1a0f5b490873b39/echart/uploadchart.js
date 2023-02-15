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
var file_name=sys.request.file_name;
var file_desc=sys.request.file_desc;
var modid=sys.request.modid;  
var orgid=sys.request.org;
var pid_r=sys.getUserPID(sys.request.openid);
var file_dir,file_type,raw_fileid,status,createdt,updatedt;
file_type="1";  //文件类型为1（图表）
status="1";
updatedt=sys.currentTimeString();
createdt=updatedt;
//根据modid获取pid
if(modid==null){
    sys.setRetData("1");
    return;
}
var pid=null;
var sql_pid="select pid from sys_mod_kpi where modid=?";
var param_pid=[modid];
var cnt_pid=sql.query(sql_pid,param_pid,"result_pid");
if(cnt_pid>0){
    var result_pid=sys.result.result_pid;
    pid=result_pid[0].pid;
}else{
    sys.setRetData("2");
    return;
}
if(pid_r != pid){
    sys.setRetData("2","当前模块不属于此用户，请新建模块！");
    return;
}
var exist;   //标识文件是否存在
var bkfile_name;
//判断文件是否存在,并为raw_fileid赋值
var sql_filenm="select fileid from sys_template where filenm=? and orgid=? and raw_fileid is null and file_type=?";
var param_filenm=[file_name,orgid,file_type];
var cnt_filenm=sql.query(sql_filenm,param_filenm,"result_fnm");
if(cnt_filenm>0){
    var result_fnm=sys.result.result_fnm;
    raw_fileid=result_fnm[0].fileid;
    //备份文件名
    bkfile_name=sys.replace(file_name,".","_"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmss")+".");
    exist=true;
}else{
    raw_fileid=null;
    exist=false;
}
//拼上传路径
file_dir="chart/"+pid+"/";
var file_dir_b="chart/"+pid+"/backup/";
//添加记录到数据库
var sql_ins="insert into sys_template (fileid,filenm,file_desc,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid) values (?,?,?,?,?,?,?,?,?,?)";
var fileid=sys.uuid();
var params_ins=[fileid,file_name,file_desc,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid];
//更新记录
var sql_upd="update sys_template set file_desc=? ,updatedt=? where fileid=?";
var params_upd=[file_desc,updatedt,raw_fileid];
//更新时同时添加到数据库一条备份记录
var sql_ins0="insert into sys_template (fileid,filenm,file_desc,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid) values (?,?,?,?,?,?,?,?,?,?)";
var params_ins0=[fileid,bkfile_name,file_desc,file_dir_b,file_type,raw_fileid,status,createdt,updatedt,orgid];

var ret_code=0;
if(exist){
    ret_code=sql.update(sql_upd,params_upd);
    if(ret_code==1){
        ret_code=sql.update(sql_ins0,params_ins0);
    }
}else{
    ret_code=sql.update(sql_ins,params_ins);
}
if(ret_code<1){
    //@sys.result.put("ret","2");
    sys.addRetData('2', 'ret');
}
//返回路径
sys.addRetData([{"path":file_dir,"name":file_name,"name_backup":bkfile_name,"path_backup":file_dir_b}],"result");
sys.setRetData("0","","result");