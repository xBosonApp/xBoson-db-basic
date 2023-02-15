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
// //liufengyuan

var password=sys.request.password;
var newpassword=sys.request.newpassword;
var dt = sys.getCurrentTimeString();
var openid=sys.request.openid;

if(null == password || null == newpassword)
{
  sys.setRetData("1","请输入密码！");
  return;
}

//当前用户修改密码
var pid=sys.getUserPID(openid);
var sql="select userid,password_dt dt from sys_userinfo where pid=?";
var param=[pid];
sql.query(sql,param,"result");

var userid=sys.result.result[0].userid;
var dt2 = sys.result.result[0].dt;
var passwd = sys.encodePlatformPassword(userid,dt2,password);//加密
var newpasswd = sys.encodePlatformPassword(userid,dt,newpassword);//加密

if(sql.query("select * from sys_userinfo where pid=? and password=?",[pid,passwd],"")!=1)
{
   sys.setRetData("1001","用户名密码错误！");
}
else{
   sql.update("update sys_userinfo set password=?,password_dt=? where pid=?" ,[newpasswd,dt,pid]);
   sys.setRetData("0","修改密码成功！");
}