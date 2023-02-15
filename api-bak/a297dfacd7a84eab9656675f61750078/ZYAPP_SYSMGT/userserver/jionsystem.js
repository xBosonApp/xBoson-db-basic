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
//jionsystem 获取当前pid和当前机构下的系统数据
// HTTP 请求参数
//var sysid = sys.request.sysid;
//var sysnm = sys.request.sysnm;
//var status = sys.request.status;
var orgid = sys.request.org;
//var openid=sys.request.openid;
//var pid=sys.getUserPID(openid);
//查询 sys_system 表
//var sql ="SELECT sysid,sysnm,ip,port,uri,inner_flag,orgid,pid,sys_desc,status,"+
//"createdt,updatedt from sys_system where pid = ? and orgid = ?";
//var param=[pid,orgid];
//20161130变更，查询不与当前用户绑定
sql.query("select sysid,sysnm,ip,port,uri,inner_flag,orgid,pid,sys_desc,status,createdt,updatedt from sys_system where orgid=?",[orgid],"result");
sys.setRetData("0",null,"result");