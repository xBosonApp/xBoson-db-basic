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
//id:getuserdeptrole
//name:获取用户在部门的角色
//编写人：李宁
//测试url:
var openid=sys.request.openid;
var orgid=sys.request.orgid;
var userid=sys.request.userid;

if(orgid==null||userid==null){
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

if(orgid==null || pid==null){
    sys.setRetData("1");
    return;
}

//选择用户所在当前机构哪些部门
var sql_select="select a.deptid,b.deptnm from sys_user_dept a , mdm_dept b where a.deptid=b.deptid and b.status='1'";
sql_select=sql_select+" and a.pid=? and a.status='1' and b.orgid=?";
var param_select=[pid,orgid];

sql.query(sql_select,param_select);
var result=sys.result.result;

if(result==null){
    sys.setRetData("0");
    return;
}

//循环这些部门
var i=0;
for(r in result){
    //查询当前部门的角色
    var sql_sel="select a.deptid,a.roleid,b.rolenm from sys_dept_role a left join sys_role b on a.roleid=b.roleid";
    sql_sel=sql_sel+" where a.deptid=? and a.status='1' and b.status='1'";
    var sql_par=[r.deptid];
    sql.query(sql_sel,sql_par,"result"+i);
    
    i=i+1;
}