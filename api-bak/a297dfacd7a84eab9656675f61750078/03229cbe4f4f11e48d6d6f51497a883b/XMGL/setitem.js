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
//setitem
//修改项目信息
 
var roleid=sys.request.roleid;
var rolenm=sys.request.rolenm;
var role_desc = sys.request.role_desc;
var status=sys.request.status;

//判断不为空
if (roleid == null) {
    sys.setRetData("1");
    return;
}
var sql1 ="update sys_role set rolenm = ?,role_desc = ?,updatedt = ?,status=? where roleid =?";
var paramSel=[rolenm,role_desc,sys.currentTimeString(),status,roleid];
var updCount = sql.update(sql1,paramSel); 

if (updCount == 0) {
  sys.setRetData("5");
  return;
  }
sys.setRetData("0");