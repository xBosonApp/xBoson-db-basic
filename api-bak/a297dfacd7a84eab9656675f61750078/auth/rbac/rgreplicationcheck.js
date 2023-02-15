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
//rgreplicationcheck 角色组名称重复验证
var rg_nm=sys.request.rg_nm;
var op_type=sys.request.op_type;
var rg_id=sys.request.rg_id;
if(rg_nm==null){
  sys.setRetData("1","角色组名称未指定");
  return;
}
if (op_type==null) {
  sys.setRetData("1","操作类型未指定");
  return;
}
if (op_type!="i" && op_type!="u") {
  sys.setRetData("2","错误的操作类型");
  return;
}
if (op_type=="i") {
  sql.query("select rg_nm from sys_role_group where rg_nm=?",[rg_nm]);
} else if (op_type=="u") {
  if (rg_id==null) {
    sys.setRetData("1","角色组ID未指定");
    return;
  }
  sql.query("select rg_nm from sys_role_group where rg_id<>? and rg_nm=?",[rg_id,rg_nm]);
}

var ret = sys.result["result"];
if (sys.size(ret) > 0) {
    sys.setRetData("8","角色组名称 "+rg_nm+" 已存在");//数据已存在
} else {
    sys.setRetData("11","角色组名称 "+rg_nm+" 不存在");//数据不存在
}