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

// Oracle
// sql.connection('jdbc:oracle:thin:@10.0.0.7:1521:xe', 'system', 'oracle');

// MsSql
sql.connection("jdbc:sqlserver://10.0.0.7:1401; DatabaseName=master", "SA", "<12345678>");


try {
  sql.update(`
  Create Table test1 (
    id int
  )
  `);
} catch(e) {
  sql.update('truncate table test1');
}

for (var i=0; i<1000; ++i) {
  sql.update(`Insert Into test1 (id) values (?)`, [i]);
}

sys.setRetData(0, 'ok');