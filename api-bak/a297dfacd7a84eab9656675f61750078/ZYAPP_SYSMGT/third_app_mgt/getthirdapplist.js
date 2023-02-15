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
//id:getthirdapplist
//name:获取第三方应用一览
//编写人：王莹莹
//测试url：

var tp_appid=sys.request.tp_appid;
var tp_appnm=sys.request.tp_appnm;
var status = sys.request.status;
var orgid = sys.request.orgid;
var org = sys.request.org;
var userid = sys.request.userid;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值

  //查询 sys_pl_tp_app 表
   var sqlSel;
   var sqlWhere=" where 1=1 ";
   var paramSel = [];
    if(se.isPlatformOrg())
    {
 sqlSel ="SELECT a.tp_appid,a.tp_appnm,a.uri,a.orgid,o.de0810013j as orgnm,a.mark,"+
"a.status,a.createdt,a.updatedt, "+
"(select count(u.tp_appid) from sys_pl_tp_app_uid u where u.tp_appid=a.tp_appid)as number"+ " from sys_pl_tp_app a left join mdm_org o on a.orgid = o.orgid and  o.status = '1'";
            
 if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
 
   if (tp_appid != null) {
      sqlWhere = sqlWhere + " AND a.tp_appid = ? ";
      @paramSel.add(tp_appid);
   }
   if (orgid != null) {
      sqlWhere = sqlWhere + " AND a.orgid = ? ";
      @paramSel.add(orgid);
   }
    if (tp_appnm != null) {
      sqlWhere = sqlWhere + " AND a.tp_appnm like ? ";
      @paramSel.add("%"+tp_appnm+"%");
   }
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
 
  }
    else
  {
sqlSel ="SELECT a.tp_appid,a.tp_appnm,a.uri,a.orgid,a.mark,o.de0810013j as orgnm "+
",a.status,a.createdt,a.updatedt, "+
"(select count(u.tp_appid) from sys_pl_tp_app_uid u where u.tp_appid=a.tp_appid) as number"+ " from sys_pl_tp_app a left join mdm_org o on a.orgid = o.orgid and  o.status = '1'";
 sqlWhere = sqlWhere + " AND a.orgid = ?";
  @paramSel.add(org);
  if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
 
   if (tp_appid != null) {
      sqlWhere = sqlWhere + " AND a.tp_appid = ? ";
      @paramSel.add(tp_appid);
   }
//if (orgid != null) {
//      sqlWhere = sqlWhere + " AND a.orgid = ? ";
//      @paramSel.add(orgid);
//   }
    if (tp_appnm != null) {
      sqlWhere = sqlWhere + " AND a.tp_appnm like ? ";
      @paramSel.add("%"+tp_appnm+"%");
   }
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
    }
    
    sqlSel = sqlSel + sqlWhere;
    var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
    sys.setRetData("0","","result");