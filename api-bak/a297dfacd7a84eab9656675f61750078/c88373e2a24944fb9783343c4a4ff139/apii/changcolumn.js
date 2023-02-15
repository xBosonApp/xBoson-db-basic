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

var ret = { api:{}, his: {}, add: {} };
sys.put('data', ret);

try {
  sql.query('Select orgid From sys_tenant', [], 'org');
  sys.result.org.forEach(function(o) {
    addZipColumn(o.orgid);
  });
  
  sql.commit();
} catch(e) {
  sql.rollback(); 
  sys.setRetData(1, e);
  return;
}

sys.setRetData(0, 'ok');


function addZipColumn(orgid) {
  var s  = `ALTER TABLE `+ orgid +`.sys_api_content 
            CHANGE COLUMN zip zip TINYINT UNSIGNED NULL DEFAULT '0'`;
  var s2 = `ALTER TABLE `+ orgid +`.sys_api_his_content 
            CHANGE COLUMN zip zip TINYINT UNSIGNED NULL DEFAULT '0'`;
  ret.add[orgid] = sql.update(s, [], '1') + sql.update(s2, [], '1');
}