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
//id:additem
//name:添加项目

var rolenm = sys.request.rolenm;
var status= sys.request.status;
//判断数据库中不允许为空的字段 
if(rolenm==null||status==null){
  sys.setRetData("1");
  return;
}

var role_desc = sys.request.role_desc;
var orgid = sys.request.org;
var openid=sys.request.openid;
var pid=sys.getUserPID(openid);
var adminFlag=sys.getUserAdminFlag(openid,orgid);
//插入sys_role表
var roleid=sys.uuid();
var dt = sys.currentTimeString();//获取当前时间
var params=[roleid,rolenm,null,"0","02",role_desc,orgid,status,dt,dt];
var sql="insert into sys_role (roleid,rolenm,comm_flag,op_type,role_type,role_desc,orgid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?)";
sql.update(sql,params,"1");

//更新sys_user_role表
var sql2="insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var params1=[pid,roleid,"1",dt,dt];
sql.update(sql2,params1,"1");

sql.commit();

//获取管理员pid
//并将管理员放到项目人员里
if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
    
}else{
    var getManaPid = "select pid from sys_tenant_user where orgid=? and admin_flag  in ('1','3','5')";
    count = sql.query(getManaPid,[orgid],"manapid");

    if(count == 1){
        sql.update(sql2,[sys.result.manapid[0].pid,roleid,"1",dt,dt]);
    }else if(count == 0){
        sys.setRetData("2","此机构没有管理员！");
        return;
    }else if(count > 1){
        sys.setRetData("2","此机构管理员超过一人！");
        return;
    }    
}
//立即更新用户权限缓存
se.reloadUserInfo([sys.getUserIdByOpenId()]);
sys.setRetData("0");