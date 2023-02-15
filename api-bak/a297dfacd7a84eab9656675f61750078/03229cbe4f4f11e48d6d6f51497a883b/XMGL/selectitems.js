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
//获取当前pid下的项目(角色)数据
//selectitems
// HTTP 请求参数
//   var role_type=sys.request.role_type;
  var openid=sys.request.openid;
  var pid=sys.getUserPID(openid);
  
  //查询 sys_role 表 和 sys_user_role
var sql ="SELECT r.roleid,r.rolenm,i.userid,r.comm_flag,r.op_type,r.role_type,"+
"r.role_desc,r.orgid,r.status,r.createdt,r.updatedt from sys_role r,sys_user_role u,"+
"sys_userinfo i where r.roleid = u.roleid and u.pid =i.pid  and u.pid = ? and "+
"role_type = '02' ";
  var param=[pid];
  sql.query(sql,param,"result");
  sys.setRetData("0","","result");