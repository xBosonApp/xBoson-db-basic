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
var org = sys.request.org;                      // 机构ID

var params = [org];
var sql = "select rlsapp.applicationid id, rlsapp.applicationnm name, org.de0810013j provider from sys_pl_org_application orgapp, sys_pl_application_release rlsapp,mdm_org org where orgapp.applicationid=rlsapp.applicationid and orgapp.orgid=? and orgapp.orgid=org.orgid and org.status='1' and orgapp.status='1' and rlsapp.status='1'";
sql.query(sql, params, "result");
sys.setRetData("0", "", "result");