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
//插入sys_menu
if (menuId == null) {
  sys.setRetData("1");
  return;
}
var sql_Sel = "select menuid,p_menuid,levels,menu_icon,menunm,pageid,uri,sorting_order,menu_desc,status from sys_menu where menuid=?";
var paramSel = [menuId];
sql.query(sql_Sel,paramSel,"result");
sys.setRetData("0","","result");