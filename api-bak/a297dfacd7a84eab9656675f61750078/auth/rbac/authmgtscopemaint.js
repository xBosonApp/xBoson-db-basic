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
// authmgtscopemaint 角色分配-客户端Scope维护
var op_type=sys.request.op_type;
var client_id=sys.request.client_id;
var scope=sys.request.scope;
var scopenm=sys.request.scopenm;
var roleid=sys.request.roleid;
var oldroleid=sys.request.oldroleid;
if (op_type==null || (op_type!="i" && op_type!="u" && op_type!="d")) {
  sys.setRetData("1", "操作类型未指定或不合法");
  return;
}
if (client_id==null || scope==null || roleid==null) {
  sys.setRetData("1");
  return;
}
if (op_type=="i" || op_type=="u") {
  if (scopenm==null) {
    sys.setRetData("1","Scope 名称未指定");
    return;
  }
}
if (op_type=="u") {
  if (oldroleid==null) {
    sys.setRetData("1","原角色未指定");
    return;
  }
}
var dt = date.currentTimeString();
if (op_type=="i") {
  // scope id和名称重复验证
  sql.query("select 1 from sys_pl_client_scope where scope=? or scopenm=?",[scope,scopenm],"check");
  if (!sys.isEmpty(sys.result["check"])) {
    sys.setRetData("8","Scope 或 Scope 名称已存在");//数据已存在
    return;
  }
  // role重复验证
  sql.query("select 1 from sys_role_client where roleid=? and client_id=?",[roleid,client_id],"checkrole");
  if (!sys.isEmpty(sys.result["checkrole"])) {
    sys.setRetData("8","其它 Scope 已经使用了该角色");//数据已存在
    return;
  }
  sql.update("insert into sys_pl_client_scope (client_id,scope,scopenm,status,createdt,updatedt) values (?,?,?,?,?,?)",[client_id,scope,scopenm,"1",dt,dt],"1");
  sql.update("insert into sys_role_client (roleid,client_id,scope,status,createdt,updatedt) values (?,?,?,?,?,?)",[roleid,client_id,scope,"1",dt,dt],"1");
  sql.commit();
  se.reloadClientRole([client_id]);
} else if (op_type=="u") {
  // scope 名称重复验证
  sql.query("select 1 from sys_pl_client_scope where scope<>? and scopenm=?",[scope,scopenm],"check");
  if (!sys.isEmpty(sys.result["check"])) {
    sys.setRetData("8","Scope 名称已存在");//数据已存在
    return;
  }

  if (oldroleid!=roleid) {
    // role重复验证
    sql.query("select 1 from sys_role_client where roleid=? and client_id=?",[roleid,client_id],"checkrole");
    if (!sys.isEmpty(sys.result["checkrole"])) {
      sys.setRetData("8","其它 Scope 已经使用了该角色");//数据已存在
      return;
    }
    sql.update("update sys_pl_client_scope set scopenm=?,updatedt=? where client_id=? and scope=?",[scopenm,dt,client_id,scope],"1");
    sql.update("delete from sys_role_client where roleid=? and client_id=?",[oldroleid,client_id],"1");
    sql.update("insert into sys_role_client (roleid,client_id,scope,status,createdt,updatedt) values (?,?,?,?,?,?)",[roleid,client_id,scope,"1",dt,dt],"1");
    sql.commit();
    se.reloadClientRole([client_id]);
  } else {
    sql.update("update sys_pl_client_scope set scopenm=?,updatedt=? where client_id=? and scope=?",[scopenm,dt,client_id,scope]);
  }
} else if (op_type=="d") {
  sql.update("delete from sys_pl_client_scope where client_id=? and scope=?",[client_id,scope],"1");
  sql.update("delete from sys_role_client where roleid=? and client_id=?",[roleid,client_id],"1");
  sql.commit();
  se.reloadClientRole([client_id]);
}

//if (!(op_type=="u" && oldroleid==roleid)) {
  // 更新第三方应用表的scope字段，认为所有scope均被授权
  var scopeTobeSet=null;
  sql.query("select scope from sys_pl_client_scope where client_id=? and status='1'",[client_id],"scopes");
  if (sys.size(sys.result["scopes"]) > 0) {
    scopeTobeSet = "";
    for (row in sys.result["scopes"]) {
      scopeTobeSet = scopeTobeSet + row["scope"] + " ";
    }
    scopeTobeSet = sys.trim(scopeTobeSet);
    sql.update("update sys_pl_tp_app set scope=?,updatedt=? where tp_appid=?",[scopeTobeSet,dt,client_id]);
  } else {
    sql.update("update sys_pl_tp_app set scope=null,updatedt=? where tp_appid=?",[dt,client_id]);
  }
  //更新缓存
  var _appinfo="select tp_appid,tp_appnm,app_secret,uri,scope,orgid,status from sys_pl_tp_app where tp_appid=?";
  sql.query(_appinfo,[client_id],"appinfoSet");
  var appinfoSet=sys.result.appinfoSet;
  if (sys.size(appinfoSet) > 0) {
    se.setCache(_CACHE_REGION_TP_APP_, client_id, appinfoSet[0], 0);
  }else{
    se.delCache(_CACHE_REGION_TP_APP_, client_id);
  }
//}
sys.setRetData("0");