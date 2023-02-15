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
//id:prjuserop 项目组人员维护
var action = sys.request.action;
var orgid = sys.request.org;
var ugid=sys.request.ugid;
var userid=sys.request.userid;

if (ugid == null||userid==null) {
    sys.setRetData("1");
    return;
}
if (action=='add') {
    //判断主键是否重复
    var dt = date.currentTimeString();//获取当前时间
    var arr=sys.split(userid,",");
    var newUserPidList=[];
    for(r in arr ){
        var pid = sys.getUserPID(r);
        list.add(newUserPidList,pid);
        var sqlSel="select pid from sys_ug_user where pid = ? and ugid = ?";
        var param=[pid,ugid];
        var countSel=sql.query(sqlSel,param);
        if(countSel>=1){
            continue;
        }
        sql.update("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)",[ugid,pid,"1",dt,dt]);
    }
    //更新用户权限缓存
    se.reloadUserRole(arr);
    var s="";
    for(r in newUserPidList){
      s=s+",'"+r+"'";
    }
    s=sys.subString(s,1);
    s="("+s+")";
    var strSql="select p.de0201039,i.userid from sys_ug ug,sys_ug_user uguser,mdm_personal_info p,sys_userinfo i where ug.ugid=? and ug.ugid=uguser.ugid and uguser.pid=p.pid and uguser.pid=i.pid and uguser.status='1' and ug.status='1' and p.status='1' and i.status='1' and uguser.pid in " + s;
    sql.query(strSql,[ugid],"result");
    sys.setRetData("0","","result");
} 
else if (action=='delete') {
    //判断当前pid 和传过来的Pid是否为一个人
    var pidToBeDeleted = sys.getUserPID([userid])[userid];
    var pidC=sys.getUserPID();
    if(pidToBeDeleted==pidC){
       sys.setRetData("2","当前用户不可删除自己");
       return; 
    }
    //不可删除管理员
    var getManaPid = "select pid from sys_tenant_user where orgid=? and admin_flag  in ('1','3','5')";
    var count = sql.query(getManaPid,[orgid],"manapid");
    if(count == 1){
        if(sys.result.manapid[0].pid==pidToBeDeleted){
            sys.setRetData("2","不可删除管理员！");
            return;
        }
    }
    
    sql.query('Select count(1) c from sys_ug_user where ugid = ?', [ugid], 'ugcount');
    if (sys.result.ugcount[0].c < 2) {
      sys.setRetData("2","项目中最后一个用户不可删除");
      return;
    }
    
    var sqlDlt = "delete from sys_ug_user where ugid = ? and pid =?";
    sql.update(sqlDlt,[ugid,pidToBeDeleted]);

    //更新用户权限缓存
    se.reloadUserRole([userid]);
    sys.setRetData("0");
}