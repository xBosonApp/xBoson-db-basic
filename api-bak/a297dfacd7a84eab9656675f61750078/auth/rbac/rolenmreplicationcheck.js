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
//rolenmreplicationcheck 角色名称重复验证
var rolenm=sys.request.rolenm;
var op_type=sys.request.op_type;
var roleid=sys.request.roleid;
if(rolenm==null){
  sys.setRetData("1","角色名称未指定");
  return;
}
if (op_type==null) {
  sys.setRetData("1","操作类型未指定");
  return;
}
if (op_type!="i" && op_type!="u" && op_type!="c") {
  sys.setRetData("2","错误的操作类型");
  return;
}
if (op_type=="i" || op_type=="c") {
  sql.query("select rolenm from sys_role where rolenm=?",[rolenm]);
} else if (op_type=="u") {
  if (roleid==null) {
    sys.setRetData("1","角色ID未指定");
    return;
  }
  sql.query("select rolenm from sys_role where roleid<>? and rolenm=?",[roleid,rolenm]);
}

var ret = sys.result["result"];
if (sys.size(ret) > 0) {
    sys.setRetData("8","角色名称 "+rolenm+" 已存在");//数据已存在
} else {
    sys.setRetData("11","角色名称 "+rolenm+" 不存在");//数据不存在
}