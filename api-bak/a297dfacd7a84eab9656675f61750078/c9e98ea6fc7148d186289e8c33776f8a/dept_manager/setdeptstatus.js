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
//liufengyuan

var deptid = sys.request.deptid;
var status = sys.request.status;
var orgid = sys.request.org;

//sql语句
if (deptid == null || status == null) {
    sys.setRetData("1");
    return;
}
var sqlUpdStatus = "update mdm_dept SET status = ? where deptid = ? and orgid=?";
var paramStatus = [status,deptid,orgid];
if (sql.update(sqlUpdStatus,paramStatus) > 0) {
    sys.setRetData("0");
    return;
}

sys.setRetData("5","更新部门状态失败！");