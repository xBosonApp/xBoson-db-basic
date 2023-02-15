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
var orgid=sys.request.org;
var file_name=sys.request.file_name;
var typecd=sys.request.typecd;
var file_dir,file_type,raw_fileid,status,createdt,updatedt;
file_type="0";  //文件类型为0（模板）
status="1";
updatedt=sys.currentTimeString();
createdt=updatedt;

if(typecd==null || file_name==null){
    sys.setRetData("1");
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
    bkfile_name=sys.replace(file_name,".","_"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".");
    exist=true;
}else{
    raw_fileid=null;
    exist=false;
}
//拼上传路径
var template_path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE");
var backup_path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_BACKUP");
if(template_path==null || backup_path==null){
    sys.setRetData("2");
    return;
}
file_dir=template_path;
var file_dir_b=template_path+backup_path;
//添加记录到数据库
var sql_ins="insert into sys_template (fileid,filenm,file_desc,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid) values (?,?,?,?,?,?,?,?,?,?)";
var fileid=sys.uuid();
var params_ins=[fileid,file_name,null,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid];
//更新记录
var sql_upd="update sys_template set file_desc=? ,updatedt=? where fileid=?";
var params_upd=[null,updatedt,raw_fileid];
//更新时同时添加到数据库一条备份记录
var sql_ins0="insert into sys_template (fileid,filenm,file_desc,file_dir,file_type,raw_fileid,status,createdt,updatedt,orgid) values (?,?,?,?,?,?,?,?,?,?)";
var params_ins0=[fileid,bkfile_name,null,file_dir_b,file_type,raw_fileid,status,createdt,updatedt,orgid];

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
    sys.setRetData("2","异常");
    return;
}
//更新业务模型表
var updModal_03 = "update sys_bm003 set fileid=? where typecd=? and status='1' ";
var updModal_04 = "update sys_bm004 set fileid=? where typecd=? and status='1' ";
var updModalParam = [fileid,typecd];
if(raw_fileid!=null){
    updModalParam = [raw_fileid,typecd];
}
var cnt=sql.update(updModal_03,updModalParam);
if(cnt==0){
    cnt=sql.update(updModal_04,updModalParam);
    if(cnt==0){
        sys.setRetData("2","模型绑定模板异常！");
        return;
    }
}
//返回路径
sys.addRetData([{"path":file_dir,"name":file_name,"name_backup":bkfile_name,"path_backup":file_dir_b}],"result");
sys.setRetData("0","","result");