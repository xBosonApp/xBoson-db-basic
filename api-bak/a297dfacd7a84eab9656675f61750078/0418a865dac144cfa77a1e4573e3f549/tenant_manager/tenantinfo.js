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
var org_type=sys.request.org_type;
var orgid=sys.request.orgid;
var status = sys.request.status;
var param=[];
var pageNum=sys.request.pagenum;
var pageSize=sys.request.pagesize;
var sql1="select a.orgid,a.init_db,a.org_type,b.de0810013j,b.de0810011,b.de0810052,b.de0810022,b.de0201039f_pid,b.de0201039f,b.de0810081,b.de0810024,b.de0810027,b.de0810028,b.de0810016,b.reg_org,b.reg_cd,b.de0810082,b.de020100905,b.de020100906,b.de020100901,b.de020100902,b.de020100903,b.de020100904,b.de0201038,b.de0201047,b.de0201010,b.de0201008,b.de0201012,b.de0201054,b.de0201046,b.de0810009,b.de0810029,b.de0810010,b.de0810046,b.higher_orgid,b.nationality_cd,b.de0201039t,b.de0810013t,b.de0201039tx,b.de0900053,b.de0810001,b.de0810005,b.de0810006,b.de0810008,b.de0810030,b.de0810031,b.de0810032,b.de0810041,b.de0810044,b.de0810050,b.de0810051,b.de0810043,a.status,b.create_orgid,b.create_pid,b.createdt,b.update_orgid,b.update_pid,b.updatedt,b.category,d.userid from sys_tenant a , mdm_org b left join sys_tenant_user c on b.orgid=c.orgid left join sys_userinfo d on c.pid=d.pid where a.orgid=b.orgid and (c.admin_flag='1' or c.admin_flag='3' or c.admin_flag='5' or c.admin_flag is null) ";
  if(orgid !=null){
     sql1=sql1+"and a.orgid = ?";
     @param.add(orgid);
 }
 
 if(org_type !=null){
     sql1=sql1+"and a.org_type = ?";
     @param.add(org_type);
 }
 if(status !=null){
     sql1=sql1+" and a.status = ?";
     @param.add(status);
 }
sql1=sql1+" order by a.createdt desc";
if (pageNum == null) {
  pageNum = 1;
}
if (pageSize == null) {
  pageSize = 10;
}

var queryPagingCount = sql.queryPaging(sql1, param, pageNum, pageSize);

for(r in sys.result.result){
 if(r.de0810009 != ""){
    var a=sys.formattedTime(sys.parseDate(r.de0810009,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
    map.put(r,"de0810009",a);
 }
}

sys.setRetData("0", "", "result");