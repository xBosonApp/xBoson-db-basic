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
//王莹莹
  //获取部门信息一览
  //http://192.168.7.120:8088/ds/api/getdeptlist?app=MDM&mod=deptinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=8BBA5A60F1401532DA446580F91D8408BAEA85AEECC8E36B7F536B59F6E1A4B9&s=d&mdk=bee7b095e9d3469ca2ed1f78e6721c6f&userkeylocal=77d69c8dd4ac468db299f31fe02ac5b4&deptnm=taylor
  //var deptid = sys.request.fuzzykey;
  var deptid = sys.request.deptid;
  var deptnm = sys.request.deptnm;
  var orgid = sys.request.orgid;
  var de0201039 = sys.request.de0201039;
  var higher_deptid = sys.request.higher_deptid;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  var org = sys.request.orgid;
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值
  var sql_Sel = "select a.deptid,a.deptcd,a.deptnm,(select de0810013j from mdm_org where orgid=a.orgid) orgid,a.orgid _orgid,a.de0201039_pid,a.de0201039,a.higher_deptid,a.dept_level,a.de020100905,"+
                "a.de020100906,a.de020100901,a.de020100902,a.de020100903,a.de020100904,a.de0201038,a.de0201047,a.de0201010,"+
                "a.de0201008,a.de0201012,a.de0201054,a.de0201046,a.de0810009,a.de0810010,a.de0810046,a.de0810001,a.de0810005,"+
                "a.de0810006,a.de0810008,a.de0810030,a.de0810031,a.de0810032,a.de0810041,a.de0810044,a.de0810050,a.de0810051,"+
                "a.status,a.create_orgid,a.create_pid,a.createdt,a.update_orgid,a.update_pid,a.updatedt "+
                "from mdm_dept a ";
  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  var sqlWhere=" where 1=1 ";
  var paramSel = [];
  if (deptid != null) {
    sqlWhere = sqlWhere + " and a.deptid like ?  ";
    @paramSel.add("%"+deptid+"%");
//    @paramSel.add("%"+deptid+"%");
  }
  //条件查询-部门名称
  if(deptnm != null){
    sqlWhere = sqlWhere + " and a.deptnm like ? ";
    @paramSel.add("%"+deptnm+"%");
  }
  //条件查询-主管机构ID
  if(orgid != null){
    sqlWhere = sqlWhere + " and a.orgid like ? ";
    @paramSel.add("%"+orgid+"%");
  }
  //条件查询-部门负责人PID
  if(de0201039 != null){
    sqlWhere = sqlWhere + " and a.de0201039 like ? ";
    @paramSel.add("%"+de0201039+"%");
  }
  //条件查询-上级部门ID
  if(higher_deptid != null){
    sqlWhere = sqlWhere + " and a.higher_deptid like ? ";
    @paramSel.add("%"+higher_deptid+"%");
  }
   if (status != null) {
    sqlWhere = sqlWhere + " and a.status = ? ";
    @paramSel.add(status);
  }
  var sel=sql_Sel+sqlWhere+" order by a.status desc,a.createdt desc";
  sql.queryPaging(sel,paramSel,pagenum,pagesize,"result");
  sys.setRetData("0", "", "result");