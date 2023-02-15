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
var orgid= sys.request.orgid;
var applicationnm= sys.request.applicationnm;
var biz_status= sys.request.biz_status;
var status= sys.request.status;
var param = [];
var orgnm= sys.request.orgnm; 
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值

var sqls ="select a.applicationid,b.applicationnm,b.orgid,c.de0810013j  orgnm,a.biz_status,a.status ,a.createdt,a.updatedt from sys_pl_biz_application a left join sys_pl_application_release b on a.applicationid=b.applicationid left join mdm_org c on b.orgid=c.orgid where 1=1";

if(null!=status)
{
    sqls = sqls+" AND a.status=?";
    list.add(param,status);
}

if(null!=biz_status)
{
    sqls = sqls+" AND a.biz_status=?";
    list.add(param,biz_status);
}
if(null!=orgnm)
{
    sqls = sqls+" AND c.de0810013j like '%"+orgnm+"%'";
}
if(null!=applicationnm)
{
    sqls = sqls+" AND b.applicationnm like ?";
    list.add(param,applicationnm);
}

if (pagenum == null) {
  pagenum = pNDefualt;
}
if (pagesize == null) {
  pagesize = PSDefualt;
}

sql.queryPaging(sqls,param,pagenum,pagesize,"result");
sys.setRetData("0","","result");