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
// rolemaint 角色维护-添加，修改，删除，停用
var op_type=sys.request.op_type;
if (op_type==null) {
  sys.setRetData("1","操作类型未指定");
  return;
}
// 添加/修改/删除/停用或激活
if (op_type!="i" && op_type!="u" && op_type!="d" && op_type!="a" && op_type!="c") {
  sys.setRetData("2","错误的操作类型");
  return;
}

var roleid=sys.request.roleid;
var rolenm=sys.request.rolenm;
var role_desc=sys.request.role_desc;
var rg_id=sys.request.rg_id;
var orgid=sys.request.org;
var status=sys.request.status;

if (op_type=="u" || op_type=="d" || op_type=="a" || op_type=="c") {
  if(roleid==null){
    sys.setRetData("1","角色ID未指定");
    return;
  }
}
if (op_type=="i" || op_type=="u" || op_type=="c") {
  if(rolenm==null){
    sys.setRetData("1","角色名称未指定");
    return;
  }
}

// 角色名称重复验证
if (op_type=="i" || op_type=="u" || op_type=="c") {
  var responseInfo = http.platformGet({app:"auth",mod:"rbac",api:"rolenmreplicationcheck"},{op_type:op_type,roleid:roleid,rolenm:rolenm});
  // 新增角色名称已经存在 或 更新角色名称已被其他角色ID占用
  if (responseInfo.data.ret!="11"){
    sys.setRetData(responseInfo.data.ret, responseInfo.data.msg);
    return;
  }
}

var dt = date.currentTimeString();

if (op_type=="i") {
  roleid=sys.uuid();
  var role_type="01";//固定为普通角色
  sql.update("insert into sys_role (roleid,rolenm,role_type,role_desc,orgid,rg_id,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)",[roleid,rolenm,role_type,role_desc,orgid,rg_id,"1",dt,dt]);
} else if (op_type=="u") {
  sql.update("update sys_role set rolenm=?,role_desc=?,rg_id=?,updatedt=? where roleid=?",[rolenm,role_desc,rg_id,dt,roleid]);
} else if (op_type=="c") {
  var copyFromRoleId=roleid;
  roleid=sys.uuid();
  var role_type="01";//固定为普通角色
  sql.update("insert into sys_role (roleid,rolenm,role_type,role_desc,orgid,rg_id,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)",[roleid,rolenm,role_type,role_desc,orgid,rg_id,"1",dt,dt],"1");
  // 资源关联表 sys_role_api sys_role_model sys_role_menu sys_role_page sys_role_pe
  sql.update("insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) select '"+roleid+"' roleid,appid,moduleid,apiid,status,'"+dt+"' createdt,'"+dt+"' updatedt from sys_role_api where roleid=? and status='1'",[copyFromRoleId],"1");
  sql.update("insert into sys_role_model (roleid,typecd,status,createdt,updatedt) select '"+roleid+"' roleid,typecd,status,'"+dt+"' createdt,'"+dt+"' updatedt from sys_role_model where roleid=? and status='1'",[copyFromRoleId],"1");
  sql.update("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) select '"+roleid+"' roleid,menuid,status,'"+dt+"' createdt,'"+dt+"' updatedt from sys_role_menu where roleid=? and status='1'",[copyFromRoleId],"1");
  sql.update("insert into sys_role_page (roleid,pageid,status,createdt,updatedt) select '"+roleid+"' roleid,pageid,status,'"+dt+"' createdt,'"+dt+"' updatedt from sys_role_page where roleid=? and status='1'",[copyFromRoleId],"1");
  sql.update("insert into sys_role_pe (roleid,pageid,elementid,element_status,status,createdt,updatedt) select '"+roleid+"' roleid,pageid,elementid,element_status,status,'"+dt+"' createdt,'"+dt+"' updatedt from sys_role_pe where roleid=? and status='1'",[copyFromRoleId],"1");
  sql.commit();
} else if(op_type=="d") {
  sql.query("select ugid from sys_role_ug where roleid=?",[roleid],"reloadug");
  var reloadugList = [];
  for (row in sys.result["reloadug"]) {
    list.add(reloadugList, row["ugid"]);
  }
  sql.query("select pid from sys_user_role where roleid=?",[roleid],"reloadu");
  var pidList = [];
  for (row in sys.result["reloadu"]) {
    list.add(pidList, row["pid"]);
  }
  var userMap = sys.getUserIdByPID(pidList);
  var reloaduList = [];
  for (entry in userMap) {
    //list.add(reloaduList, entry.value);
    list.add(reloaduList, entry);
  }
  sql.query("select client_id from sys_role_client where roleid=?",[roleid],"reloadclient");
  var reloadClientList = [];
  for (row in sys.result["reloadclient"]) {
    list.add(reloadClientList, row["client_id"]);
  }

  sql.update("delete from sys_role where roleid=?",[roleid],"1");
  // 分配表 sys_role_ug sys_user_role sys_role_client
  sql.update("delete from sys_role_ug where roleid=?",[roleid],"1");
  sql.update("delete from sys_user_role where roleid=?",[roleid],"1");
  sql.update("delete from sys_role_client where roleid=?",[roleid],"1");
  // 资源关联表 sys_role_api sys_role_model sys_role_menu sys_role_page sys_role_pe
  sql.update("delete from sys_role_api where roleid=?",[roleid],"1");
  sql.update("delete from sys_role_model where roleid=?",[roleid],"1");
  sql.update("delete from sys_role_menu where roleid=?",[roleid],"1");
  sql.update("delete from sys_role_page where roleid=?",[roleid],"1");
  sql.update("delete from sys_role_pe where roleid=?",[roleid],"1");
  sql.commit();
  // 更新角色缓存
  http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"00"});
  se.reloadUserGroupRole(reloadugList);
  se.reloadUserRole(reloaduList);
  se.reloadClientRole(reloadClientList);
} else if(op_type=="a"){
  if (status=="1"){
    status="0";
  } else {
    status="1"; 
  }
  sql.update("update sys_role set status=?,updatedt=? where roleid=?",[status,dt,roleid]);
  // 更新角色缓存
  http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"00"});
}

sys.addRetData(roleid, "roleid");
sys.setRetData("0",null,"roleid");