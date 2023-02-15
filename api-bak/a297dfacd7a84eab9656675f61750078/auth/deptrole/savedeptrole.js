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
//id:savedeptrole
//name:保存部门角色
//编写人：李宁
//测试url:

var deptid=sys.request.deptid;
var roleid=sys.request.roleid;
var orgid=sys.request.orgid;

var sql1="";
if(deptid==null){
    sys.setRetData("1");
    return;
}


sql1="delete from sys_dept_role where deptid=?";
var param1=[deptid];
sql.update(sql1,param1);
//如果roleid==null,则清空部门所有角色之后返回
if(roleid==null){
    sys.setRetData("0");
    return;
}
//插入新角色
var sql2="insert into sys_dept_role (deptid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var dt=sys.getCurrentTimeString();
//将roleid拆分成数组
var roleid_array=strutil.split(roleid,",");
var lent=roleid_array.~size;
var i=0;
while(i<lent){
  var param2=[deptid,roleid_array[i],"1",dt,dt];
  sql.update(sql2,param2,"1");
  i=i+1;
}
sql.commit();
sys.setRetData("0");