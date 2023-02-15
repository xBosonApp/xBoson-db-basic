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
  //获取个人信息一览
  //http://192.168.7.120:8088/ds/api/getpersonallist?app=mdm&mod=personalinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=4D9B903E44D59731115B753385111C8DFE0D5ED45808A0B6189583762793D778&s=d&mdk=67e05361d9194e8695c4ad2e89a7c14a&userkeylocal=0bd5fd7b742146ccabcf8089fbc95139&pagesize=10&pagenum=1
  var pid = sys.request.pid;
  var de0201039 = sys.request.de0201039;
  var de0201040 = sys.request.de0201040;
  var de0201018 = sys.request.de0201018;
  var de0201052 = sys.request.de0201052;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  var orgid = sys.request.orgid;
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值
  var sql_Sel = "select a.pid,a.de0201039,a.de0201040,a.de0201005,a.de0201015,a.de0201025,a.de0201018,a.de0201030,a.de0201010,"+
                "a.de0201012,a.de020100901h,a.de020100902h,a.de020100903h,a.de020100904h,a.de020100905h,a.de020100906h,"+
                "a.de0201047h,a.de020100901x,a.de020100902x,a.de020100903x,a.de020100904x,a.de020100905x,a.de020100906x,"+
                "a.de0201047x,a.de0810007,a.de0201001,a.de0201052,a.de0201041,a.de0210042,a.contact_pid,a.former_name,"+
                "a.status,a.create_orgid,a.create_pid,a.createdt,a.update_orgid,a.update_pid,a.updatedt "+
                "from mdm_personal_info a ";
  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  var sqlWhere=" where 1=1 ";
  var paramSel = [];
  if (pid != null) {
    sqlWhere = sqlWhere + " and a.pid like ? ";
    @paramSel.add("%"+pid+"%");
  }
  //条件查询-本人姓名
  if(de0201039 != null){
    sqlWhere = sqlWhere + " and a.de0201039 like ? ";
    @paramSel.add("%"+de0201039+"%");
  }
  //条件查询-性别
  if(de0201040 != null){
    sqlWhere = sqlWhere + " and a.de0201040 = ? ";
    @paramSel.add(de0201040);
  }
  //条件查询-婚姻状况
  if(de0201018 != null){
    sqlWhere = sqlWhere + " and a.de0201018 = ? ";
    @paramSel.add(de0201018);
  }
  //条件查询-职业类别
  if(de0201052 != null){
    sqlWhere = sqlWhere + " and a.de0201052 = ? ";
    @paramSel.add(de0201052);
  }
   if (status != null) {
    sqlWhere = sqlWhere + " and a.status = ? ";
    @paramSel.add(status);
  }
  var sel=sql_Sel+sqlWhere;
  sql.queryPaging(sel,paramSel,pagenum,pagesize,"result");
  sys.setRetData("0", "", "result");