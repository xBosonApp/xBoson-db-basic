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
var sqlmod = " select appid,moduleid,modulenm name from sys_modules where status = 1 and auflag =2 ";
  //var sqlapi = " select a.moduleid moduleid,apiid,apinm name from sys_apis a left join sys_modules b on a.moduleid=b.moduleid where a.status = 1 and b.auflag =2 and b.status=1 ";
  //substring_index(apinm,'#',1)
  var sqlapi = " select a.moduleid moduleid,apiid,apinm name,'' dimtag from sys_apis a left join sys_modules b on a.moduleid=b.moduleid where a.status = 1 and b.auflag =2 and b.status=1 ";    
  sql.query(sqlmod, [], "mods");
  var mod = sys.result.mods;
  
  sql.query(sqlapi, [], "apis");
  var api = sys.result.apis;
  
  
  
  sys.setRetList(mod, api, [["moduleid", "moduleid"]], "children");
  sys.setRetData("0","","mods");