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
// prjugusers 获取项目组成员
var ugid=sys.request.ugid;
if(ugid==null){
  sys.setRetData("1", "用户组ID为空");
  return;
}
var strSql="select p.de0201039,i.userid from sys_ug ug,sys_ug_user uguser,mdm_personal_info p,sys_userinfo i where ug.ugid=? and ug.ugid=uguser.ugid and uguser.pid=p.pid and uguser.pid=i.pid and uguser.status='1' and ug.status='1' and p.status='1' and i.status='1'";
sql.query(strSql,[ugid],"result");
sys.setRetData("0","","result");