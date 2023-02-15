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
// register

// HTTP 请求参数 
var userid = sys.request.userid;
var regDate = sys.currentTimeString();
var openid = sys.request.openid;
var pid = sys.uuid();
var create_pid;
if (openid == null) {
  create_pid=pid;
} else {
  create_pid = sys.getUserPID(openid); 
}
var password=sys.request.password;
var tel=sys.request.tel;//手机注册
var email=sys.request.email;//邮箱注册
// var valwords=sys.request.valwords;//验证码
var orgid=sys.request.org;//机构id
var c=sys.request.c;//登陆验证码
var invitation_code=sys.request.invitation_code;//邀请码
//验证登陆验证码
if(c==null){
  sys.setRetData("10");
  return;
}else{
  if(sys.md5(c)!=http.getCookie("captcha")){
    sys.setRetData("10");
    return;
  }
}
//用户名密码
if(null==userid||null==password) {
  sys.setRetData("1","用户ID/密码不能为空！");
  return;
}
//手机邮箱
if(tel==null||email==null){
    sys.setRetData("1","手机/邮箱不能为空！");
    return;
}
//email转小写
email=sys.toLowerCase(email);
// 手机邮箱已存在
if(sql.query("select 1 from sys_userinfo where tel=?",[tel])>0){
    sys.setRetData("2","手机号码已被注册用户绑定！");
    return;
}
if(sql.query("select 1 from sys_userinfo where email=?",[email])>0){
    sys.setRetData("2","邮箱账号被注册用户绑定！");
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
  // 注册
//   if(tel==email && null==create_pid)
//   {
//     sys.setRetData("1","请输入手机/邮箱账号！"); 
//     return; 
//   }
//   if(null!=tel){
//       if(sys.cache.get("valwords"+tel)!=valwords){ 
//           sys.setRetData("1","验证码失效/不正确！"); 
//           return; 
//       };
//   }
//   if(null!=email){
//       if(sys.cache.get("valwords"+email)!=valwords){
//           sys.setRetData("1","验证码失效/不正确！"); 
//           return;
//       };
//   }

//   //管理员添加
//   var sqlIns = "insert into sys_userinfo(pid,userid,password,multiflag,status,createdt,updatedt,password_dt) values(?,?,?,?,?,?,?,?)";
  
//   var passwd = sys.encodePlatformPassword(userid,regDate,password);//加密
//   var paramIns = [pid,userid,passwd,"0","1",regDate,regDate,regDate];
  
//   var cnt = sql.update(sqlIns, paramIns, "1");
//   if (cnt == 0) {
//     sys.setRetData("5");
//   } else {
//     if(null==create_pid){
//         create_pid=pid;
//     }
//     var count =sql.update("insert into mdm_personal_info (pid,status,createdt,updatedt,create_pid,update_pid,create_orgid,update_orgid,de0201010,de0201012) values(?,?,?,?,?,?,?,?,?,?)", [pid,"1",regDate,regDate,create_pid,create_pid,orgid,orgid,tel,email], "1");
//     if(count >0 )
//     {
//         if(null!=orgid)
//         {
//             count = sql.update("insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values(?,?,?,?,?,?)", [orgid,"1","0",regDate,regDate,pid], "1");
//         }
//         if(count>0){
//             sql.commit();
//             sys.setRetData("0");
//             return;
//         }
//     }
//     sql.rollback();
//     sys.setRetData("0");
//   }

  var isError = false;
   try {
    var sqlIns = "insert into sys_userinfo(pid,userid,password,multiflag,tel,email,status,createdt,updatedt,password_dt) values(?,?,?,?,?,?,?,?,?,?)";
    var passwd = sys.encodePlatformPassword(userid,regDate,password);//加密
    var paramIns = [pid,userid,passwd,"0",tel,email,"1",regDate,regDate,regDate];

    sql.update(sqlIns, paramIns, "1");
    sql.update("insert into mdm_personal_info (pid,status,createdt,updatedt,create_pid,update_pid,create_orgid,update_orgid,de0201010,de0201012) values(?,?,?,?,?,?,?,?,?,?)", [pid,"1",regDate,regDate,create_pid,create_pid,orgid,orgid,tel,email], "1");
    if(null!=orgid) {
      sql.update("insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values(?,?,?,?,?,?)", [orgid,"1","0",regDate,regDate,pid], "1");
    }
    //邀请码不为空，则把用户添加到邀请码对应的机构，及分配邀请码对应的角色
    if(null!=invitation_code){
        //获取邀请码对应的信息
        var sqlInv="select invitation_code,orgid,roleid,email,tele,expiration,status,createdt,updatedt from sys_pl_user_invitation where invitation_code=? and status='1'";
        sql.query(sqlInv,[invitation_code],"invi_r");
        if(sys.size(sys.result.invi_r)==0){
          sql.rollback();
          sys.setRetData("2","邀请码不合法！");
          return;
        }
        var params_org=[];  //机构
        //切换sql连接
        sql.connection("00000000000000000000000000000000");
        for(r in sys.result.invi_r){
            if(r.expiration<sys.currentTimeString()){
                sql.rollback();
                sys.setRetData("2","邀请码不合法！");
                return;
            }
            if(r.email!=""){
              if(r.email==email){
                list.add(params_org,[r.orgid,"1","0",regDate,regDate,pid]);
                sql.update("insert into "+r.orgid+".sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)",[pid,r.roleid,"1",regDate,regDate],"1");
              }
            }else{
              list.add(params_org,[r.orgid,"1","0",regDate,regDate,pid]);
              sql.update("insert into "+r.orgid+".sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)",[pid,r.roleid,"1",regDate,regDate],"1");
            }
        }
        //机构
        var sqlAddUserOrg="insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values (?,?,?,?,?,?)";
        sql.updateBatch(sqlAddUserOrg,params_org,"1");
        // sql.commit();
    }
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