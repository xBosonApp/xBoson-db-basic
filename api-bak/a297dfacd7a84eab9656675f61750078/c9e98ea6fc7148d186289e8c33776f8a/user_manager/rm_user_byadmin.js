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
var openid=sys.request.openid;
var orgid =sys.request.org;//当前管理员的机构

var pid=sys.request.pid;
var status=sys.request.status;

var adminflag= sys.getUserAdminFlag(openid,orgid);
var dt = sys.getCurrentTimeString();

if(null==pid||null==status) {
    sys.setRetData("1");
    return;
}

// if(null!=adminflag && "0"!=adminflag) {
  var count = sql.update("update sys_tenant_user set status=?,updatedt=? where pid=? and orgid=?",[status,dt,pid,orgid]);
  if(0<count) {
      sys.setRetData("0","注销");
      return;
  }
// }
//  sys.setRetData("1","用户权限不足！操作失败！");