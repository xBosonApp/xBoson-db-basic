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

var s = [
`CREATE TABLE IF NOT EXISTS sys_webservice (
  wsid varchar(32) NOT NULL,
  wsname varchar(45) NOT NULL,
  wsnote varchar(500) CHARACTER SET utf8mb4 DEFAULT NULL,
  ws_mod_name varchar(45) NOT NULL COMMENT 'ws 模块名称',
  ws_func_name varchar(45) NOT NULL COMMENT '方法名称',
  ws_uri varchar(200) NOT NULL,
  ws_config_json varchar(5000) CHARACTER SET utf8mb4 NOT NULL,
  createdt datetime NOT NULL,
  updatedt datetime NOT NULL,
  status int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (wsid),
  UNIQUE KEY wsid_UNIQUE (wsid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='webservice'`,
];

s.forEach(function(ss) {
  sql.update(ss);
  sys.printValue("Success: "+ ss.substring(0, 50) +"...");
});

sys.setRetData(0, 'ok.');