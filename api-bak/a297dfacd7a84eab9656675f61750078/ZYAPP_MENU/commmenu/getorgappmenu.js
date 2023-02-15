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
//获取机构购买的app包含的菜单
//id:getorgappmenu

var org = sys.request.org;
var dt=sys.formattedTime(sys.currentDate(),"yyyyMMdd");
var appSql="select b.applicationid,b.applicationnm,b.applicationnm menunm from sys_pl_org_application a,sys_pl_application_release b,sys_pl_biz_application c where a.orgid=? and a.applicationid=b.applicationid and b.applicationid=c.applicationid and a.status='1' and b.status='1' and c.biz_status='20' and (a.expiration = '00000000' or a.expiration>'"+dt+"')";
var menuSql = "SELECT sys_pl_org_application.applicationid,sys_pl_menu_release.menuid, sys_pl_menu_release.menu_icon, sys_pl_menu_release.menunm, sys_pl_menu_release.uri, sys_pl_menu_release.menu_desc, sys_pl_application_release.orgid FROM sys_pl_org_application , sys_pl_application_release,sys_pl_menu_release  where sys_pl_org_application.applicationid=sys_pl_application_release.applicationid AND sys_pl_org_application.applicationid = sys_pl_menu_release.applicationid AND sys_pl_menu_release.applicationid=sys_pl_application_release.applicationid AND sys_pl_org_application.orgid=? AND sys_pl_org_application.status='1' AND sys_pl_application_release.status='1' AND sys_pl_menu_release.status='1'";
// var menuSql = "SELECT sys_pl_org_application.applicationid,sys_pl_menu_release.menuid, '0' p_menuid, '0' levels, sys_pl_menu_release.menu_icon, sys_pl_menu_release.menunm, sys_pl_menu_release.uri, '0' sorting_order, sys_pl_menu_release.menu_desc, sys_pl_application_release.orgid FROM sys_pl_org_application JOIN sys_pl_application_release ON sys_pl_org_application.applicationid=sys_pl_application_release.applicationid JOIN sys_pl_menu_release ON sys_pl_org_application.applicationid = sys_pl_menu_release.applicationid AND sys_pl_menu_release.applicationid=sys_pl_application_release.applicationid WHERE sys_pl_org_application.orgid=? AND sys_pl_org_application.status='1' AND sys_pl_application_release.status='1' AND sys_pl_menu_release.status='1'";
sql.query(appSql,[org],"result");
sql.query(menuSql, [org], "menus");

var result=sys.result.result;
var menus=sys.result.menus;
sys.setRetList(result,menus,[["applicationid","applicationid"]],"children");
sys.setRetData("0","","result");