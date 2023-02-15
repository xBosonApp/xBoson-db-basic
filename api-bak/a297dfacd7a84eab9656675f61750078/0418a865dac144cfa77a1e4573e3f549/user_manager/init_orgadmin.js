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
var orgid =sys.request.org;//当前管理员的机构
var admintype=sys.request.admintype;//管理员类型
var status=sys.request.status;
var org_id=sys.request.orgid;//指定机构
var userid=sys.request.userid;//指定管理员

var adminflag=sys.getUserAdminFlag();
var dt=date.currentTimeString();
var roleid="";
var prams=[];
var sqls="";
var count=0;
var pid="";
 
// 额外创建连接进行对非平台机构的管理员绑定
sql.connection("00000000000000000000000000000000");

try{
    //查询pid
    var selpid="select pid from sys_userinfo where userid=?";
    sql.query(selpid,[userid],"keypid");
    pid=sys.result.keypid[0].pid;

    // if("1"==adminflag){
        // count = sql.query("select * from sys_tenant_user where orgid=? and admin_flag=?",[org_id,admintype]);
        // if(count>0){
        //     sys.setRetData("1011","已存在管理员，不可重复绑定！");
        //     return;
        // }

        sqls="insert into sys_tenant_user (orgid,pid,status,admin_flag,createdt,updatedt) values (?,?,?,?,?,?)";
        
        prams=[org_id,pid,status,admintype,dt,dt];
        count = sql.update(sqls,prams,"1");
    // }
    
    if(count>0) {
        if("3"==admintype) {
            // '租户系统管理员'
            roleid="d24ae1e56734459d9722974064a21634";
        }
        if("1"==admintype||"5"==admintype) {
            // '平台超级管理员'
            roleid="d24ae1e56734459d9722974064a21634";
        }
        sql.update("delete from "+org_id+".sys_user_role where pid=? and roleid=?",[pid,roleid],"1");

        sqls="insert into "+org_id+".sys_user_role (pid,roleid,status,createdt,updatedt) values(?,?,?,?,?)";
        sql.update(sqls,[pid,roleid,"1",dt,dt],"1");
        sql.commit();
        // 更新缓存
        se.reloadUserRole([userid]);
        sys.setRetData("0","成功绑定管理员！");
        return;
    } 
}catch(err) {
  sql.rollback();
  sys.printValue(err);
  sys.setRetData("1","绑定管理员用户失败，请确认该机构是否已经初始化");
  return;
}
sql.rollback();
sys.setRetData("1","绑定管理员用户失败！");