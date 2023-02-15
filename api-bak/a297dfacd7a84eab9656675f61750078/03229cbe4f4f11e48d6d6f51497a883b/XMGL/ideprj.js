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
//ideprj 获取IDE项目列表
// 当前登录用户所在用户组与项目的开发用户组匹配，即可列出该用户所在的所有项目
// 此处未区分该用户是否是项目管理者
// 业务上开发用户组只有一个角色而且是开发角色
var strSql = "select prj.prjid,prj.prjnm,prj.mark,role.roleid from sys_prj prj,sys_ug_user uguser,sys_ug ug,sys_role_ug ugrole,sys_role role where uguser.pid=? and uguser.ugid=prj.ugid and uguser.ugid=ug.ugid and uguser.ugid=ugrole.ugid and ugrole.roleid=role.roleid and role.role_type='02' and prj.status='1' and ug.status='1' and uguser.status='1' and ugrole.status='1' and role.status='1' ORDER by prj.createdt asc";
sql.query(strSql,[sys.getUserPID()],"result");
sys.setRetData("0","","result");