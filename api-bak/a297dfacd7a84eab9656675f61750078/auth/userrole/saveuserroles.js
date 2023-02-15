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
//id:saveuserroles
//name:保存指定用户角色
//编写人：李宁
//测试url：

// var openid=sys.request.openid;
var roleid=sys.request.roleid;
var orgid=sys.request.orgid;
var userid=sys.request.userid;

if(userid==null||orgid==null){
    sys.setRetData("1");
    return;
}
//获取pid
var pid="";
var sql0="select pid from sys_userinfo where userid=?";
var param0=[userid];
sql.query(sql0,param0,"user_pid");
var user_pid=sys.result.user_pid;
for(r in user_pid){
    pid=r.pid;
}

if(pid==null||pid==''){
    sys.setRetData("2");
    return;
}

var sql1="";

//select用户在当前机构的角色
// var sql_role="select b.roleid from sys_user_role a join sys_role b on a.roleid=b.roleid where a.pid=?";
// var param_role=[pid];
// sql.query(sql_role,param_role);
// //保存之前只删除用户在当前机构的角色
// //遍历用户在当前机构的角色执行删除
// var result=sys.result.result;
// for(r in result){
//     sql1="delete from sys_user_role where pid=? and roleid=?";
//     var param1=[pid,r.roleid];
//     sql.update(sql1,param1,"1");
// }
// sql.commit();
//
sql1="delete from sys_user_role where pid=? and (roleid in (select roleid from sys_role where role_type='01') or roleid not in (select roleid from sys_role))";
    var param1=[pid];
    sql.update(sql1,param1);
//如果roleid==null,说明全删除用户角色
if(roleid==null){
    sys.setRetData("0");
    return;
}
//插入新角色
var sql2="insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var dt=sys.currentTimeString();
// //如果roleid多于一个，则将roleid拆分成数组
// if(){
    
// }else{
var roleid_array=strutil.split(roleid,",");
var lent=roleid_array.~size;
var i=0;
while(i<lent){
  var param2=[pid,roleid_array[i],"1",dt,dt];
  sql.update(sql2,param2,"1");
  i=i+1;
}

sql.commit();
sys.setRetData("0");