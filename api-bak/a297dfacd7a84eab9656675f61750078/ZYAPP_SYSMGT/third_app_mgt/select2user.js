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
//id:select2user
//name:查询平台用户ID
//编写人：王莹莹
//测试url：
var status = sys.request.status;
var orgid = sys.request.org;   
  //查询 sys_tenant_user 表
var paramSel = [orgid];
var sqlSel ="SELECT  u.userid as id,u.userid as name,u.userid as text from "+
"sys_tenant_user a left join sys_userinfo u"+
" on a.pid = u.pid and u.status = '1' where orgid = ?";
var queryPagingCount = sql.query(sqlSel,paramSel,"result");
sys.setRetData("0","","result");