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

var _cache = { app:{}, org:{} };
var pm = require('pm').open();
var allProcess = pm.list();

for (var i in allProcess) {
  var p = allProcess[i];
  try {
    p.app = getAppName(p.app);
    p.org = getOrgName(p.org);
  } catch(e) {}
}

sys.addRetData('list', allProcess);
sys.setRetData(0, 'ok', 'list');


function getAppName(appid) {
  var name = _cache.app[appid];
  if (name) return name;
  
  var s = 'SELECT appnm FROM sys_apps Where appid=?';
  sql.query(s, [appid], 'names');
  name = _cache.app[appid] = sys.result.names[0].appnm;
  return name;
}


function getOrgName(orgid) {
  var name = _cache.org[orgid];
  if (name) return name;
  
  var s = 'SELECT de0810013j name FROM mdm_org Where orgid=?';
  sql.query(s, [orgid], 'names');
  name = _cache.org[orgid] = sys.result.names[0].name;
  return name;
}