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
var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  var orgid = sys.request.orgid;
  var org_type=sys.request.org_type;
  var status = sys.request.status;
    var dt = sys.getCurrentTimeString();//获取当前时间
var sql1="insert into sys_tenant (orgid,init_db,org_type,pid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
 var param1=[orgid,"0",org_type,pId,status,dt,dt];
  var insM_B_T =sql.update(sql1,param1);
 if (insM_B_T == 0) {
    sys.setRetData("5");
    return;
  }
  sys.setRetData("0");