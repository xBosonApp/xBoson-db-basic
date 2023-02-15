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
//陈棋
  //获取机构信息一览
  //http://192.168.7.120:8088/ds/api/getorglist?app=mdm&mod=orginfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=B8AF0D4A3A0F8FAA947169B79EDB6924F394F18008D033CA8687B3D624E62D5A&s=d&userkeylocal=1a6adf01f4b14af4a783acdabd67f129
  var orgId = sys.request.orgid;
  var orgNm = sys.request.orgnm;
  var category = sys.request.category;
  var higher_OrgId = sys.request.higher_orgid;
  var de0201039f = sys.request.de0201039f;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值
  var sql_Sel = "select a.orgid,a.de0810013j,a.de0810011,a.de0810052,a.de0810022,a.de0201039f_pid,a.de0201039f,a.de0810081,a.de0810024,"+
                "a.de0810027,a.de0810028,a.de0810016,a.reg_org,a.reg_cd,a.de0810082,a.de020100905,a.de020100906,a.de020100901,a.de020100902,"+
                "a.de020100903,a.de020100904,a.de0201038,a.de0201047,a.de0201010,a.de0201008,a.de0201012,a.de0201054,a.de0201046,"+
                "a.de0810009,a.de0810029,a.de0810010,a.de0810046,(select de0810013j from mdm_org where orgid=a.higher_orgid) higher_orgid,a.nationality_cd,a.de0201039t,a.de0810013t,"+
                "a.de0201039tx,a.de0900053,a.de0810001,a.de0810005,a.de0810006,a.de0810008,a.de0810030,a.de0810031,a.de0810032,a.de0810041,"+
                "a.de0810044,a.de0810050,a.de0810051,a.de0810043,a.status,a.create_orgid,a.create_pid,a.createdt,a.update_orgid,a.update_pid,"+
                "a.updatedt,a.category from mdm_org a ";
  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  var sqlWhere=" where 1=1 ";
  var paramSel = [];
  if (orgId != null) {
    sqlWhere = sqlWhere + " and a.orgid like ? ";
    @paramSel.add("%"+orgId+"%");
  }
  if (orgNm != null) {
    sqlWhere = sqlWhere + " and a.de0810013j like ? ";
    @paramSel.add("%"+orgNm+"%");
  }
  if(category != null){
    sqlWhere = sqlWhere + " and a.category = ? ";
    @paramSel.add(category);
  }
  if(higher_OrgId != null){
    sqlWhere = sqlWhere + " and a.higher_orgid like ? ";
    @paramSel.add("%"+higher_OrgId+"%");
  }
  if(de0201039f != null){
    sqlWhere = sqlWhere + " and a.de0201039f = ? ";
    @paramSel.add(de0201039f);
  }
  if (status != null) {
    sqlWhere = sqlWhere + " and a.status = ? ";
    @paramSel.add(status);
  }
  var selAll = sql_Sel+sqlWhere;
  sql.queryPaging(selAll,paramSel,pagenum,pagesize,"result");
  sys.setRetData("0", "", "result");