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
//liufengyaun
var applicationnm = sys.request.applicationnm;
var applicationid = sys.request.applicationid;

var sqls2 = "select 1 from sys_pl_application_release where applicationnm=?";
var param = [applicationnm];
if(applicationid != null){
    sqls2=sqls2+" and applicationid != ?";
    param = [applicationnm,applicationid];
}

if (applicationnm != null && sql.query(sqls2, param) > 0) {
  // 应用名称重复
  sys.setRetData("2", "应用名称已存在！");
  return;
}
sys.setRetData("0");