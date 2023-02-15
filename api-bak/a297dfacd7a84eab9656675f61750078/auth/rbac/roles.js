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
// roles 角色列表
var allstatus = Boolean(sys.request.allstatus);
var orgid = sys.request.org;

if (allstatus) {
  sql.query("select roleid,rolenm,role_desc,rg_id,status,op_type from sys_role where role_type='01' order by status desc,rolenm", null, "role");
} else {
  sql.query("select roleid,rolenm,role_desc,rg_id,op_type from sys_role where role_type='01' or op_type='1' and status='1' order by rolenm", null, "role");
}

sql.query("select rg_id,rg_nm from sys_role_group where status='1' order by rg_nm", null, "result");
var rg=sys.result.result;
var role=sys.result.role;

// 将没有分组的角色的分组ID设置为“0”
var haveRoleWithoutRg = false;
var haveDevGrp = false;
for (var i=0; i<role.length; i++) {
  var r = role[i];
  if (sys.isEmpty(r.rg_id)) {
    if (r.op_type == '1') {
      map.put(r, "rg_id", "-1");
      haveDevGrp = true;
    } else {
      map.put(r, "rg_id", "0");
      haveRoleWithoutRg = true;
    }
    
  }
}

if (haveRoleWithoutRg) 
  list.add(rg,{"rg_id":"0","rg_nm":"未分组"});
if (haveDevGrp)   
  list.add(rg,{"rg_id":"-1","rg_nm":"项目开发/测试 (自动授予项目的所有权限)"});

sys.setRetList(rg,role,[["rg_id","rg_id"]],"children");

//获取机构应用角色
var sqlRlsApp = `SELECT sys_pl_application_release.applicationid,
       sys_pl_application_release.applicationnm
FROM sys_pl_application_release,
     sys_pl_biz_application,
     sys_pl_org_application
WHERE sys_pl_application_release.applicationid=sys_pl_biz_application.applicationid
  AND sys_pl_biz_application.applicationid=sys_pl_org_application.applicationid
  AND sys_pl_biz_application.biz_status='20'
  AND sys_pl_org_application.orgid=?
  AND (sys_pl_org_application.expiration='00000000'
       OR sys_pl_org_application.expiration>=?)
  AND sys_pl_application_release.status='1'
  AND sys_pl_biz_application.status='1'
  AND sys_pl_org_application.status='1' `;

var currentDateString = date.formattedTime(date.currentDate(), "yyyyMMdd");
var param=[orgid,currentDateString];
sql.query(sqlRlsApp, param, "rlsapps");


var sqlRlsRole = `SELECT sys_pl_application_release.applicationid,
       sys_pl_role_release.roleid roleid,
       sys_pl_role_release.rolenm rolenm
FROM sys_pl_role_release,
     sys_pl_application_release,
     sys_pl_biz_application,
     sys_pl_org_application
WHERE sys_pl_role_release.applicationid=sys_pl_application_release.applicationid
  AND sys_pl_application_release.applicationid=sys_pl_biz_application.applicationid
  AND sys_pl_biz_application.applicationid=sys_pl_org_application.applicationid
  AND sys_pl_biz_application.biz_status='20'
  AND sys_pl_org_application.orgid=?
  AND (sys_pl_org_application.expiration='00000000'
       OR sys_pl_org_application.expiration>=?)
  AND sys_pl_role_release.status='1'
  AND sys_pl_application_release.status='1'
  AND sys_pl_biz_application.status='1'
  AND sys_pl_org_application.status='1' `;
  
sql.query(sqlRlsRole, param, "rlsapproles");
sys.setRetList(sys.result["rlsapps"],sys.result["rlsapproles"],[["applicationid","applicationid"]],"children");

for (row in sys.result["rlsapps"]) {
  map.remove(row,"applicationid");
  var applicationnm = row["applicationnm"];
  if (row["children"] != null) {
    for (cRow in row["children"]) {
      map.remove(cRow, "applicationid");
      map.put(cRow, "rolenm", applicationnm + "-" + cRow["rolenm"]);
    }
  }
}
sys.addRetData(sys.result["rlsapps"],"rlsroles");
sys.setRetData("0","","result","rlsroles");