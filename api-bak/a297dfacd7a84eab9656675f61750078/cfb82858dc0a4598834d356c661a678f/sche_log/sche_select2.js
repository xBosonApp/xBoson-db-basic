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
var params = [];
var sqls = `
  Select 
    scheduleid as id, 
    schedulenm as name, 
    schedulenm as text 
  From 
    sys_pl_task_scheduler
`;

if (sys.getUserAdminFlag() != '1') {
  sqls += ' Where orgid = ? ';
  list.add(params, sys.request.org);
}

sql.query(sqls, params);

sys.setRetData("0", "ok", "result");