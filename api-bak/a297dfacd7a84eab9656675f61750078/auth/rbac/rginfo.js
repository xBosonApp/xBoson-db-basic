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
// rginfo 角色组信息
var rg_id=sys.request.rg_id;
if (rg_id==null) {
  sys.setRetData("1","角色组ID未指定");
  return;
}
sql.query("select rg_id,rg_nm from sys_role_group where rg_id=?",[rg_id]);
sys.setRetData("0", null, "result");