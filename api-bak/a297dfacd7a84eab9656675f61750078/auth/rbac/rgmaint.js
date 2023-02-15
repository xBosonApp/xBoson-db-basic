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
// rgmaint 角色组维护
var op_type=sys.request.op_type;
if (op_type==null) {
  sys.setRetData("1","操作类型未指定");
  return;
}
// 添加/修改/删除/停用或激活
if (op_type!="i" && op_type!="u" && op_type!="d") {
  sys.setRetData("2","错误的操作类型");
  return;
}
var rg_id=sys.request.rg_id;
var rg_nm=sys.request.rg_nm;
if (op_type=="u" || op_type=="d") {
  if(rg_id==null){
    sys.setRetData("1","角色组ID未指定");
    return;
  }
}
if (op_type=="i" || op_type=="u") {
  if(rg_nm==null){
    sys.setRetData("1","角色组名称未指定");
    return;
  }
}

// 角色名称重复验证
if (op_type=="i" || op_type=="u") {
  var responseInfo = http.platformGet({app:"auth",mod:"rbac",api:"rgreplicationcheck"},{op_type:op_type,rg_id:rg_id,rg_nm:rg_nm});
  // 新增角色名称已经存在 或 更新角色名称已被其他角色ID占用
  if (responseInfo.data.ret!="11"){
    sys.setRetData(responseInfo.data.ret, responseInfo.data.msg);
    return;
  }
}

var dt = date.currentTimeString();

if (op_type=="i") {
  rg_id=sys.uuid();
  sql.update("insert into sys_role_group (rg_id,rg_nm,status,createdt,updatedt) values (?,?,?,?,?)",[rg_id,rg_nm,"1",dt,dt]);
  sys.addRetData(rg_id);
  sys.setRetData("0", null, "result");
} else if (op_type=="u") {
  sql.update("update sys_role_group set rg_nm=?,updatedt=? where rg_id=?",[rg_nm,dt,rg_id]);
  sys.addRetData(rg_id);
  sys.setRetData("0", null, "result");
} else if(op_type=="d") {
  sql.update("delete from sys_role_group where rg_id=?",[rg_id],"1");
  sql.update("update sys_role set rg_id=?,updatedt=? where rg_id=?",[null,dt,rg_id],"1");
  sql.commit();
  sys.setRetData("0");
}