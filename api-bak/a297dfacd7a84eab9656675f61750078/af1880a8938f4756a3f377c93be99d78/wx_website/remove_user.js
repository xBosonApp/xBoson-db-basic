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

// 该方法将彻底删除微信注册用户相关的所有信息方便测试
var openid = sys.request.getString("wx-openid", 1, 99);
var lib = require('../lib');
var c = {};

try {
  var user = lib.getUser(openid);
  if (!user) {
    return sys.setRetData(1, "用户不存在");
  }
  
  var info = user.getInfo();
  var parm = [info.pid];
  
  c.org  = sql.update('delete from sys_tenant_user where pid=?', parm, '1');
  c.info = sql.update('delete from mdm_personal_info where pid=?', parm, '1');
  c.user = sql.update('delete from sys_userinfo where pid=?', parm, '1');
  c.role = sql.update('delete from '+ info.orgid +'.sys_user_role where pid=?', parm, '1');
  
  if (info.ugid) {
    c.prj = sql.update("Delete From "+ info.orgid +".sys_ug_user Where pid=?", parm, '1');
  }
  
  c.mg = lib.deleteUser(openid);
  
  sql.commit();
} catch(e) {
  sql.rollback();
  throw e;
}


sys.put("count", c);
sys.setRetData(0, 'ok');