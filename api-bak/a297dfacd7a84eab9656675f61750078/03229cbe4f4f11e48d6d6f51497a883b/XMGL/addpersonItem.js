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
//id:addpersonItem
//name:人员添加项目

var roleid=sys.request.roleid;
var pid=sys.request.pid;
var status= sys.request.status;

//插入sys_user_role表
var dt = sys.currentTimeString();//获取当前时间

var sql="insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
//判断数据库中不允许为空的字段 
if(pid==null||roleid==null||status==null){
  sys.setRetData("1");
  return;
}

//判断主键是否重复
var arr=sys.split(pid,",");
for(r in arr ){
  var sqlSel="select pid,roleid from sys_user_role where pid = ? and roleid = ? ";
  var param=[r,roleid];
  var countSel=sql.query(sqlSel,param);
  if(countSel>=1){
    sys.setRetData("6");
    return;
   }
    var params=[r,roleid,status,dt,dt];
    var count = sql.update(sql,params);
    if (count == 0) {
      sys.setRetData("5");
      return;
    }
}
var s="";
for(r in arr ){
  s=s+",'"+r+"'";
}
s=sys.subString(s,1);
s="("+s+")";
var sqlSel3="select p.pid,p.de0201039,p.de0201040,p.de0201005,p.de0201030,"+
"p.de0810007 from mdm_personal_info p,sys_userinfo u where p.pid = u.pid and u.pid in "+s;
sql.query(sqlSel3,[],"result");
//更新用户权限缓存
se.reloadUserInfo([sys.getUserIdByOpenId()]);
sys.setRetData("0","","result");