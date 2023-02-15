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
//同步菜单
var menuId = sys.request.menuid;
var orgid=sys.request.orgid;
if (menuId == null||orgid==null) {
	sys.setRetData("1");
  return;
}
var sql_Sel = "select m.menuid,m.menu_icon,m.menunm,m.p_menuid,m.pageid,p.pagenm,m.uri,m.menu_desc,m.orgid,m.status,m.sorting_order,m.levels from sys_menu m left join sys_page p on m.pageid=p.pageid where menuid=?";
sql.query(sql_Sel,[menuId],"result");
sys.setRetData("0","","result");