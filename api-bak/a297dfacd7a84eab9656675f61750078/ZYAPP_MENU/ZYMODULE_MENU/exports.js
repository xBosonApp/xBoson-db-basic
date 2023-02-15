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

var filename = new Date() +'menu_export.zip';
var pack = require("pack");
var z = pack.createZipWriter(sys.getResponseStream(filename));

var index = 0;
var rs = sql.queryStream("Select * From sys_menu");
while (rs.hasNext()) {
  var row = rs.next();
  if (row.createdt) row.createdt = row.createdt.getTime();
  if (row.updatedt) row.updatedt = row.updatedt.getTime();
  z.add(index+'', JSON.stringify(row));
  ++index;
}
z.add("index", JSON.stringify({
  length : index,
  begin  : 0,
}));

rs.close();
z.close();