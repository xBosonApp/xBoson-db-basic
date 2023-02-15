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
console.log(">>>> ---------------------------------- Test list Functions.", list);
var assert = require("assert");

var sqlstr = "SELECT apiid, apinm FROM sys_apis";
sql.queryPaging(sqlstr, [], 2, 30, "p");
//sql.query(sqlstr, param, p);

var list = sys.result.p;

for (var i=0; i<list.length; ++i) {
  var item = list[i];
  console.log(i, item.apiid, item.apinm);
}
console.log(sys.result.p_count);


for (item in list) {
  console.log(item.apiid);
}