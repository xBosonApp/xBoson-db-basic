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
var orgtype=sys.request.org_type;
var orgnm=sys.request.org_nm;
var pageNum =sys.request.pagenum;
var pageSize = sys.request.pagesize;
var pNDefualt = 1;
var PSDefualt =10;
if (pageNum == null) {
pageNum = pNDefualt;
}
if (pageSize == null) {
pageSize = PSDefualt;
}

var sqls =" SELECT org_id,org_nm,org_type,updatedt,status FROM(SELECT aa.orgid org_id,bb.de0810013j org_nm,aa.org_type,aa.updatedt,aa.status FROM sys_tenant aa LEFT JOIN mdm_org bb ON aa.orgid=bb.orgid ) a where status='1' ";

if(null!=orgtype) sqls=sqls+" and org_type = '"+orgtype+"'";
if(null!=orgnm) sqls=sqls+" and org_nm like '%"+orgnm+"%'";

//var counts=sql.query(sqls,[],"result");
//sys.addRetData("count",counts);
//sys.setRetData("0","","result",count);
sql.queryPaging(sqls,[],pageNum,pageSize,"result");
sys.setRetData("0","","result");