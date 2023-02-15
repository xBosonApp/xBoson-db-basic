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
// 用于管理员停用或激活当前机构用户，如果用户跨机构，对平台其它机构无影响
var pid = sys.request.pid;
var status = sys.request.status;
if (pid == null) {
  sys.setRetData("1", "用户未指定");
  return;
}
if (status == null) {
  sys.setRetData("1", "状态未指定");
  return;
}
if (status != "0" && status != "1") {
  sys.setRetData("2", "状态值只能为0（停用）或1（激活）");
  return;
}

var orgid = sys.request.org;//当前机构
var dt = date.currentTimeString();
sql.update("update sys_tenant_user set status=?,updatedt=? where pid=? and orgid=?", [status, dt, pid, orgid]);
if (status == "0") {
  sys.setRetData("0", "停用成功");
} else {
  sys.setRetData("0", "激活成功");
}