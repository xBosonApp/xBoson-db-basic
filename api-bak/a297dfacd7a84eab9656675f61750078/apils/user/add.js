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
// HTTP 请求参数 
var userid = sys.request.userid;
var password=sys.request.password;
var tel=sys.request.tel;    //手机
var email=sys.request.email;//邮箱
var orgid=sys.request.org;  //机构id

if (userid == null) {
  sys.setRetData("1", "用户ID为空！");
  return;
}
if (password == null) {
  sys.setRetData("1", "密码为空！");
  return;
}

if(null!=tel && 0<sql.query(" select 1 from sys_userinfo where tel=? ",[tel])) {
    // 用户已存在
    sys.setRetData("0","手机号码已被注册用户绑定！","result");
    return;
}
if(null!=email && 0<sql.query("select 1 from sys_userinfo where email=?",[email]))
{
    // 用户已存在
    sys.setRetData("0","邮箱账号被注册用户绑定！","result");
    return;
}
// 用户已存在
var sqlSel = "select count(*) cnt from sys_userinfo where userid=?";
var paramSel = [userid];
sql.query(sqlSel,paramSel,"cnt");
var selResult = sys.result.cnt;
var selCount = "0";
for (r in selResult) {
  selCount = r.cnt;
}
if (selCount == "0") {
  var pid = sys.uuid();
  var regDate = sys.currentTimeString();
  var create_pid = sys.getUserPID(sys.request.openid);
  var isError = false;
  try {
    var sqlIns = "insert into sys_userinfo(pid,userid,password,multiflag,status,createdt,updatedt,password_dt) values(?,?,?,?,?,?,?,?)";
    var passwd = sys.encodePlatformPassword(userid,regDate,password);//加密
    var paramIns = [pid,userid,passwd,"0","1",regDate,regDate,regDate];
  
    sql.update(sqlIns, paramIns, "1");
    sql.update("insert into mdm_personal_info (pid,status,createdt,updatedt,create_pid,update_pid,create_orgid,update_orgid,de0201010,de0201012) values(?,?,?,?,?,?,?,?,?,?)", [pid,"1",regDate,regDate,create_pid,create_pid,orgid,orgid,tel,email], "1");
    sql.update("insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values(?,?,?,?,?,?)", [orgid,"1","0",regDate,regDate,pid], "1");
    sql.commit();
    sys.setRetData("0");
  } catch (error) {
    isError = true;
  }
  if (isError) {
    sql.rollback();
    sys.setRetData("5");  // 接口执行失败
  }
} else {
  // 用户已存在
  sys.setRetData("1011");
}