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
// orgugmaint 用户组维护
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
var ugid=sys.request.ugid;
var ugnm=sys.request.ugnm;
if (op_type=="u" || op_type=="d") {
  if(ugid==null){
    sys.setRetData("1","用户组ID未指定");
    return;
  }
}
if (op_type=="i" || op_type=="u") {
  if(ugnm==null){
    sys.setRetData("1","用户组名称未指定");
    return;
  }
}

// 名称重复验证
if (op_type=="i") {
  sql.query("select 1 from sys_ug where ugnm=?",[ugnm],"ugnmcheck");
  if (sys.size(sys.result["ugnmcheck"]) > 0) {
    sys.setRetData("8","用户组名称 "+ugnm+" 已存在");//数据已存在
    return;
  }
} else if (op_type=="u") {
  sql.query("select 1 from sys_ug where ugid<>? and ugnm=?",[ugid,ugnm],"ugnmcheck");
  if (sys.size(sys.result["ugnmcheck"]) > 0) {
    sys.setRetData("8","用户组名称 "+ugnm+" 已存在");//数据已存在
    return;
  }
}

var dt = date.currentTimeString();

if (op_type=="i") {
  ugid=sys.uuid();
  sql.update("insert into sys_ug (ugid,ugnm,status,createdt,updatedt) values (?,?,?,?,?)",[ugid,ugnm,"1",dt,dt]);
  sys.addRetData(ugid);
  sys.setRetData("0", null, "result");
} else if (op_type=="u") {
  sql.update("update sys_ug set ugnm=?,updatedt=? where ugid=?",[ugnm,dt,ugid]);
  sys.addRetData(ugid);
  sys.setRetData("0", null, "result");
} else if(op_type=="d") {
  sql.query("select u.pid from sys_role_ug r,sys_ug_user u where r.ugid=? and r.ugid=u.ugid",[ugid],"pids");
  sql.update("delete from sys_ug where ugid=?",[ugid],"1");
  sql.update("delete from sys_role_ug where ugid=?",[ugid],"1");
  sql.update("delete from sys_ug_user where ugid=?",[ugid],"1");
  sql.commit();
  var pids = sys.result["pids"];
  if (sys.size(pids) > 0) {
    var pidList = [];
    for (row in pids) {
      list.add(pidList, row["pid"]);
    }
    var userIds = sys.getUserIdByPID(pidList);
    se.reloadUserRole(userIds);
  }
  sys.setRetData("0");
}