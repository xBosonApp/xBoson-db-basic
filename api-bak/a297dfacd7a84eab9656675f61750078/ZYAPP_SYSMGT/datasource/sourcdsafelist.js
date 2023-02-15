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
//id:getdatasourcelis
//获取数据源应用一览

var did=sys.request.did;
var en=sys.request.en;
var cn=sys.request.cn;
var owner=sys.request.org;
//var fen=sys.request.fen;
/*var dbtype =sys.request.dbtype;
var user =sys.request.user;
var pass =sys.request.pass;*/
var status=sys.request.status;
var pagenum=sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;
var PSDefualt =10;

//查询 sys_pl_drm_ds001 表
var sqlSel;
var sqlWhere=" where 1=1 ";
var paramSel = [];

if(se.isPlatformOrg()) {
  sqlSel ="SELECT a.did,a.en,a.cn,a.owner,a.user_name,a.dbtype,a.mark "+
          " from sys_pl_drm_ds001 a ";
  if (pagenum == null) {
    pagenum = pNDefualt;
  }
  if (pagesize == null) {
    pagesize = PSDefualt;
  }

  if (did != null) {
    sqlWhere = sqlWhere + " AND a.did like ? ";
    //@paramSel.add("%"+did+"%");
    list.add(paramSel, "%"+did+"%");
  }
  if (en != null) {
    sqlWhere = sqlWhere + " AND (a.en like ? or a.cn like ?)";
    // @paramSel.add("%"+en+"%");
    // @paramSel.add("%"+en+"%");
    list.add(paramSel, "%"+en+"%");
    list.add(paramSel, "%"+en+"%");
  }
  if (status != null) {
    sqlWhere = sqlWhere + " AND a.status = ?";
    // @paramSel.add(status);
    list.add(paramSel, status);
  }
} else {
  sqlSel ="SELECT a.did,a.dn,a.flg,a.en,a.cn,a.owner,a.dbtype,a.mark "+
    " from sys_pl_drm_ds001 a "+
    "left join mdm_org o on a.owner = o.orgid and  o.status = '1' ";
  sqlWhere = sqlWhere + " AND a.owner = ?";
  // @paramSel.add(owner);
  list.add(paramSel, owner);

  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  if (did != null) {
    sqlWhere = sqlWhere + " AND a.did like ? ";
    // @paramSel.add("%"+did+"%");
    list.add(paramSel, "%"+did+"%");
  }
  if (en != null) {
    sqlWhere = sqlWhere + " AND (a.en like ? or a.cn like ?)";
    // @paramSel.add("%"+en+"%");
    // @paramSel.add("%"+en+"%");
    list.add(paramSel, "%"+en+"%");
    list.add(paramSel, "%"+en+"%");
  }
  if (status != null) {
    sqlWhere = sqlWhere + " AND a.status = ?";
    // @paramSel.add(status);
    list.add(paramSel, status);
  } 
}
  
sqlSel = sqlSel + sqlWhere + " Order by did";
var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
sys.setRetData("0","","result");