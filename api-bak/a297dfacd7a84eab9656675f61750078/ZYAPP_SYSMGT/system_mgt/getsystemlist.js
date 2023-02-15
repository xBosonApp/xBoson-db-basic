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
//接口编写人：王莹莹
  //接口名称：获取系统信息一览 
  //接口URL：getsystemlist

  // HTTP 请求参数
  var sysid = sys.request.sysid;
  var sysnm = sys.request.sysnm;
  var inner_flag = sys.request.inner_flag;
  var status = sys.request.status;
  var orgid = sys.request.org;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值

  //查询 sys_server 表
   var sqlSel;
   var sqlWhere=" where 1=1 ";
   var paramSel = [];
if(se.isPlatformOrg())
{
    sqlSel ="SELECT a.sysid,a.sysnm,a.ip,a.port,a.uri,a.inner_flag,a.orgid,o.de0810013j as orgnm,a.sys_desc,a.status,a.createdt,a.updatedt,a.pid,u.userid from sys_system a left join mdm_org o on a.orgid = o.orgid and  o.status = '1' left join sys_userinfo u on u.pid=a.pid";
            
    if (pagenum == null) {
      pagenum = pNDefualt;
    }
    if (pagesize == null) {
      pagesize = PSDefualt;
    }
 
   if (sysid != null) {
      sqlWhere = sqlWhere + " AND a.sysid like ? ";
      @paramSel.add("%"+sysid+"%");
   }
   if (sysnm != null) {
      sqlWhere = sqlWhere + " AND a.sysnm like ? ";
      @paramSel.add("%"+sysnm+"%");
   }
    if (inner_flag != null) {
      sqlWhere = sqlWhere + " AND a.inner_flag = ?";
      @paramSel.add(inner_flag);
    }
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
 
}
else
{
    sqlSel ="SELECT a.sysid,a.sysnm,a.ip,a.port,a.uri,a.inner_flag,a.orgid,a.pid,o.de0810013j as orgnm,a.sys_desc,a.status,a.createdt,a.updatedt,u.userid from sys_system a left join mdm_org o on a.orgid = o.orgid and  o.status = '1' left join sys_userinfo u on u.pid=a.pid";
       sqlWhere = sqlWhere + " AND a.orgid = ?";
       @paramSel.add(orgid);
       if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
 
   if (sysid != null) {
      sqlWhere = sqlWhere + " AND a.sysid like ? ";
      @paramSel.add("%"+sysid+"%");
   }
   if (sysnm != null) {
      sqlWhere = sqlWhere + " AND a.sysnm like ? ";
      @paramSel.add("%"+sysnm+"%");
   }
    if (inner_flag != null) {
      sqlWhere = sqlWhere + " AND a.inner_flag = ?";
      @paramSel.add(inner_flag);
    }
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
            
    }
    
    sqlSel = sqlSel + sqlWhere;
    var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
    sys.setRetData("0","","result");