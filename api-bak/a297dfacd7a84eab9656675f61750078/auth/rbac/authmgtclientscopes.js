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
// authmgtclientscopes 角色分配-客户端Scope列表
var client_id=sys.request.client_id;
if (client_id==null) {
  sys.setRetData("1", "客户端未指定");
  return;
}
sql.query("select s.scope,s.scopenm,r.roleid,r.rolenm from sys_pl_client_scope s,sys_role r,sys_role_client rc where s.client_id=? and s.client_id=rc.client_id and rc.scope=s.scope and rc.roleid=r.roleid and s.status='1' and r.status='1' and rc.status='1'",[client_id]);
sys.setRetData("0",null,"result");