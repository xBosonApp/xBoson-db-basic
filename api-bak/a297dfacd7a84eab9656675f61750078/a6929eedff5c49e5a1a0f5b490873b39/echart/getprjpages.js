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
var prjid = sys.request.prjid;
var pageid = sys.request.pageid;
var pagenm = sys.request.pagenm;
if (prjid == null) {
  sys.setRetData("1", "项目ID为空");
  return;
}
var sql = "select pageid id,pagenm name,pagenm text from sys_page where prjid=? and status='1'";
var param = [prjid];
if (pageid != null) {
  sql = sql + " and pageid like ?";
  list.add(param, "%" + pageid + "%");
}
if (pagenm != null) {
  sql = sql + " and pagenm like ?";
  list.add(param, "%" + pagenm + "%");
}


sql = sql + " order by pageid";
sql.query(sql, param,"result");

sys.setRetData("0", "", "result");