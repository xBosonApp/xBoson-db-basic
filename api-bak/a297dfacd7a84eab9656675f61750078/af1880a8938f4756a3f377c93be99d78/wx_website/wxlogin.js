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
"use strict";

var code  = sys.request.getString('code', 10, 99);
var state = sys.request.getString('state', 10, 99);
var lib   = require("./lib");

lib.checkState(sys, state);

var tokenRet = http.get(lib.access_token_url(), 
    lib.access_token_parm(code), "json");

if (tokenRet.code != 200) {
  sys.setRetData(1, "调用微信接口错误: http-"+ tokenRet.code);
  return;
}

var tdata = tokenRet.data;
if (tdata.errcode) {
  sys.setRetData(2, "调用微信接口错误: "+ tdata.errcode +', '+ tdata.errmsg);
  return;
}

var openid = tdata.openid;
var orgid = lib.orgid();
var user = lib.getUser(openid);
var info;

if (!user) {
  // 创建用户
  var infoRet = http.get(lib.user_info_url(), 
      lib.user_info_parm(tdata.access_token, openid), "json");
  var idata = infoRet.data;
  if (idata.errcode) {
    sys.setRetData(3, "获取用户信息错误: "+ idata.errcode +', '+ idata.errmsg);
    return;
  }
  
  // 创建平台用户
  var ps = "wxun:"+ tdata.unionid;
  idata.user    = openid;
  idata.ps      = sys.md5(ps);
  idata.orgid   = orgid;
  idata.orgtype = getOrgType();
  idata.isplat  = se.isPlatformOrg(orgid);
  createUser(idata);
  
  info = idata;
} else {
  info = user.getInfo();
}

var failmsg = sys.login(info.user, info.ps);

if (failmsg) {
  sys.setRetData(4, failmsg);
} else {
  sys.put("orgtype",   info.orgtype);
  sys.put("orgid",     info.orgid);
  sys.put('userid',    info.user);
  sys.put('isplatorg', info.isplat);
  sys.setRetData(0, 'ok');
}


function getOrgType() {
  sql.query('SELECT org_type FROM sys_tenant Where orgid=?', [orgid]);
  return sys.result.result[0].org_type;
}


function createUser(idata) {
  try {
    // 用户
    var pid = sys.uuid();
    var sqlIns = `insert into sys_userinfo(
        pid, userid, password, createdt, updatedt, password_dt,
        multiflag, status, image_path, nickname
      ) values(?,?,?,?,?,?, '0','1',?, ?)`;
    var rd = sys.currentTimeString();
    var passwd = sys.encodePlatformPassword(idata.user, rd, idata.ps);
    var paramIns = [pid, idata.user, passwd, rd, rd, rd, idata.headimgurl, idata.nickname];
    sql.update(sqlIns, paramIns, '1');
    
    // 机构
    var sqlAddUserOrg="insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values (?, '1', '0' , ?,?,?)";
    var org_parm = [orgid, rd, rd, pid];
    sql.update(sqlAddUserOrg, org_parm, "1");
    
    // 角色/权限
    lib.roles().forEach(function(rid) {
      var s = "insert into "+ orgid +".sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
      sql.update(s, [pid, rid, "1", rd, rd], "1");
    });
    
    // 用户资料
    var uis = `Insert Into mdm_personal_info 
      (pid, de0201039, status, createdt, updatedt, 
       de0201040, de020100905x, former_name) 
      values (?, ?, '1', ?, ?, ?, ?, ?)`;
    var addr = [idata.country, idata.province, idata.city].join(',');
    sql.update(uis, [pid, idata.nickname, rd, rd, idata.sex, addr, 'wx:'+ openid], "1");
    
    // 项目组
    var ugid = lib.projectGroupid();
    if (ugid) {
      var s = "Insert into "+ orgid +".sys_ug_user(ugid, pid, status, createdt, updatedt) Values (?,?,'1',?,?)";
      sql.update(s, [ugid, pid, rd, rd], "1");
    }
    
    // to mongodb
    idata.pid = pid;
    idata.ugid = ugid;
    lib.saveUser(openid, tdata, idata);
    sql.commit();
  } catch(e) {
    sql.rollback();
    throw e;
  }
}