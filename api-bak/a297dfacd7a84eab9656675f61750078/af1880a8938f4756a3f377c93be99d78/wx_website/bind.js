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
var state = sys.request.getString('state', 10, 999);
var force = sys.toBool(sys.request.force);
var lib   = require("./lib");
var uid   = sys.getUserIdByOpenId();

state = JSON.parse( lib.decode(state) );
if (state.uid != uid) {
  sys.setRetData(12, 'state 参数无效');
  return;
}

var orgid = state.org;
var ps = state.ps;
var tdata = cache.get('wx-code', code);

if (!tdata) {
  var tokenRet = http.get(lib.access_token_url(), 
      lib.access_token_parm(code), "json");
      
  if (tokenRet.code != 200) {
    sys.setRetData(1, "调用微信接口错误: http-"+ tokenRet.code);
    return;
  }
  
  tdata = tokenRet.data;
  if (tdata.errcode) {
    sys.setRetData(2, "调用微信接口错误: "+ tdata.errcode +', '+ tdata.errmsg);
    return;
  }
}

var pid = sys.getUserPID();
var openid = tdata.openid;
var user = lib.getUser(openid);

if (user != null) {
  if (user.getInfo().user == uid) {
    sys.setRetData(0, "无需重复绑定");
    return;
  }
  if (!force) {
    sys.setRetData(11, "已经绑定其他用户");
    cache.set('wx-code', code, tdata);
    return;
  }
}

cache.del('wx-code', code);
var infoRet = http.get(lib.user_info_url(), 
    lib.user_info_parm(tdata.access_token, openid), "json");
    
var idata = infoRet.data;
if (idata.errcode) {
  sys.setRetData(3, "获取用户信息错误: "+ idata.errcode +', '+ idata.errmsg);
  return;
}

idata.user    = uid;
idata.ps      = ps;
idata.orgid   = orgid;
idata.orgtype = getOrgType();
idata.isplat  = se.isPlatformOrg(orgid);
idata.pid     = pid;

if (user) {
  lib.updateUser(openid, tdata, idata);
} else {
  lib.saveUser(openid, tdata, idata);
}
sys.setRetData(0, 'ok');


function getOrgType() {
  sql.query('SELECT org_type FROM sys_tenant Where orgid=?', [orgid], 'ol');
  if (!sys.result.ol.length) {
    throw new Error("org not found:"+ orgid);
  }
  return sys.result.ol[0].org_type;
}