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
var orgid=sys.request.orgid;
var status = sys.request.status;
var param=[orgid];
var pageNum=sys.request.pagenum;
var pageSize=sys.request.pagesize;
var sql1="select applicationid,applicationnm,application_desc,image_path,p_applicationid,orgid,status,createdt,updatedt from sys_pl_application_release where orgid=?";
 if(status !=null){
     sql1=sql1+"and status = ?";
     @param.add(status);
 }
sql1=sql1+" order by createdt desc";
if (pageNum == null) {
  pageNum = 1;
}
if (pageSize == null) {
  pageSize = 10;
}

var queryPagingCount = sql.queryPaging(sql1, param, pageNum, pageSize);
sys.setRetData("0", "", "result");