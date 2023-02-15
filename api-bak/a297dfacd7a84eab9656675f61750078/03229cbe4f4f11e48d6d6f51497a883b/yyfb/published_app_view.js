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
var status = sys.request.status;
var appnm = sys.request.appnm;
var orgid = sys.request.org;
var param = [];

var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值
  
var sqls = "select a.applicationid,(SELECT applicationnm FROM sys_pl_application_release WHERE applicationid = a.applicationid) applicationnm,(SELECT count(y.apiid) FROM sys_pl_role_release z,sys_pl_role_api_release y WHERE z.roleid = y.roleid AND z.status = '1' AND y.status = '1' AND a.applicationid = z.applicationid) apinum ,(SELECT count(f.apiid) FROM   sys_pl_pub_api_release f WHERE a.applicationid = f.applicationid)  apinum2,(SELECT e.p_applicationid FROM sys_pl_application_release e WHERE e.applicationid = a.applicationid) p_applicationid,(SELECT biz_status FROM sys_pl_biz_application WHERE applicationid = a.applicationid) biz_status,(SELECT count(orgid) FROM sys_pl_org_application WHERE applicationid = a.applicationid )orgnum,(SELECT createdt FROM sys_pl_application_release WHERE applicationid = a.applicationid) createdt from sys_pl_application_release a  where 1=1 ";

if(null!=orgid){
    sqls=sqls+" and a.orgid=?";
    list.add(param, orgid);
}
if(null!=status) {
    sqls= sqls+" AND a.status=? ";
    list.add(param, status);
}

if(null!=appnm) {
    sqls= sqls+" AND a.applicationnm like ? ";
    list.add(param, "%"+appnm+"%");
}
sqls=sqls+" group by a.applicationid";
if (pagenum == null) {
  pagenum = pNDefualt;
}
if (pagesize == null) {
  pagesize = PSDefualt;
}

sql.queryPaging(sqls,param,pagenum,pagesize,"result");
sys.setRetData("0","","result");