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

var ra = 'testml开发用户组';
var rb = '基础项目开发用户组';

for (var i=0; i<10; ++i) {
  //sql.update("use afb9a9a1c80647e6a0d7e807f68e055a", null);
  sql.query("select ugnm from sys_ug where status='1' order by ugnm limit 1", null, "a");
  var a = sys.result.a[0].ugnm;
  if (a != ra) {
    sys.printValue(a);
    throw new Error("A bad index "+ i +', value '+ a);
  }
  
  sql.update("use fd0ec7186f9247daac2b3183b8782081", null);
  sql.query("select ugnm from sys_ug where status='1' order by ugnm limit 1", null, "b");
  var b = sys.result.b[0].ugnm;
  if (b != rb) {
    sys.printValue(b);
    throw new Error("B bad index "+ i +', value '+ b);
  }
}


sys.setRetData(0, 'ok');