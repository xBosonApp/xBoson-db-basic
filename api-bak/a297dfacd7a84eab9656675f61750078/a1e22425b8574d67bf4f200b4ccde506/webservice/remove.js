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
"use strict";

var bind = [
  sys.request.getString('wsid', 1, 32),
  ];
  
var s = "DELETE FROM sys_webservice WHERE wsid = ?";

if (sql.update(s, bind) <=0) {
  sys.setRetData("5", "删除失败");
  return;
}
  
sys.setRetData(0, '配置已删除');