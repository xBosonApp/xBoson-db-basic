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
var s = "alter table sys_menu modify column uri varchar(1000)";
s = "ALTER TABLE 61a9ba99b94a4325ac747b4a9263df68.sys_menu CHANGE COLUMN uri uri VARCHAR(1000) NULL DEFAULT NULL COMMENT 'URI'";
sql.setAutoCommit(false);
sql.update(s);
sql.commit();
sys.setRetData(0, 'Do nothing.');