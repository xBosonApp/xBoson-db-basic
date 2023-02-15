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
//id:deletepid
//name:移除项目下人员
var orgid = sys.request.org;
var roleid=sys.request.roleid;
var pid=sys.request.pid;
var openid=sys.request.openid;
var pidC=sys.getUserPID(openid);
//判断当前pid 和传过来的Pid是否为一个人
if (roleid == null||pid==null) {
  sys.setRetData("1");
  return;
}
if(pid==pidC){
 sys.setRetData("2");
 return; 
}
//不可删除管理员
var getManaPid = "select pid from link_vender.sys_tenant_user where orgid=? and admin_flag  in ('1','3','5')";
var count = sql.query(getManaPid,[orgid],"manapid");
if(count == 1){
  if(sys.result.manapid[0].pid==pid){
    sys.setRetData("2","管理员不可以被删除！");
    return;
  }
}
sql.update("delete from sys_user_role where roleid = ? and pid =?", [roleid,pid]);
//更新用户权限缓存
se.reloadUserInfo([sys.getUserIdByOpenId()]);
sys.setRetData("0");