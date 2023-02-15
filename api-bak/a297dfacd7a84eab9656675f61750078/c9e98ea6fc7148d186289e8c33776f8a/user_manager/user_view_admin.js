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
var orgid = sys.request.org;
var usernm = sys.request.usernm;
var status = sys.request.status;

var openId = sys.request.openid;
var pid = sys.getUserPID(openId);

var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;

var orderby=sys.request.orderby;  //排序字段
var ascdesc=sys.request.ascdesc;  //升序降序

var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值
var params = [];
//判断数据库类型
var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
var sqls;
if(dbType == "01"){
    sqls = " SELECT a.orgid,a.pid,IFNULL(b.de0201039,'--') de0201039,c.userid,b.de0201010,b.de0201012,a.status,b.createdt,c.multiflag,c.last_dt,c.last_ip FROM sys_tenant_user a LEFT join mdm_personal_info b ON a.pid=b.pid LEFT JOIN sys_userinfo c ON a.pid=c.pid where a.admin_flag='0' and b.status='1'";
}else if(dbType == "02"){
    sqls = " SELECT a.orgid,a.pid,ISNULL(b.de0201039,'--') de0201039,c.userid,b.de0201010,b.de0201012,a.status,b.createdt,c.multiflag,c.last_dt,c.last_ip FROM sys_tenant_user a LEFT join mdm_personal_info b ON a.pid=b.pid LEFT JOIN sys_userinfo c ON a.pid=c.pid where a.admin_flag='0' and b.status='1'";
}else if(dbType == "03"){
    sqls = " SELECT a.orgid,a.pid,NVL(b.de0201039,'--') de0201039,c.userid,b.de0201010,b.de0201012,a.status,b.createdt,c.multiflag,c.last_dt,c.last_ip  FROM sys_tenant_user a LEFT join mdm_personal_info b ON a.pid=b.pid LEFT JOIN sys_userinfo c ON a.pid=c.pid where a.admin_flag='0' and b.status='1'";
}

if (status != null) {
    sqls = sqls + " and a.status = ? ";
    @params.add(status);
}

if (pagenum == null) {
  pagenum = pNDefualt;
}
if (pagesize == null) {
  pagesize = PSDefualt;
}

//条件查询-本人姓名
if(usernm != null){
    sqls = sqls + " and b.de0201039 like ? ";
    @params.add("%"+usernm+"%");
}
//排序
if(ascdesc==null){
  ascdesc="";
}
if(orderby==null){
  sqls=sqls+" order by de0201039";
}else if(orderby=="userid"){
  sqls=sqls+" order by a.orgid "+ascdesc;
}
else if(orderby=="userid"){
  sqls=sqls+" order by b.userid "+ascdesc;
}else if(orderby=="de0201010"){
  sqls=sqls+" order by b.de0201010 "+ascdesc;
}else if(orderby=="de0201012"){
  sqls=sqls+" order by b.de0201012 "+ascdesc;
}else if(orderby=="createdt"){
  sqls=sqls+" order by b.createdt "+ascdesc;
}else{
  sqls=sqls+" order by de0201039";
}

sql.queryPaging(sqls,params,pagenum,pagesize,"result");
sys.setRetData("0", "", "result");