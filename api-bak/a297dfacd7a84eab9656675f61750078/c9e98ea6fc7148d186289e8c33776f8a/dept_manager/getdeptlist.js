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
  var deptnm = sys.request.deptnm;
  var orgid = sys.request.org;
  var status = sys.request.status;
  
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  
  var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值
  
  var sqls = "select a.deptid,a.deptcd,a.deptnm,(select de0810013j from mdm_org where orgid=a.orgid) orgid,a.orgid _orgid,a.de0201039_pid,a.de0201039,a.higher_deptid,a.dept_level,a.de020100905,a.de020100906,a.de020100901,a.de020100902,a.de020100903,a.de020100904,a.de0201038,a.de0201047,a.de0201010,a.de0201008,a.de0201012,a.de0201054,a.de0201046,a.de0810009,a.de0810010,a.de0810046,a.de0810001,a.de0810005,a.de0810006,a.de0810008,a.de0810030,a.de0810031,a.de0810032,a.de0810041,a.de0810044,a.de0810050,a.de0810051,a.status,a.create_orgid,a.create_pid,a.createdt,a.update_orgid,a.update_pid,a.updatedt from mdm_dept a where orgid=?"; 
  
  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  
  var paramSel = [orgid];

  //条件查询-部门名称
  if(deptnm != null){
    sqls = sqls + " and a.deptnm like ? ";
    @paramSel.add("%"+deptnm+"%");
  }

  if (status != null) {
    sqls = sqls + " and a.status = ? ";
    @paramSel.add(status);
  }
  
  sqls = sqls +" order by a.createdt desc";
  sql.queryPaging(sqls,paramSel,pagenum,pagesize,"result");
  sys.setRetData("0", "", "result");