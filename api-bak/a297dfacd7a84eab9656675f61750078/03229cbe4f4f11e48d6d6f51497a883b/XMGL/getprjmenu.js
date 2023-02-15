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
//id:getprjmenu
//name:获取指定项目menu
var prjid=sys.request.prjid;
if (prjid == null) {
  sys.setRetData("1", "未指定项目");
  return;
}

var strSql="select menuid,p_menuid,levels,menu_icon,menunm,pageid,uri,sorting_order,menu_desc,orgid,prjid,status,createdt,updatedt,case when status='1' then 'true' else 'false' end checked from sys_menu where prjid=?";
sql.query(strSql, [prjid], "data");
var result = sys.transformTreeData(sys.result.data,"menuid","p_menuid","children");
sys.addRetData(result,"result");
sys.setRetData("0","","result");